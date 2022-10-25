import React, { useState } from 'react';
import { Button, Form, Icon, Input, Select, Dropdown, Menu, Space } from 'antd';
import { TreeSelect } from 'antd';
// import SchemaTreeSelect from "../schema_trees/SchemaTreeSelect";
import { useSelector } from 'react-redux';
// import PhenopacketSearchOptions from './PhenopacketSearchOptions'
import { phenopacketSearchTree } from './PhenopacketSearchOptions';
import { DownOutlined } from '@ant-design/icons';

const BEACON_EQUALS = '=';
const BEACON_NOT = '!';
const BEACON_LT = '<';
const BEACON_LTE = '<=';
const BEACON_GT = '>';
const BEACON_GTE = '>=';
const BEACON_INCLUDES = 'includes'; //not in beacon spec

const OPERATOR_TEXT = {
  [BEACON_EQUALS]: '=',
  [BEACON_NOT]: '\u2260',
  [BEACON_LT]: '<',
  [BEACON_LTE]: '\u2264',
  [BEACON_GTE]: '>',
  [BEACON_INCLUDES]: 'includes',
};

const KATSU_OPERATOR_MAPPING = {
  ['eq']: BEACON_EQUALS,
  ['ico']: BEACON_INCLUDES,
};

const filterFields = [
  { name: 'id', rules: [{ required: true, message: 'id required' }] },
  { name: 'operator', rules: [{ required: true }] },
  { name: 'value', rules: [{ required: true, message: 'value required' }] },
];

const textFieldOperators = [BEACON_EQUALS, BEACON_INCLUDES, BEACON_NOT];
const allOperators = [BEACON_EQUALS, BEACON_NOT, BEACON_LT, BEACON_LTE, BEACON_GT, BEACON_GTE];

const fakeValues = ['one', 'two', 'three'];

// const operationOptions = this.state.fieldSchema.search.operations.map(o =>
//     <Select.Option key={o}>{OPERATION_TEXT[o]}</Select.Option>);

//     <Select
//         style={{ width: `${OPERATION_WIDTH}px`, float: "left" }}
//         value={this.state.operation}
//         onChange={this.handleOperation}
//     >
//         {operationOptions}
//     </Select>;

// values: (filterid).value.schema.enum
// operators: ....value.schema.search.operations

const FilterFormItem = ({ form, filter }) => {
  const phenopacketSchema = useSelector((state) => state?.serviceDataTypes?.itemsByID?.phenopacket?.schema);
  const [operators, setOperators] = useState(allOperators);
  const [values, setValues] = useState(fakeValues);

  // const updateOperators = (katsuOps) => {
  //     katsuOps = katsuOps.filter(op => {op != "in"})
  //     beaconOps = katsuOps.map(kop => KATSU_OPERATOR_MAPPING[kop] )
  //     setOperators()
  // }

  const updateFields = (v, fieldKey, fieldSchemaKey) => {
    console.log('changed fields ');
    console.log({ v: v, fieldKey: fieldKey, fieldSchemaKey: fieldSchemaKey });

    // if (v?.schema?.search?.operations) {
    //     updateOperators(v.schema.search.operations)
    // }

    // const operatorOptions=v?.schema?.search?.operations || allOperators
    // setOperators(operatorOptions)
  };

  // const schemaTreeSelect = (fieldKey, fieldSchemaKey, schema, style, value) => {

  //     return (<SchemaTreeSelect
  //         style={{float: "left", ...style}}
  //         disabled={false}
  //         schema={schema}
  //         // isExcluded={false}
  //         // value={{selected: this.state[fieldKey], schema: this.state[fieldSchemaKey]}}
  //         onChange={v => updateFields(v, fieldKey, fieldSchemaKey)} />);
  // };

  const operationOptions = operators.map((o) => <Select.Option key={o}>{OPERATOR_TEXT[o]}</Select.Option>);

  // 
  const valueOptions = values.map((v) => <Select.Option key={v}>{v}</Select.Option>);




  return (
    <Input.Group compact>
      <Form.Item name={`filterId${filter.index}`} rules={[{ required: true, message: 'search field required' }]}>
        <TreeSelect
          style={{ width: '100%', minWidth: '260px' }}
          // value={value}
          dropdownStyle={{ overflow: 'auto' }}
          treeData={phenopacketSearchTree}
          placeholder="Select field"
          // onChange={onChange}
        />
      </Form.Item>
      <Form.Item name={`filterOperator${filter.index}`} initialValue={BEACON_EQUALS} rules={[{ required: true, message: 'operator required' }]}>
        <Select style={{ width: '100px' }}>{operationOptions}</Select>
      </Form.Item>
      <Form.Item name={`filterValue${filter.index}`} rules={[{ required: true, message: 'value required' }]} style={{width: "150px"}}>
        <Input />
      </Form.Item>
    </Input.Group>
  );
};

export default FilterFormItem;
