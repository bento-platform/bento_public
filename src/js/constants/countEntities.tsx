import type { ReactNode } from 'react';
import { ExperimentOutlined, FileOutlined, TeamOutlined } from '@ant-design/icons';
import { BiDna } from 'react-icons/bi';

import type { BentoCountEntity } from '@/types/entities';

export const COUNT_ENTITY_REGISTRY: Record<BentoCountEntity, { icon: ReactNode }> = {
  individual: { icon: <TeamOutlined /> },
  biosample: { icon: <BiDna /> },
  experiment: { icon: <ExperimentOutlined /> },
  experiment_result: { icon: <FileOutlined /> },
};

export const COUNT_ENTITY_ORDER: BentoCountEntity[] = ['individual', 'biosample', 'experiment', 'experiment_result'];
