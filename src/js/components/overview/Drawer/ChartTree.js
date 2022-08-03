import React from 'react';
import { Tree } from 'antd';

import { useDispatch } from 'react-redux';
import { rearrange, setDisplayedCharts } from '../../../features/data/data';

const ChartTree = ({ charts, section }) => {
  const dispatch = useDispatch();

  const allCharts = charts.map(({ title, id }) => ({ title, key: id }));

  const onChartDrop = (info) => {
    const originalLocation = parseInt(info.dragNode.pos.substring(2));
    const newLocation = info.dropPosition - 1;

    const data = [...allCharts];
    const element = data.splice(originalLocation, 1)[0];
    data.splice(newLocation, 0, element);
    dispatch(rearrange({ section, arrangement: data.map((e) => e.key) }));
  };

  const checkedKeys = charts.filter((e) => e.isDisplayed).map((e) => e.id);

  const onCheck = (checkedKeysValue) => {
    dispatch(setDisplayedCharts({ section, charts: checkedKeysValue }));
  };

  return (
    <Tree
      className="draggable-tree"
      draggable
      blockNode
      checkable
      onDrop={onChartDrop}
      treeData={allCharts}
      onCheck={onCheck}
      checkedKeys={checkedKeys}
    />
  );
};

export default ChartTree;
