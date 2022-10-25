import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Input, Form, Button, Select } from 'antd';
import FilterFormItem from './FilterFormItem';
import { makeBeaconQuery } from '../../features/beacon/beaconQuery';
import BeaconQueryResults from './BeaconQueryResults';
import BottomPanels from './BottomPanels';
import beacon_logo from '../../../assets/beacon_logo_t.png'
import bqc19_logo from '../../../assets/bqc19_logo_blue.png'


// TODO
// "clear form"
// entity search type if not too much trouble (only need to change endpoint and result icon, 
// needs dynamic endpoint and to modify result icon

// switch to one-based

// actually store filters in "filters" instead of just indexes 
// they can be objects of id, op, value instead of objects of "index"
// ... this is more than we need though, with extra bookkeeping
// but it may fix the "form reset" issue 


const BeaconQueryUi = () => {
  const { response, isFetching } = useSelector((state) => state.beacon);
  const countResponse = response?.responseSummary?.count ?? '---'
  const [filters, setFilters] = useState([]);
  const [exampleFilters, setExampleFilters] = useState([])
  const [form] = Form.useForm();

  const dispatch = useDispatch();
  // dynamically add example filters if present
  useEffect(() => {
    if (!filters) {return}
    filters.forEach((f) => {
      form.setFieldsValue({
        [`filterId${f.index}`]: exampleFilters[(f.index-1)].id,
        [`filterOperator${f.index}`]: exampleFilters[(f.index-1)].operator,
        [`filterValue${f.index}`]: exampleFilters[(f.index-1)].value,
      });
    });

  }, [exampleFilters])


  // conditionally put another logo if there's a logo link in service-info? (or perhaps there's one already)

  // TODO: pulldown to select entity for query (individuals, variants, experiments, biosamples...
  // ... and change the results logo accordingly... for now do individuals

  const formFields = [
    {
      key: 'referenceName',
      name: 'Chromosome',
      rules: [{}],
      placeholder: '1-22, X, Y, MT',
      initialValue: '',
    },
    { key: 'start', name: 'Variant start', rules: [{}], placeholder: 'eg 100', initialValue: '' },
    { key: 'end', name: 'Variant end', rules: [{}], placeholder: 'eg 200', initialValue: '' },
    {
      key: 'referenceBases',
      name: 'Reference base(s)',
      rules: [{}],
      placeholder: 'A, C, G, T or N',
      initialValue: '',
    },
    {
      key: 'alternateBases',
      name: 'Alternate base(s)',
      rules: [{}],
      placeholder: 'A, C, G, T, N or empty',
      initialValue: '',
    },
    {
      key: 'assemblyId',
      name: 'Assembly Id',
      rules: [{}],
      placeholder: '',
      help: '(only GRCh38 available)',
      initialValue: 'GRCh38',
    },
  ];

  const packageFilters = (values) => {
    return filters.map((f) => ({
      id: values[`filterId${f.index}`],
      operator: values[`filterOperator${f.index}`],
      value: values[`filterValue${f.index}`],
    }));
  };

  const newFilter = (n) => ({ index: `${n}` });

  const packageBeaconJSON = (values) => {
    let query = {};


    const payloadFilters = packageFilters(values);

    const hasVariantsQuery = values["Chromosome"] || values["Variant start"] || values["Reference base(s)"];
    if (hasVariantsQuery) {
      query = {
        referenceName: values["Chromosome"],
        start: [values["Variant start"]],
        assemblyId: values["Assembly Id"],
      };
      if (values["Variant end"]) {
        query.end = [values["Variant end"]];
      }
      if (values["Reference base(s)"]) {
        query.referenceBases = values["Reference base(s)"];
      }
      if (values["Alternate base(s)"]) {
        query.alternateBases = values["Alternate base(s)"];
      }
    }

    const payload = {
      meta: {},
      query: { requestParameters: { g_variant: query }, filters: payloadFilters, includeResultsetResponses: 'ALL' },
    };

    return payload;
  };

  const handleFinish = (formValues) => {
    console.log('Received values of form: ');
    console.log({ formValues: formValues });
    const jsonPayload = packageBeaconJSON(formValues);

    console.log({queryPayload: jsonPayload})


    dispatch(makeBeaconQuery(jsonPayload));
  };

  const handle_add_filter = () => {
    const filterIndex = filters.length + 1;
    const f = newFilter(filterIndex);
    setFilters((filters) => [...filters, f]);
  };

  const handle_remove_filters = () => {
    filters.forEach((f) => {
      form.setFieldsValue({
        [`filterId${f.index}`]: '',
        [`filterOperator${f.index}`]: '=',
        [`filterValue${f.index}`]: '',
      });
    });

    setFilters([]);
  };

  const handleClearForm = () => {
    handle_remove_filters()
    form.resetFields()
  }

  const setQueryValues = (buttonValues) => {
    console.log({ buttonValues: buttonValues });

    if (buttonValues.referenceName) {
      form.setFieldsValue({
        "Chromosome": buttonValues.referenceName,
        'Variant start': buttonValues.start,
        'Variant end': buttonValues.end || '',
        'Reference base(s)': buttonValues.referenceBases || '',
        'Alternate base(s)': buttonValues.alternateBases || '',
      });
    }

    const buttonFilters = buttonValues?.filters ?? []
    setFilters(buttonFilters.map((f, i) => ({"index": i+1})))
    setExampleFilters(buttonFilters)
  };

  const resultsStyle = {
    marginTop: '-40px',
    minHeight: '150px',
    maxHeight: '150px',
  };

  const wrapperStyle = {
    display: 'flex',
    flexDirection: "column"
  }

  const topWrapperStyle = {
    display: 'flex',
  };

  const formWrapperStyle = {
    width: '650px',
  };

  const filterAreaStyle = {
    marginTop: '25px',
    marginLeft: '50px',
  };

  const imagesStyle = {
    display: 'flex',
    alignItems: 'center',
  };

  const formStyle = { margin: '25px' };

  const buttonStyle = { margin: '10px 0' };

  const buttonAreaStyle = {
    display: "flex"
  }

  const submitButtonStyle = { margin: '10px 0 0 50px' };

  const formItemLayout = {
    labelCol: {
      md: { span: 6 },
      lg: { span: 6 },
    },
    wrapperCol: {
      md: { span: 12 },
      lg: { span: 12 },
    },
  };

  return (
    <div style={wrapperStyle}>
      <div style={topWrapperStyle}>
        <div style={formWrapperStyle}>
          <Form form={form} onFinish={handleFinish} style={{ width: '800px' }}>
            {formFields.map((f) => (
              <Form.Item
                key={f.key}
                name={f.name}
                label={f.name}
                rules={f.rules}
                help={f.help}
                initialValue={f.initialValue}
                {...formItemLayout}
              >
                {f.key != "assemblyId" ? <Input placeholder={f.placeholder} /> : <Select ><Select.Option value="GRCh38" >{"GRCh38"}</Select.Option></Select>}
              </Form.Item>
            ))}
            <Form.Item>
              <div style={filterAreaStyle}>
                <div style={buttonAreaStyle}>
                <Button style={buttonStyle} onClick={handle_add_filter}>
                  Add Filter
                </Button>
                <Button style={buttonStyle} onClick={handle_remove_filters}>
                  Clear Filters
                </Button>
                <Button style={{...buttonStyle, marginLeft: "20px"}} onClick={handleClearForm}>
                  Clear Form
                </Button>
                </div>
                {filters.map((f) => (
                  <FilterFormItem key={f.index} form={form} filter={f} />
                ))}
                
              </div>
              <Button style={submitButtonStyle} type="primary" htmlType="submit">
                Search Beacon
              </Button>
            </Form.Item>
          </Form>
        </div>
        <div style={resultsStyle}>
        <div style={imagesStyle}>
          <img style={{ height: '120px' }} src={bqc19_logo} alt="BQC19 logo" />
          <img style={{ height: '60px' }} src={beacon_logo} alt="Beacon logo" />
        </div>
        <BeaconQueryResults countResponse={countResponse} />
        </div>
      </div>
      <BottomPanels setQueryValues={setQueryValues} beaconResponse={response} />
    </div>
  );
};

export default BeaconQueryUi;
