import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useAppSelector } from '@/hooks';
import { Button, Card, Form, Select, Tooltip } from 'antd';
import { InfoCircleOutlined } from '@ant-design/icons';
import Filters from './Filters';
import { makeBeaconQuery } from '../../features/beacon/beaconQuery';
import BeaconSearchResults from './BeaconSearchResults';
import VariantsForm from './VariantsForm';

// TODOs
// switch to one-based (ie convert one -> zero here)
// example searches, either hardcoded or configurable
// only render beacon tab if there's a beacon for this instance
// only render variants part of the form if variants are present

const BeaconQueryUi = () => {
  const config = useSelector((state) => state?.beaconConfig?.config);
  const beaconAssemblyIds = Object.keys(config?.overview?.counts?.variants ?? {});
  const [filters, setFilters] = useState([]);
  const [form] = Form.useForm();
  const querySections = useAppSelector((state) => state.query.querySections);
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
    return filters.filter((f) => f.active).map((f) => ({
        id: values[`filterId${f.index}`],
        operator: "=",
        value: values[`filterValue${f.index}`],
      }));
  };

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

  const handleClearForm = () => {
    setFilters([]);
    form.resetFields();
  };

  const wrapperStyle = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justfifyContent: "space-between"
  };

  const variantsFormStyle = {
    maxWidth: '1200px',
    display: 'flex',
    flexWrap: 'wrap',
  };

  const cardBodyStyle = {
    padding: "0 24px 5px 24px",
  }

  const cardHeadStyle = {
    border: "0"
  }

  const innerCardStyle = {
    margin: "0 5px 0 0"
  }

  const buttonAreaStyle = {
    padding: "24px"
  }

  const buttonStyle = {
    margin: "0 10px 0 0"
  }

  const variantsHelp = "sometext about variants"
  const metadataHelp = "some text about metadata"

  const SearchToolTip = ({text}) => {return <Tooltip title={text}><InfoCircleOutlined/></Tooltip>}
  
  
// add row/col/gutter? why isn't flex working?


  return (
    <div style={wrapperStyle}>
      <BeaconSearchResults />
      <Card title="Search" style={{ borderRadius: '10px', maxWidth: '1200px' }} bodyStyle={cardBodyStyle} headStyle={cardHeadStyle}>
      <Form form={form} onFinish={handleFinish} style={variantsFormStyle} layout="vertical">
      <Card title='Variants' style={innerCardStyle} headStyle={cardHeadStyle} bodyStyle={cardBodyStyle} extra={<SearchToolTip text={variantsHelp}/>}>
        <VariantsForm assemblyIdOptions={assemblyIdOptions} form={form} /></Card>
          <Card title='Metadata' style={innerCardStyle} headStyle={cardHeadStyle} bodyStyle={cardBodyStyle} extra={<SearchToolTip text={variantsHelp}/>}>
            <Filters filters={filters} setFilters={setFilters} form={form} querySections={querySections} />
            </Card>
            <div style={buttonAreaStyle}>
          <Button type="primary" htmlType="submit" style={buttonStyle} >
            Search Beacon
          </Button>
          <Button onClick={handleClearForm} style={buttonStyle}>
          Clear Form
        </Button>
        </div>
      </Form>
      </Card>
    </div>
  );
};

export default BeaconQueryUi;
