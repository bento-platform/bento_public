import React, { useEffect, useState } from 'react';
import { useAppSelector, useAppDispatch } from '@/hooks';
import { useTranslation } from 'react-i18next';
import { Button, Card, Col, Form, Row, Tooltip } from 'antd';
import { InfoCircleOutlined } from '@ant-design/icons';
import Filters from './Filters';
import BeaconSearchResults from './BeaconSearchResults';
import VariantsForm from './VariantsForm';
import { makeBeaconQuery } from '@/features/beacon/beaconQuery.store';
import { BeaconQueryPayload, FormFilter, FormValues, PayloadFilter, PayloadVariantsQuery } from '@/types/beacon';
import {
  WRAPPER_STYLE,
  FORM_ROW_GUTTERS,
  CARD_STYLE,
  CARD_BODY_STYLE,
  CARD_HEAD_STYLE,
  BUTTON_AREA_STYLE,
  BUTTON_STYLE,
} from '@/constants/beaconConstants';
import { DEFAULT_TRANSLATION } from '@/constants/configConstants';

// TODOs
// form verification
// example searches, either hardcoded or configurable
// better help text (#1691)

const VARIANTS_HELP =
  'Variants search requires the fields Chromosome, Variant start, Assembly ID, and at least one of Variant end or Alternate base(s).';
const METADATA_HELP = 'Search over clinical or phenotypic properties.';
const STARTER_FILTER = { index: 1, active: true };

const BeaconQueryUi = () => {
  const { t: td } = useTranslation(DEFAULT_TRANSLATION);
  const [form] = Form.useForm();
  const [filters, setFilters] = useState<FormFilter[]>([STARTER_FILTER]);
  const [hasVariants, setHasVariants] = useState<boolean>(false);
  const isFetchingBeaconConfig = useAppSelector((state) => state.beaconConfig.isFetchingBeaconConfig);
  const beaconAssemblyIds = useAppSelector((state) => state.beaconConfig.beaconAssemblyIds);
  const querySections = useAppSelector((state) => state.query.querySections);
  const beaconUrl = useAppSelector((state) => state.config?.beaconUrl);

  const dispatch = useAppDispatch();
  const launchEmptyQuery = () => dispatch(makeBeaconQuery(requestPayload({}, [])));
  const formInitialValues = { 'Assembly ID': beaconAssemblyIds.length === 1 && beaconAssemblyIds[0] };
  const uiInstructions = hasVariants ? 'Search by genomic variants, clinical metadata or both.' : '';

  useEffect(() => {
    // wait for config
    if (!beaconUrl) {
      return;
    }

    // retrieve stats
    launchEmptyQuery();

    setHasVariants(beaconAssemblyIds.length > 0);

    // set assembly id options matching what's in gohan
    form.setFieldsValue(formInitialValues);
  }, [isFetchingBeaconConfig]);

  // beacon request handling

  const packageFilters = (values: FormValues): PayloadFilter[] => {
    // ignore optional first filter when left blank
    if (filters.length === 1 && !values.filterId1) {
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

  const requestPayload = (query: PayloadVariantsQuery, payloadFilters: PayloadFilter[]): BeaconQueryPayload => ({
    meta: { apiVersion: '2.0.0' },
    query: { requestParameters: { g_variant: query }, filters: payloadFilters },
    bento: { showSummaryStatistics: true },
  });

  // following GA4GH recommendations, UI is one-based, but API is zero-based, "half-open"
  // so to convert to zero-based, we only modify the start value
  // see eg https://genome-blog.soe.ucsc.edu/blog/2016/12/12/the-ucsc-genome-browser-coordinate-counting-systems/
  const convertToZeroBased = (start: string) => Number(start) - 1;

  const packageBeaconJSON = (values: FormValues) => {
    let query = {} as PayloadVariantsQuery;
    const payloadFilters = packageFilters(values);
    const hasVariantsQuery = values?.['Chromosome'] || values?.['Variant start'] || values?.['Reference base(s)'];
    if (hasVariantsQuery) {
      query = {
        referenceName: values['Chromosome'],
        start: [convertToZeroBased(values['Variant start'])],
        assemblyId: values['Assembly ID'],
      };
      if (values['Variant end']) {
        query.end = [Number(values['Variant end'])];
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

  const handleFinish = (formValues: FormValues) => {
    const jsonPayload = packageBeaconJSON(formValues);
    dispatch(makeBeaconQuery(jsonPayload));
  };

  const handleClearForm = () => {
    setFilters([STARTER_FILTER]);
    form.resetFields();
    form.setFieldsValue(formInitialValues);
    launchEmptyQuery();
  };

  const SearchToolTip = ({ text }: { text: string }) => {
    return (
      <Tooltip title={td(text)}>
        <InfoCircleOutlined />
      </Tooltip>
    );
  };

  return (
    <div style={WRAPPER_STYLE}>
      <BeaconSearchResults />
      <Card
        title={td('Search')}
        style={{ borderRadius: '10px', maxWidth: '1200px', width: '100%' }}
        bodyStyle={CARD_BODY_STYLE}
        headStyle={CARD_HEAD_STYLE}
      >
        <p style={{ margin: '-8px 0 8px 0', padding: '0', color: 'grey' }}>{td(uiInstructions)}</p>
        <Form form={form} onFinish={handleFinish} layout="vertical">
          <Row gutter={FORM_ROW_GUTTERS}>
            {hasVariants && (
              <Col xs={24} lg={12}>
                <Card
                  title={td('Variants')}
                  style={CARD_STYLE}
                  headStyle={CARD_HEAD_STYLE}
                  bodyStyle={CARD_BODY_STYLE}
                  extra={<SearchToolTip text={VARIANTS_HELP} />}
                >
                  <VariantsForm beaconAssemblyIds={beaconAssemblyIds} />
                </Card>
              </Col>
            )}
            <Col xs={24} lg={hasVariants ? 12 : 24}>
              <Card
                title={td('Metadata')}
                style={CARD_STYLE}
                headStyle={CARD_HEAD_STYLE}
                bodyStyle={CARD_BODY_STYLE}
                extra={<SearchToolTip text={METADATA_HELP} />}
              >
                <Filters filters={filters} setFilters={setFilters} form={form} querySections={querySections} />
              </Card>
            </Col>
          </Row>
          <Row>
            <Col span={24}>
              <div style={BUTTON_AREA_STYLE}>
                <Button type="primary" htmlType="submit" style={BUTTON_STYLE}>
                  {td('Search Beacon')}
                </Button>
                <Button onClick={handleClearForm} style={BUTTON_STYLE}>
                  {td('Clear Form')}
                </Button>
              </div>
            </Col>
          </Row>
        </Form>
      </Card>
    </div>
  );
};

export default BeaconQueryUi;
