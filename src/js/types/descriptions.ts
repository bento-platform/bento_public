import { type DescriptionsItemType } from 'antd/es/descriptions';

export interface ConditionalDescriptionItem extends DescriptionsItemType {
  isVisible?: unknown;
}
