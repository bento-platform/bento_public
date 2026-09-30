import { startTransition, useCallback, useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button, Form, Input, Select, Space, Tooltip } from 'antd';
import { CloseOutlined, FormOutlined, InfoCircleOutlined, LoadingOutlined, SearchOutlined } from '@ant-design/icons';

import {
  TABLE_PAGE_QUERY_PARAM,
  TEXT_QUERY_PARAM,
  TEXT_QUERY_TYPE_PARAM,
  VALID_TEXT_QUERY_TYPES,
} from '@/features/search/constants';
import { useIsSearchLoading, useSearchQuery, useSearchQueryParams } from '@/features/search/hooks';
import { buildQueryParamsUrl, queryParamsWithoutKey } from '@/features/search/utils';
import { useTranslationFn } from '@/hooks';
import { useDebounce } from '@/hooks/debounce';

import type { FtsQueryType, QueryParamEntries } from '@/features/search/types';

import SearchSubForm, { type DefinedSearchSubFormProps } from '@/components/Search/SearchSubForm';

type FreeTextFormValues = { q: string; qt: FtsQueryType };

const DEBOUNCE_WAIT_MS = 500;

const SearchFreeText = (props: DefinedSearchSubFormProps) => {
  const t = useTranslationFn();
  const location = useLocation();
  const navigate = useNavigate();

  const { textQuery, textQueryType } = useSearchQuery();
  const allQueryParams = useSearchQueryParams();
  const searchLoading = useIsSearchLoading();

  // Only show the loading spinner in the search input if the in-flight search was triggered by a text search, rather
  // than (for example) a filter change.
  const [textSearchPending, setTextSearchPending] = useState(false);
  const textSearchStarted = useRef(false);

  useEffect(() => {
    if (!textSearchPending) return;
    if (searchLoading) {
      textSearchStarted.current = true;
    } else if (textSearchStarted.current) {
      // The search triggered by the text query has finished.
      textSearchStarted.current = false;
      setTextSearchPending(false);
    }
  }, [textSearchPending, searchLoading]);

  const textSearchLoading = textSearchPending && searchLoading;

  const [form] = Form.useForm<FreeTextFormValues>();

  // The last text query submitted from this form, so we can tell our own URL updates apart from external ones.
  const submittedTextQuery = useRef<string | undefined>(undefined);

  useEffect(() => {
    // If the textQuery state changes (from a URL parameter, presumably), then update the form value to sync them.
    // This includes clearing it (e.g. via "clear all").
    if (textQuery === submittedTextQuery.current) {
      // This change came from the form itself; don't sync back, or we'd clobber anything typed since submitting.
      submittedTextQuery.current = undefined;
      return;
    }
    if ((form.getFieldValue('q') ?? '').trim() !== textQuery) {
      form.setFieldValue('q', textQuery);
    }
  }, [form, textQuery]);

  useEffect(() => {
    // If the textQueryType state changes (from a URL parameter, presumably), then update the form value to sync them.
    if (textQueryType) {
      form.setFieldValue('qt', textQueryType);
    }
  }, [form, textQueryType]);

  const navigateToTextQuery = useCallback(
    (query: string, queryType?: FtsQueryType) => {
      if (query === textQuery && queryType === textQueryType) return;
      setTextSearchPending(true);
      submittedTextQuery.current = query;
      const url =
        // Build a query URL with the new text search value and navigate to it. It'll be handled by the search
        // router/handler effect (useSearchRouterAndHandler) elsewhere.
        buildQueryParamsUrl(location.pathname, [
          ...queryParamsWithoutKey(allQueryParams, [TEXT_QUERY_PARAM, TEXT_QUERY_TYPE_PARAM, TABLE_PAGE_QUERY_PARAM]),
          [TEXT_QUERY_PARAM, query],
          [TEXT_QUERY_TYPE_PARAM, queryType ?? textQueryType], // Preserve text query type if not changed
          // We need to reset the entity table page to 0 if the search text/type changes, and we already have one set:
          ...(allQueryParams.find(([k, _]) => k === TABLE_PAGE_QUERY_PARAM)
            ? ([[TABLE_PAGE_QUERY_PARAM, '0']] as QueryParamEntries)
            : []),
        ]);
      // Mark the navigation as a transition, so the resulting page re-render doesn't block typing in the input.
      startTransition(() => navigate(url));
    },
    [location.pathname, allQueryParams, textQuery, textQueryType, navigate]
  );

  const onReset = useCallback(() => {
    form.setFieldValue('q', '');
    navigateToTextQuery('');
  }, [form, navigateToTextQuery]);

  const onFinish = useCallback(
    (values: FreeTextFormValues) => {
      const query = values.q.trim();
      navigateToTextQuery(query, values.qt);
    },
    [navigateToTextQuery]
  );

  // Read the latest form values when the debounce fires, so a reset in the meantime isn't overwritten by a stale value.
  const submitLatestValues = useCallback(() => onFinish(form.getFieldsValue()), [onFinish, form]);
  const debouncedSubmit = useDebounce(submitLatestValues, DEBOUNCE_WAIT_MS);

  const ftsQueryTypeOptions = VALID_TEXT_QUERY_TYPES.map((value) => ({
    value,
    label: (
      <span>
        {t(`search.fts.${value}`)}
        <Tooltip title={t(`search.fts.${value}_help`)}>
          <InfoCircleOutlined style={{ marginLeft: '0.7em' }} aria-hidden />
        </Tooltip>
      </span>
    ),
  }));

  const qtValue = Form.useWatch('qt', form);

  return (
    <SearchSubForm
      titleKey="text_search"
      icon={<FormOutlined aria-hidden />}
      extra={
        <Select<FtsQueryType>
          classNames={{
            popup: {
              listItem: 'focus-ring',
            },
          }}
          aria-label={t('search_type')}
          disabled={textSearchLoading}
          variant="filled"
          size="small"
          className="flex-1 focus-ring"
          value={qtValue}
          onChange={(value) => {
            form.setFieldValue('qt', value);
            debouncedSubmit();
          }}
          options={ftsQueryTypeOptions}
        />
      }
      {...props}
    >
      <Form form={form} onFinish={onFinish}>
        <Space.Compact className="w-full">
          <Form.Item name="q" initialValue={textQuery} noStyle={true} label={t('search.text_search')}>
            <Input
              className="focus-ring"
              prefix={<SearchOutlined />}
              suffix={textSearchLoading ? <LoadingOutlined /> : <span />}
              onChange={debouncedSubmit}
            />
          </Form.Item>
          {!!textQuery && <Button icon={<CloseOutlined />} onClick={onReset} disabled={textSearchLoading} />}
        </Space.Compact>
        <Form.Item name="qt" initialValue={textQueryType} noStyle={true} hidden />
      </Form>
    </SearchSubForm>
  );
};

export default SearchFreeText;
