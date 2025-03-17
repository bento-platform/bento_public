import { useCallback, useEffect, useMemo, useState } from 'react';
import { Button, Card, Col, Form, Row } from 'antd';
import { useIsAuthenticated } from 'bento-auth-js';
import { useAppDispatch, useQueryWithAuthIfAllowed, useTranslationFn } from '@/hooks';
import { useSelectedScope } from '@/features/metadata/hooks';
import VariantsForm from './VariantsForm';
import Filters from './Filters';
import SearchToolTip from './ToolTips/SearchToolTip';
import VariantsInstructions from './ToolTips/VariantsInstructions';
import { MetadataInstructions } from './ToolTips/MetadataInstructions';
import BeaconErrorMessage from './BeaconErrorMessage';
import type {
  BeaconAssemblyIds,
  BeaconQueryPayload,
  BeaconQueryAction,
  BeaconFilterSection,
  FormFilter,
  FormValues,
  BeaconPayloadFilter,
  PayloadVariantsQuery,
} from '@/types/beacon';
import { BOX_SHADOW } from '@/constants/overviewConstants';
import {
  FORM_ROW_GUTTERS,
  CARD_STYLE,
  BUTTON_AREA_STYLE,
  BUTTON_STYLE,
  CARD_STYLES,
} from '@/constants/beaconConstants';
import { T_PLURAL_COUNT } from '@/constants/i18n';

const STARTER_FILTER = { index: 1, active: true };

// TODOs
// example searches, either hardcoded or configurable
// more intuitive variants ui

const BeaconQueryFormUi = ({
  isFetchingQueryResponse, //used in local beacon only
  isNetworkQuery,
  beaconAssemblyIds,
  launchQuery,
  apiErrorMessage,
  beaconFiltersBySection,
}: BeaconQueryFormUiProps) => {
  const t = useTranslationFn();
  const [form] = Form.useForm();
  const [filters, setFilters] = useState<FormFilter[]>([STARTER_FILTER]);
  const [hasVariants, setHasVariants] = useState<boolean>(false);
  const [hasFormError, setHasFormError] = useState<boolean>(false);
  const [formErrorMessage, setFormErrorMessage] = useState<string>('');

  // remember if user closed alert, so we can force re-render of a new one later
  const [errorAlertClosed, setErrorAlertClosed] = useState<boolean>(false);

  const dispatch = useAppDispatch();
  const isAuthenticated = useIsAuthenticated();

  const { scope, scopeSet } = useSelectedScope();

  const formInitialValues = useMemo(
    () => ({
      'Assembly ID': beaconAssemblyIds.length === 1 && beaconAssemblyIds[0],
    }),
    [beaconAssemblyIds]
  );
  const uiInstructions = hasVariants ? 'Search by genomic variants, clinical metadata or both.' : '';

  const hasError = hasFormError || !!apiErrorMessage;
  const showError = hasError && !errorAlertClosed;

  const requestPayload = useCallback(
    (query: PayloadVariantsQuery, payloadFilters: BeaconPayloadFilter[]): BeaconQueryPayload => {
      const payload: BeaconQueryPayload = {
        meta: { apiVersion: '2.0.0' },
        query: { requestParameters: { g_variant: query }, filters: payloadFilters },
        bento: { showSummaryStatistics: true },
      };
      if (scope.dataset && !isNetworkQuery) {
        payload['query']['datasets'] = { datasetIds: [scope.dataset] };
      }
      return payload;
    },
    [scope, isNetworkQuery]
  );

  const launchEmptyQuery = useCallback(
    () => dispatch(launchQuery(requestPayload({}, []))),
    [dispatch, launchQuery, requestPayload]
  );

  // should not be possible to have both errors simultaneously
  // and api error is more important
  const errorMessage = apiErrorMessage || formErrorMessage;

  const clearFormError = () => {
    setHasFormError(false);
    setFormErrorMessage('');
  };

  useEffect(() => {
    if (!scopeSet) {
      return;
    }
    launchEmptyQuery();
    setHasVariants(beaconAssemblyIds.length > 0 || isNetworkQuery);

    // set assembly id options matching what's in gohan (for local beacon) or in network
    form.setFieldsValue(formInitialValues);
  }, [scopeSet, beaconAssemblyIds.length, form, formInitialValues, isAuthenticated, isNetworkQuery, launchEmptyQuery]);

  // Disables max query param if user is authenticated and authorized
  useQueryWithAuthIfAllowed();

  // following GA4GH recommendations, UI is one-based, but API is zero-based, "half-open"
  // so to convert to zero-based, we only modify the start value
  // see e.g., https://genome-blog.soe.ucsc.edu/blog/2016/12/12/the-ucsc-genome-browser-coordinate-counting-systems/
  const convertToZeroBased = (start: string) => Number(start) - 1;

  const packageFilters = useCallback(
    (values: FormValues): BeaconPayloadFilter[] => {
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
    },
    [filters]
  );

  const packageBeaconJSON = useCallback(
    (values: FormValues) => {
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
    },
    [packageFilters, requestPayload]
  );

  const handleFinish = useCallback(
    (formValues: FormValues) => {
      // if bad form, block submit and show user error
      if (!variantsFormValid(formValues)) {
        setHasFormError(true);
        setErrorAlertClosed(false);
        setFormErrorMessage(t('beacon.variants_form_error'));
        return;
      }

      clearFormError();
      setErrorAlertClosed(false);
      const jsonPayload = packageBeaconJSON(formValues);

      dispatch(launchQuery(jsonPayload));
    },
    [dispatch, t, launchQuery, packageBeaconJSON]
  );

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

  const searchButtonText = t(`beacon.${isNetworkQuery ? 'search_network' : 'search_beacon'}`);

  return (
    <div className="container margin-auto" style={{ paddingBottom: 8 }}>
      <Card title={t('Search')} style={{ borderRadius: '10px', width: '100%', ...BOX_SHADOW }} styles={CARD_STYLES}>
        <p style={{ margin: '-8px 0 8px 0', padding: '0', color: 'grey' }}>{t(uiInstructions)}</p>
        <Form form={form} onFinish={handleFinish} layout="vertical" onValuesChange={handleValuesChange}>
          <Row gutter={FORM_ROW_GUTTERS}>
            {hasVariants && (
              <Col xs={24} lg={12}>
                <Card
                  title={t('entities.variant', T_PLURAL_COUNT)}
                  style={CARD_STYLE}
                  styles={CARD_STYLES}
                  extra={
                    <SearchToolTip>
                      <VariantsInstructions />
                    </SearchToolTip>
                  }
                >
                  <VariantsForm isNetworkQuery={isNetworkQuery} beaconAssemblyIds={beaconAssemblyIds} />
                </Card>
              </Col>
            )}
            <Col xs={24} lg={hasVariants ? 12 : 24}>
              <Card
                title={
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <>{t('Metadata')}</>
                  </div>
                }
                style={CARD_STYLE}
                styles={CARD_STYLES}
                extra={
                  <SearchToolTip>
                    <MetadataInstructions />
                  </SearchToolTip>
                }
              >
                <Filters
                  filters={filters}
                  setFilters={setFilters}
                  form={form}
                  beaconFiltersBySection={beaconFiltersBySection}
                  isNetworkQuery={isNetworkQuery}
                />
              </Card>
            </Col>
          </Row>
          <Row>
            <Col span={24}>
              {showError && (
                <BeaconErrorMessage
                  message={`${t('beacon.beacon_error')}: ${errorMessage}`}
                  onClose={() => setErrorAlertClosed(true)}
                />
              )}
              <div style={BUTTON_AREA_STYLE}>
                <Button type="primary" htmlType="submit" loading={isFetchingQueryResponse} style={BUTTON_STYLE}>
                  {searchButtonText}
                </Button>
                <Button onClick={handleClearForm} style={BUTTON_STYLE}>
                  {t('Clear Form')}
                </Button>
              </div>
            </Col>
          </Row>
        </Form>
      </Card>
    </div>
  );
};

export interface BeaconQueryFormUiProps {
  isFetchingQueryResponse: boolean;
  isNetworkQuery: boolean;
  beaconAssemblyIds: BeaconAssemblyIds;
  launchQuery: BeaconQueryAction;
  apiErrorMessage?: string;
  beaconFiltersBySection: BeaconFilterSection[];
}

export default BeaconQueryFormUi;
