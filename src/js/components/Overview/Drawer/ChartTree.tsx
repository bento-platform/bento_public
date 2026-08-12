import type { ReactNode } from 'react';
import { useMemo } from 'react';
import type { TreeProps } from 'antd';
import { Flex, InputNumber, Tree } from 'antd';

import { rearrange, setDisplayedCharts, setChartWidth } from '@/features/search/query.store';
import { useAppDispatch, useTranslationFn } from '@/hooks';
import { useResponsiveMobileContext } from '@/hooks/useResponsiveContext';
import type { ChartDataField } from '@/types/data';

interface MappedChartItem {
  title: ReactNode;
  key: string;
}

const ChartTree = ({ charts, section }: ChartTreeProps) => {
  const dispatch = useAppDispatch();

  const t = useTranslationFn();
  const isMobile = useResponsiveMobileContext();

  const allCharts: MappedChartItem[] = useMemo(
    () =>
      charts.map(({ field: { title }, id, width }) => ({
        title: (
          <Flex>
            <span className="flex-1">{t(title)}</span>
            {!isMobile && (
              <span>
                {t('Width')}:{' '}
                <InputNumber
                  size="small"
                  min={1}
                  max={3}
                  value={width}
                  onChange={(newWidth) => {
                    if (newWidth) {
                      dispatch(setChartWidth({ section, chart: id, width: newWidth }));
                    }
                  }}
                  controls={true}
                  style={{ width: 50 }}
                />
              </span>
            )}
          </Flex>
        ),
        key: id,
      })),
    [charts, dispatch, section, t, isMobile]
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
