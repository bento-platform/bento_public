import React, { ReactNode, useMemo } from 'react';
import { useDispatch } from 'react-redux';
import { InputNumber, Tree, TreeProps } from 'antd';
import { useTranslation } from 'react-i18next';

import { rearrange, setDisplayedCharts, setChartWidth } from '@/features/data/data.store';
import { NON_DEFAULT_TRANSLATION } from '@/constants/configConstants';
import { ChartDataField } from '@/types/data';

interface MappedChartItem {
  title: ReactNode;
  key: string;
}

const ChartTree = ({ charts, section }: ChartTreeProps) => {
  const dispatch = useDispatch();
  const { t } = useTranslation(NON_DEFAULT_TRANSLATION);

  const allCharts: MappedChartItem[] = useMemo(
    () => charts.map(({ field: { title }, id, width }) => ({
      title: <div style={{display: "flex"}}>
        <span style={{flex: 1}}>{t(title)}</span>
        <span>
          Width:{" "}
          <InputNumber
            size="small"
            min={1}
            max={3}
            value={width}
            onChange={(v) => {
              if (v) {
                dispatch(setChartWidth({ section, chart: id, width: v }));
              }
            }}
            controls={true}
            style={{ width: 50 }}
          />
        </span>
      </div>,
      key: id,
    })),
    [charts]
  );

  const onChartDrop: TreeProps['onDrop'] = useMemo(() => {
    const fn: TreeProps['onDrop'] = (event) => {
      const originalLocation = parseInt(event.dragNode.pos.substring(2));
      const newLocation = event.dropPosition - 1;

      const data = [...(allCharts ?? [])];
      const element = data.splice(originalLocation, 1)[0];
      data.splice(newLocation, 0, element);
      dispatch(rearrange({ section, arrangement: data.map((e) => e.key) }));
    };
    return fn;
  }, [dispatch, allCharts, section]);

  const checkedKeys = useMemo(() => charts.filter((e) => e.isDisplayed).map((e) => e.id), [charts]);

  const onCheck = useMemo(() => {
    const fn: TreeProps['onCheck'] = (checkedKeysValue) => {
      dispatch(setDisplayedCharts({ section, charts: checkedKeysValue as string[] }));
    };
    return fn;
  }, [dispatch, section]);

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
