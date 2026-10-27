import type { ReactNode } from 'react';
import { DatabaseOutlined, ExperimentOutlined, FileOutlined, TeamOutlined } from '@ant-design/icons';
import { BiDna } from 'react-icons/bi';

import type { BentoCountEntity, BentoUICountEntity } from '@/types/entities';

export const COUNT_ENTITY_REGISTRY: Record<BentoUICountEntity, { icon: ReactNode }> = {
  dataset: { icon: <DatabaseOutlined aria-hidden /> },
  individual: { icon: <TeamOutlined aria-hidden /> },
  biosample: { icon: <BiDna aria-hidden /> },
  experiment: { icon: <ExperimentOutlined aria-hidden /> },
  experiment_result: { icon: <FileOutlined aria-hidden /> },
};

export const COUNT_ENTITY_ORDER: BentoCountEntity[] = ['individual', 'biosample', 'experiment', 'experiment_result'];
