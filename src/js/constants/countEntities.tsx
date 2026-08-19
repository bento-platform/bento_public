import type { ReactNode } from 'react';
import { DatabaseOutlined, ExperimentOutlined, FileOutlined, TeamOutlined } from '@ant-design/icons';
import { BiDna } from 'react-icons/bi';

import type { BentoCountEntity, BentoUICountEntity } from '@/types/entities';

export const COUNT_ENTITY_REGISTRY: Record<BentoUICountEntity, { icon: ReactNode }> = {
  dataset: { icon: <DatabaseOutlined /> },
  individual: { icon: <TeamOutlined /> },
  biosample: { icon: <BiDna /> },
  experiment: { icon: <ExperimentOutlined /> },
  experiment_result: { icon: <FileOutlined /> },
};

export const COUNT_ENTITY_ORDER: BentoCountEntity[] = ['individual', 'biosample', 'experiment', 'experiment_result'];
