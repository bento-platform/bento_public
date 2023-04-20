import React from 'react';
import { useDispatch } from 'react-redux';
import { Tree, TreeProps } from 'antd';
import { useTranslation } from 'react-i18next';

import { rearrange, setDisplayedCharts } from '@/features/data/data.store';
import { NON_DEFAULT_TRANSLATION } from '@/constants/configConstants';
import { ChartDataField } from '@/types/data';

const ChartTree = ({ charts, section }: ChartTreeProps) => {
  const dispatch = useDispatch();
  const { t } = useTranslation(NON_DEFAULT_TRANSLATION);

  const allCharts = charts.map(({ title, id }) => ({ title: t(title), key: id }));

  const onChartDrop: TreeProps['onDrop'] = (info) => {
    const originalLocation = parseInt(info.dragNode.pos.substring(2));
    const newLocation = info.dropPosition - 1;

    const data = [...allCharts];
    const element = data.splice(originalLocation, 1)[0];
    data.splice(newLocation, 0, element);
    dispatch(rearrange({ section, arrangement: data.map((e) => e.key) }));
  };

  const checkedKeys = charts.filter((e) => e.isDisplayed).map((e) => e.id);

  const onCheck: TreeProps['onCheck'] = (checkedKeysValue) => {
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

export interface ChartTreeProps {
  charts: ChartDataField[];
  section: string;
}

export default ChartTree;