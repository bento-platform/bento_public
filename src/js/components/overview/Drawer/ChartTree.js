import React from 'react';
import { Tree } from 'antd';

import { useSelector, useDispatch } from 'react-redux';
import { rearrange, setDisplayedCharts } from '../../../features/data';

const ChartTree = () => {
  const dispatch = useDispatch();

  const allCharts = useSelector((state) =>
    state.data.chartData.map((e) => ({
      title: e.properties?.title || e.name,
      key: e.name,
    }))
  );

  const onChartDrop = (info) => {
    const dropKey = info.node.key;
    const dragKey = info.dragNode.key;
    const dropPos = info.node.pos.split('-');
    const dropPosition =
      info.dropPosition - Number(dropPos[dropPos.length - 1]);

    const loop = (data, key, callback) => {
      for (let i = 0; i < data.length; i++) {
        if (data[i].key === key) {
          return callback(data[i], i, data);
        }
      }
    };
    const data = [...allCharts];

    // Find dragObject
    let dragObj;

    loop(data, dragKey, (item, index, arr) => {
      arr.splice(index, 1);
      dragObj = item;
    });

    let ar, i;
    loop(data, dropKey, (_item, index, arr) => {
      ar = arr;
      i = index;
    });

    if (dropPosition === -1) {
      ar.splice(i, 0, dragObj);
    } else {
      ar.splice(i + 1, 0, dragObj);
    }

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
