import React, { useEffect, useState } from 'react';
import { useAppSelector, useAppDispatch, useTranslationDefault } from '@/hooks';

import { Button, Card, Col, Form, Row, Space, Switch, Tooltip, Typography } from 'antd';
import VariantsForm from '../Beacon/VariantsForm';
import Filters from './Filters';
import SearchToolTip from './ToolTips/SearchToolTip';
import VariantsInstructions from './ToolTips/VariantsInstructions';
import BeaconErrorMessage from '../Beacon/BeaconErrorMessage';
import { MetadataInstructions } from './ToolTips/MetadataInstructions';
import {
  BeaconAssemblyIds,
  BeaconQueryPayload,
  BeaconQueryThunk,
  FormFilter,
  FormValues,
  PayloadFilter,
  PayloadVariantsQuery,
} from '@/types/beacon';
import { Section } from '@/types/search';
import { useIsAuthenticated } from 'bento-auth-js';

const VARIANTS_FORM_ERROR_MESSAGE =
  'Variants form should include either an end position or both reference and alternate bases';

import { BOX_SHADOW } from '@/constants/overviewConstants';
import {
  WRAPPER_STYLE,
  FORM_ROW_GUTTERS,
  CARD_STYLE,
  BUTTON_AREA_STYLE,
  BUTTON_STYLE,
  CARD_STYLES,
} from '@/constants/beaconConstants';
import { SwitcherTwoTone } from '@ant-design/icons';

const STARTER_FILTER = { index: 1, active: true };

const BeaconQueryFormUi = ({
  isFetchingConfig, //to remove?, don't render this component until config is known (?)
  isFetchingQueryResponse, //network query is "fire-and-forget" so this doesn't apply here
  isNetworkQuery,
  beaconAssemblyIds,
  querySections,
  launchQuery,
}: BeaconQueryFormUiProps) => {
  const td = useTranslationDefault();
  const [form] = Form.useForm();

  const [filters, setFilters] = useState<FormFilter[]>([STARTER_FILTER]);

  const [hasFormError, setHasFormError] = useState<boolean>(false);
  const [formErrorMessage, setFormErrorMessage] = useState<string>('');
  // remember if user closed alert, so we can force re-render of a new one later
  const [errorAlertClosed, setErrorAlertClosed] = useState<boolean>(false);
  const [unionNetworkFilters, setUnionNetworkFilters] = useState<boolean>(false);

  const hasVariants = beaconAssemblyIds.length > 0;
  const formInitialValues = { 'Assembly ID': beaconAssemblyIds.length === 1 && beaconAssemblyIds[0] };
  const uiInstructions = hasVariants ? 'Search by genomic variants, clinical metadata or both.' : '';

  const hasApiError = isNetworkQuery ? false : useAppSelector((state) => state.beaconQuery.hasApiError);
  const apiErrorMessage = isNetworkQuery ? false : useAppSelector((state) => state.beaconQuery.apiErrorMessage);

  const hasError = hasFormError || hasApiError;
  const showError = hasError && !errorAlertClosed;

  // should not be possible to have both errors simultaneously
  // and api error is more important
  const errorMessage = apiErrorMessage || formErrorMessage;

  const clearFormError = () => {
    setHasFormError(false);
    setFormErrorMessage('');
  };

  const handleNetworkFilterToggle = () => {
    setUnionNetworkFilters(!unionNetworkFilters);
  };

  const dispatch = useAppDispatch();
  const isAuthenticated = useIsAuthenticated();
  const launchEmptyQuery = () => dispatch(launchQuery(requestPayload({}, [])));

  useEffect(() => {
    // only for local query??
    launchEmptyQuery();

    // set assembly id options matching what's in gohan
    form.setFieldsValue(formInitialValues);
  }, [isFetchingConfig, isAuthenticated]);

  // following GA4GH recommendations, UI is one-based, but API is zero-based, "half-open"
  // so to convert to zero-based, we only modify the start value
  // see eg https://genome-blog.soe.ucsc.edu/blog/2016/12/12/the-ucsc-genome-browser-coordinate-counting-systems/
  const convertToZeroBased = (start: string) => Number(start) - 1;

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
    console.log('dispatching beacon query');

    dispatch(launchQuery(jsonPayload));
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

  const requestPayload = (query: PayloadVariantsQuery, payloadFilters: PayloadFilter[]): BeaconQueryPayload => ({
    meta: { apiVersion: '2.0.0' },
    query: { requestParameters: { g_variant: query }, filters: payloadFilters },
    bento: { showSummaryStatistics: true },
  });

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

  const searchButtonText = isNetworkQuery ? 'Search Network' : 'Search Beacon';

  const NetworkFilterToggle = () => {
    return (
      <Tooltip title="Choose all search filters across the network, or only those common to all beacons.">
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <p style={{ margin: '5px' }}>{unionNetworkFilters ? 'all filters' : 'common filters only'}</p>
          <Switch
            checkedChildren="∪"
            unCheckedChildren="∩"
            onChange={handleNetworkFilterToggle}
            checked={unionNetworkFilters}
            style={{ margin: '10px' }}
          />
        </div>
      </Tooltip>
    );
  };

  return (
    <Card
      title={td('Search')}
      style={{ borderRadius: '10px', maxWidth: '1200px', width: '100%', ...BOX_SHADOW }}
      styles={CARD_STYLES}
      loading={isFetchingConfig}
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
                extra={
                  <SearchToolTip>
                    <VariantsInstructions />
                  </SearchToolTip>
                }
              >
                <VariantsForm beaconAssemblyIds={beaconAssemblyIds} />
              </Card>
            </Col>
          )}
          <Col xs={24} lg={hasVariants ? 12 : 24}>
            <Card
              title={
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <>{td('Metadata')}</>
                </div>
              }
              style={CARD_STYLE}
              styles={CARD_STYLES}
              extra={
                <div style={{ display: 'flex', justifyContent: 'space-around' }}>
                  {isNetworkQuery ? <NetworkFilterToggle /> : null}
                  <SearchToolTip>
                    <MetadataInstructions />
                  </SearchToolTip>
                </div>
              }
            >
              <Filters
                filters={filters}
                setFilters={setFilters}
                form={form}
                querySections={querySections}
                isNetworkQuery={isNetworkQuery}
              />
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
              <Button type="primary" htmlType="submit" loading={isFetchingQueryResponse} style={BUTTON_STYLE}>
                {td(searchButtonText)}
              </Button>
              <Button onClick={handleClearForm} style={BUTTON_STYLE}>
                {td('Clear Form')}
              </Button>
            </div>
          </Col>
        </Row>
      </Form>
    </Card>
  );
};

export interface BeaconQueryFormUiProps {
  isFetchingConfig: boolean;
  isFetchingQueryResponse: boolean;
  isNetworkQuery: boolean;
  beaconAssemblyIds: BeaconAssemblyIds;
  querySections: Section[];
  launchQuery: BeaconQueryThunk;
}

export default BeaconQueryFormUi;