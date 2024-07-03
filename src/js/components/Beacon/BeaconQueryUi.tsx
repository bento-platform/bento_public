import React, { useEffect, useState, ReactNode } from 'react';
import { useAppSelector, useAppDispatch, useTranslationDefault, useBeaconWithAuthIfAllowed } from '@/hooks';
import { Button, Card, Col, Form, Row, Space, Tooltip, Typography } from 'antd';
import { InfoCircleOutlined } from '@ant-design/icons';
import { useIsAuthenticated } from 'bento-auth-js';
import Filters from './BeaconCommon/Filters';
import BeaconSearchResults from './BeaconSearchResults';
import BeaconErrorMessage from './BeaconCommon/BeaconErrorMessage';
import VariantsForm from './BeaconCommon/VariantsForm';
import { makeBeaconQuery } from '@/features/beacon/beaconQuery.store';
import { BeaconQueryPayload, FormFilter, FormValues, PayloadFilter, PayloadVariantsQuery } from '@/types/beacon';
import {
  WRAPPER_STYLE,
  FORM_ROW_GUTTERS,
  CARD_STYLE,
  BUTTON_AREA_STYLE,
  BUTTON_STYLE,
  CARD_STYLES,
} from '@/constants/beaconConstants';

import { BOX_SHADOW } from '@/constants/overviewConstants';
import Loader from '@/components/Loader';
const { Text, Title } = Typography;
// TODOs
// example searches, either hardcoded or configurable
// more intuitive variants ui

const STARTER_FILTER = { index: 1, active: true };

// complexity of instructions suggests the form isn't intuitive enough
const VARIANTS_INSTRUCTIONS_TITLE = 'Variant search';
const VARIANTS_INSTRUCTIONS_LINE1a =
  'To search for all variants inside a range: fill both "Variant start" and "Variant end",';
const VARIANTS_INSTRUCTIONS_LINE1b =
  'all variants inside the range will be returned. You can optionally filter by reference or alternate bases.';

const VARIANTS_INSTRUCTIONS_LINE2a =
  'To search for a variant at a particular position, either set "Variant end" to the same value in "Variant start",';
const VARIANTS_INSTRUCTIONS_LINE2b = 'or fill in values for both reference and alternate bases.';
const VARIANTS_INSTRUCTIONS_LINE3 = '"Chromosome", "Variant start" and "Assembly ID" are always required.';
const VARIANTS_INSTRUCTIONS_LINE4a = 'Coordinates are one-based.';
const VARIANTS_INSTRUCTIONS_LINE4b = 'Leave this form blank to search by metadata only.';
const METADATA_INSTRUCTIONS = 'Search over clinical or phenotypic properties.';
const VARIANTS_FORM_ERROR_MESSAGE =
  'Variants form should include either an end position or both reference and alternate bases';

const BeaconQueryUi = () => {
  const td = useTranslationDefault();
  const [form] = Form.useForm();
  const [filters, setFilters] = useState<FormFilter[]>([STARTER_FILTER]);
  const [hasVariants, setHasVariants] = useState<boolean>(false);
  const [hasFormError, setHasFormError] = useState<boolean>(false);
  const [formErrorMessage, setFormErrorMessage] = useState<string>('');

  // remember if user closed alert, so we can force re-render of a new one later
  const [errorAlertClosed, setErrorAlertClosed] = useState<boolean>(false);

  const isFetchingBeaconConfig = useAppSelector((state) => state.beaconConfig.isFetchingBeaconConfig);
  const beaconAssemblyIds = useAppSelector((state) => state.beaconConfig.beaconAssemblyIds);
  const querySections = useAppSelector((state) => state.query.querySections);
  const hasApiError = useAppSelector((state) => state.beaconQuery.hasApiError);
  const apiErrorMessage = useAppSelector((state) => state.beaconQuery.apiErrorMessage);

  const isAuthenticated = useIsAuthenticated();

  const dispatch = useAppDispatch();
  const launchEmptyQuery = () => dispatch(makeBeaconQuery(requestPayload({}, [])));
  const formInitialValues = { 'Assembly ID': beaconAssemblyIds.length === 1 && beaconAssemblyIds[0] };
  const uiInstructions = hasVariants ? 'Search by genomic variants, clinical metadata or both.' : '';

  const hasError = hasFormError || hasApiError;
  const showError = hasError && !errorAlertClosed;

  // should not be possible to have both errors simultaneously
  // and api error is more important
  const errorMessage = apiErrorMessage || formErrorMessage;

  const clearFormError = () => {
    setHasFormError(false);
    setFormErrorMessage('');
  };

  useEffect(() => {
    // retrieve stats
    launchEmptyQuery();

    setHasVariants(beaconAssemblyIds.length > 0);

    // set assembly id options matching what's in gohan
    form.setFieldsValue(formInitialValues);
  }, [isFetchingBeaconConfig, isAuthenticated]);

  // Disables max query param if user is authenticated and authorized
  useBeaconWithAuthIfAllowed();

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

  const variantsFormValid = (formValues: FormValues) => {
    // valid variant form states:
    // empty except possibly autofilled assemblyID (no variant query)
    // chrom, start, assemblyID, end (range query)
    // chrom, start, assemblyID, alt, ref (sequence query)
    // https://docs.genomebeacons.org/variant-queries/

    // as an alternative, we could require "end" always, then form logic would be less convoluted
    // just set start=end to search for SNPs

    const empty = !(
      formValues['Chromosome'] ||
      formValues['Variant start'] ||
      formValues['Variant end'] ||
      formValues['Reference base(s)'] ||
      formValues['Alternate base(s)']
    );
    const rangeQuery =
      formValues['Chromosome'] && formValues['Variant start'] && formValues['Variant end'] && formValues['Assembly ID'];

    const sequenceQuery =
      formValues['Chromosome'] &&
      formValues['Variant start'] &&
      formValues['Assembly ID'] &&
      formValues['Reference base(s)'] &&
      formValues['Alternate base(s)'];
    return empty || rangeQuery || sequenceQuery;
  };

  const handleFinish = (formValues: FormValues) => {
    // if bad form, block submit and show user error
    if (!variantsFormValid(formValues)) {
      setHasFormError(true);
      setErrorAlertClosed(false);
      setFormErrorMessage(td(VARIANTS_FORM_ERROR_MESSAGE));
      return;
    }

    clearFormError();
    setErrorAlertClosed(false);
    const jsonPayload = packageBeaconJSON(formValues);
    dispatch(makeBeaconQuery(jsonPayload));
  };

  const handleClearForm = () => {
    setFilters([STARTER_FILTER]);
    form.resetFields();
    form.setFieldsValue(formInitialValues);
    clearFormError();
    setErrorAlertClosed(false);
    launchEmptyQuery();
  };

  const handleValuesChange = (_: Partial<FormValues>, allValues: FormValues) => {
    form.validateFields(['Chromosome', 'Variant start', 'Variant end', 'Reference base(s)', 'Alternate base(s)']);

    // clear any existing errors if form now valid
    if (variantsFormValid(allValues)) {
      clearFormError();
    }
    // can also check filter values here (to e.g. avoid offering duplicate options)
  };

  // Tooltips

  const ToolTipText = ({ children }: { children: string }) => <Text style={{ color: 'white' }}>{children}</Text>;

  const SearchToolTip = ({ children }: { children: ReactNode }) => {
    return (
      <Tooltip title={children} overlayInnerStyle={{ display: 'inline-block' }}>
        <InfoCircleOutlined />
      </Tooltip>
    );
  };

  const variantsInstructions = (
    <Space direction="vertical" style={{ minWidth: '510px' }}>
      <Title level={4} style={{ color: 'white', marginTop: '10px' }}>
        {VARIANTS_INSTRUCTIONS_TITLE}
      </Title>
      <ToolTipText>{td(VARIANTS_INSTRUCTIONS_LINE1a) + ' ' + td(VARIANTS_INSTRUCTIONS_LINE1b)}</ToolTipText>
      <ToolTipText>{td(VARIANTS_INSTRUCTIONS_LINE2a) + ' ' + td(VARIANTS_INSTRUCTIONS_LINE2b)}</ToolTipText>
      <ToolTipText>{td(VARIANTS_INSTRUCTIONS_LINE3)}</ToolTipText>
      <ToolTipText>{td(VARIANTS_INSTRUCTIONS_LINE4a) + ' ' + td(VARIANTS_INSTRUCTIONS_LINE4b)}</ToolTipText>
    </Space>
  );

  const metadataInstructions = <ToolTipText>{td(METADATA_INSTRUCTIONS)}</ToolTipText>;
  const isFetchingBeaconQuery = useAppSelector((state) => state.beaconQuery.isFetchingQueryResponse);

  return isFetchingBeaconConfig ? (
    <Loader />
  ) : (
    <div style={WRAPPER_STYLE}>
      <BeaconSearchResults />
      <Card
        title={td('Search')}
        style={{ borderRadius: '10px', maxWidth: '1200px', width: '100%', ...BOX_SHADOW }}
        styles={CARD_STYLES}
      >
        <p style={{ margin: '-8px 0 8px 0', padding: '0', color: 'grey' }}>{td(uiInstructions)}</p>
        <Form form={form} onFinish={handleFinish} layout="vertical" onValuesChange={handleValuesChange}>
          <Row gutter={FORM_ROW_GUTTERS}>
            {hasVariants && (
              <Col xs={24} lg={12}>
                <Card
                  title={td('Variants')}
                  style={CARD_STYLE}
                  styles={CARD_STYLES}
                  extra={<SearchToolTip>{variantsInstructions}</SearchToolTip>}
                >
                  <VariantsForm beaconAssemblyIds={beaconAssemblyIds} />
                </Card>
              </Col>
            )}
            <Col xs={24} lg={hasVariants ? 12 : 24}>
              <Card
                title={td('Metadata')}
                style={CARD_STYLE}
                styles={CARD_STYLES}
                extra={<SearchToolTip>{metadataInstructions} </SearchToolTip>}
              >
                <Filters filters={filters} setFilters={setFilters} form={form} querySections={querySections} isNetworkQuery={false} />
              </Card>
            </Col>
          </Row>
          <Row>
            <Col span={24}>
              {showError && (
                <BeaconErrorMessage
                  message={`${td('Beacon error')}: ${errorMessage}`}
                  onClose={() => setErrorAlertClosed(true)}
                />
              )}
              <div style={BUTTON_AREA_STYLE}>
                <Button type="primary" htmlType="submit" loading={isFetchingBeaconQuery} style={BUTTON_STYLE}>
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
