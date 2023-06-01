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
// form verification
// example searches, either hardcoded or configurable
// only render variants part of the form if variants are present
// better helptext (#1691)

const UI_INSTRUCTIONS = 'Search by genomic variants, clinical metadata or both.';
const VARIANTS_HELP =
  'Variants search requires the fields Chromosome, Variant start, Assembly ID, and at least one of Variant end or Alternate base(s).';
const METADATA_HELP = 'Search over clinical or phenotypic properties.';
const STARTER_FILTER = { index: 1, active: true };

const WRAPPER_STYLE = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'space-between',
};

const VARIANTS_FORM_STYLE = {
  maxWidth: '1200px',
  display: 'flex',
  flexWrap: 'wrap',
};

const CARD_BODY_STYLE = {
  padding: '0 24px 5px 24px',
};

const CARD_HEAD_STYLE = {
  border: '0',
};

const INNER_CARD_STYLE = {
  margin: '0 5px 0 0',
};

const BUTTON_AREA_STYLE = {
  padding: '20px 5px',
};

const BUTTON_STYLE = {
  margin: '0 10px 0 0',
};

const BeaconQueryUi = () => {
  const config = useSelector((state) => state?.beaconConfig?.config);
  const beaconAssemblyIds = Object.keys(config?.overview?.counts?.variants ?? {});
  const [filters, setFilters] = useState([STARTER_FILTER]);
  const [form] = Form.useForm();
  const querySections = useAppSelector((state) => state.query.querySections);
  const beaconUrl = useAppSelector((state) => state.config?.beaconUrl);

  const dispatch = useDispatch();
  const launchEmptyQuery = () => dispatch(makeBeaconQuery(requestPayload({}, [])));

  // get beacon stats on first render
  useEffect(() => {
    // wait for config
    if (!beaconUrl) {
      return;
    }
    launchEmptyQuery();
  }, [config]);

  // set assembly id options mataching what's in gohan
  useEffect(() => {
    form.setFieldsValue(formInitialValues);
  }, [config]);

  const assemblyIdOptions = beaconAssemblyIds.map((assembly) => (
    <Select.Option key={assembly} value={assembly}>
      {assembly}
    </Select.Option>
  ));
  const formInitialValues = { 'Assembly ID': beaconAssemblyIds.length == 1 && beaconAssemblyIds[0] };

  // beacon request handling

  const packageFilters = (values) => {
    // ignore optional first filter when left blank
    if (filters.length == 1 && !values.filterId1) {
      return [];
    }

    return filters
      .filter((f) => f.active)
      .map((f) => ({
        id: values[`filterId${f.index}`],
        operator: '=',
        value: values[`filterValue${f.index}`],
      }));
  };

  const requestPayload = (query, payloadFilters) => ({
    meta: { apiVersion: '2.0.0' },
    query: { requestParameters: { g_variant: query }, filters: payloadFilters },
    bento: { showSummaryStatitics: 'true' },
  });

  // following GA4GH recommendations, UI is one-based, but API is zero-based, "half-open"
  // so to convert to zero-based, we only modify the start value
  // see eg https://genome-blog.soe.ucsc.edu/blog/2016/12/12/the-ucsc-genome-browser-coordinate-counting-systems/
  const convertToZeroBased = (start) => Number(start) - 1;

  const packageBeaconJSON = (values) => {
    let query = {};
    const payloadFilters = packageFilters(values);
    const hasVariantsQuery = values?.['Chromosome'] || values?.['Variant start'] || values?.['Reference base(s)'];
    if (hasVariantsQuery) {
      query = {
        referenceName: values['Chromosome'],
        start: [convertToZeroBased(values['Variant start'])],
        assemblyId: values['Assembly ID'],
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

    return requestPayload(query, payloadFilters);
  };

  // form utils

  const handleFinish = (formValues) => {
    const jsonPayload = packageBeaconJSON(formValues);
    dispatch(makeBeaconQuery(jsonPayload));
  };

  const handleClearForm = () => {
    setFilters([STARTER_FILTER]);
    form.resetFields();
    form.setFieldsValue(formInitialValues);
    launchEmptyQuery();
  };

  const SearchToolTip = ({ text }) => {
    return (
      <Tooltip title={text}>
        <InfoCircleOutlined />
      </Tooltip>
    );
  };

  return (
    <div style={WRAPPER_STYLE}>
      <BeaconSearchResults />
      <Card
        title="Search"
        style={{ borderRadius: '10px', maxWidth: '1200px' }}
        bodyStyle={CARD_BODY_STYLE}
        headStyle={CARD_HEAD_STYLE}
      >
        <p style={{ margin: '-10px 0 5px 5px', padding: '0', color: 'grey' }}>{UI_INSTRUCTIONS}</p>
        <Form form={form} onFinish={handleFinish} style={VARIANTS_FORM_STYLE} layout="vertical">
          <Card
            title="Variants"
            style={INNER_CARD_STYLE}
            headStyle={CARD_HEAD_STYLE}
            bodyStyle={CARD_BODY_STYLE}
            extra={<SearchToolTip text={VARIANTS_HELP} />}
          >
            <VariantsForm assemblyIdOptions={assemblyIdOptions} form={form} />
          </Card>
          <Card
            title="Metadata"
            style={INNER_CARD_STYLE}
            headStyle={CARD_HEAD_STYLE}
            bodyStyle={CARD_BODY_STYLE}
            extra={<SearchToolTip text={METADATA_HELP} />}
          >
            <Filters filters={filters} setFilters={setFilters} form={form} querySections={querySections} />
          </Card>
          <div style={BUTTON_AREA_STYLE}>
            <Button type="primary" htmlType="submit" style={BUTTON_STYLE}>
              Search Beacon
            </Button>
            <Button onClick={handleClearForm} style={BUTTON_STYLE}>
              Clear Form
            </Button>
          </div>
        </Form>
      </Card>
    </div>
  );
};

export default BeaconQueryUi;
