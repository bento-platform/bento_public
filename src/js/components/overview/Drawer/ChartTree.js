import React from 'react';
import { Tree } from 'antd';

import { useSelector, useDispatch } from 'react-redux';
import { rearrange, setDisplayedCharts } from '../../../features/data';

const changePostiion = (arr, fromIndex, toIndex) => {
  const element = arr.splice(fromIndex, 1)[0];
  arr.splice(toIndex, 0, element);
};

const ChartTree = () => {
  const dispatch = useDispatch();

  const allCharts = useSelector((state) =>
    state.data.chartData.map((e) => ({
      title: e.properties?.title || e.name,
      key: e.name,
    }))
  );

  const onChartDrop = (info) => {
    const originalLocation = parseInt(info.dragNode.pos.substring(2));
    const newLocation = info.dropPosition - 1;

    const data = [...allCharts];
    const element = data.splice(originalLocation, 1)[0];
    data.splice(newLocation, 0, element);
    dispatch(rearrange(data.map((e) => e.key)));
  };

  const checkedKeys = useSelector((state) =>
    state.data.chartData.filter((e) => e.isDisplayed).map((e) => e.name)
  );

  const onCheck = (checkedKeysValue) => {
    dispatch(setDisplayedCharts(checkedKeysValue));
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
