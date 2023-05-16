import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useAppSelector } from '@/hooks';
import { Input, Form, Button, Select, Space, Tooltip } from 'antd';
import Filters from './Filters';
import { makeBeaconQuery } from '../../features/beacon/beaconQuery';
import BeaconSearchResults from './BeaconSearchResults';
import VariantsForm from './VariantsForm';

// TODOs
// switch to one-based (ie convert one -> zero here)
// example searches, either hardcoded or configurable
// only render beacon tab if there's a beacon for this instance

const BeaconQueryUi = () => {
  const { response } = useSelector((state) => state.beaconQuery);
  const config = useSelector((state) => state?.beaconConfig?.config);
  const beaconAssemblyIds = Object.keys(config?.overview?.counts?.variants ?? {});
  const [filters, setFilters] = useState([]);
  const [form] = Form.useForm();
  const querySections = useAppSelector((state) => state.query.querySections);
  const maxFilters = useAppSelector((state) => state.config.maxQueryParameters);
  const beaconUrl = useAppSelector((state) => state.config?.beaconUrl);

  const dispatch = useDispatch();

  const assemblyIdOptions = beaconAssemblyIds.map((assembly) => (
    <Select.Option key={assembly} value={assembly}>
      {assembly}
    </Select.Option>
  ));
  const formInitialValues = { 'Assembly Id': beaconAssemblyIds.length == 1 && beaconAssemblyIds[0] };

  // get beacon stats on first render
  useEffect(() => {
    // wait for config
    if (!beaconUrl) {
      return;  
    }  
    const payload = packageBeaconJSON({})
    dispatch(makeBeaconQuery(payload));
  }, [config])


  useEffect(() => {
    console.log('setting form initial values');
    form.setFieldsValue(formInitialValues);
  }, [form, formInitialValues]);


  const packageFilters = (values) => {
    return filters
      .filter((f) => f.active)
      .map((f) => ({
        id: values[`filterId${f.index}`],
        operator: "=",
        value: values[`filterValue${f.index}`],
      }));
  };

  const newFilter = (n) => ({ index: `${n}`, active: true});
  

  const removeFilter = (filter) => {
    // set to active: false
    setFilters(filters.map(f => f.index == filter.index? ({ index: filter.index, active: false}) : f))
  }
  const activeFilters = filters.filter(f => f.active)
  const hasMaxFilters = activeFilters.length >= maxFilters;

  const packageBeaconJSON = (values) => {
    let query = {};

    const payloadFilters = packageFilters(values);

    const hasVariantsQuery = values['Chromosome'] || values['Variant start'] || values['Reference base(s)'];
    if (hasVariantsQuery) {
      query = {
        referenceName: values['Chromosome'],
        start: [values['Variant start']],
        assemblyId: values['Assembly Id'],
      };
      if (values['Variant end']) {
        query.end = [values['Variant end']];
      }
      if (values['Reference base(s)']) {
        query.referenceBases = values['Reference base(s)'];
      }
      if (values['Alternate base(s)']) {
        query.alternateBases = values['Alternate base(s)'];
      }
    }

    const payload = {
      meta: { apiVersion: '2.0.0' },
      query: { requestParameters: { g_variant: query }, filters: payloadFilters },
      bento: { showSummaryStatitics: 'true' },
    };

    return payload;
  };

  const handleFinish = (formValues) => {
    console.log('Received values of form: ');
    console.log({ formValues: formValues });
    const jsonPayload = packageBeaconJSON(formValues);

    console.log({ queryPayload: jsonPayload });

    dispatch(makeBeaconQuery(jsonPayload));
  };

  const handleAddFilter = () => {
    const filterIndex = filters.length + 1;
    const f = newFilter(filterIndex);
    setFilters((filters) => [...filters, f]);
  };

  const handleRemoveFilters = () => {
    setFilters([]);
  };

  const handleClearForm = () => {
    handleRemoveFilters();
    form.resetFields();
  };

  const wrapperStyle = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  };

  const filterAreaStyle = {
    marginTop: '25px',
    marginLeft: '50px',
  };

  const buttonStyle = { margin: '10px 0' };

  const buttonAreaStyle = {
    display: 'flex',
    padding: 0,
  };

  const variantsFormStyle = {
    maxWidth: '1200px',
    padding: 24,
    display: 'flex',
    flexWrap: 'wrap',
  };

  const submitButtonStyle = { margin: '10px 0 0 50px' };

  return (
    <div style={wrapperStyle}>
      <BeaconSearchResults />
      <Form form={form} onFinish={handleFinish} style={variantsFormStyle} layout="vertical">
        <VariantsForm assemblyIdOptions={assemblyIdOptions} form={form} />
        <Form.Item>
          <div style={filterAreaStyle}>
            <div style={buttonAreaStyle}>
              <Tooltip title={hasMaxFilters ? `maximum of ${maxFilters} filters permitted` : null}>
                <Button style={buttonStyle} onClick={handleAddFilter} disabled={hasMaxFilters}>
                  Add Filter
                </Button>
              </Tooltip>
              <Button style={buttonStyle} onClick={handleRemoveFilters}>
                Clear Filters
              </Button>
              <Button style={{ ...buttonStyle, marginLeft: '20px' }} onClick={handleClearForm}>
                Clear Form
              </Button>
            </div>
            <Filters filters={filters} form={form} querySections={querySections} removeFilter={removeFilter} />
          </div>
          <Button style={submitButtonStyle} type="primary" htmlType="submit">
            Search Beacon
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default BeaconQueryUi;
