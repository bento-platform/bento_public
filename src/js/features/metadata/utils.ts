import { scopeEqual } from '@/utils/router';
import type { DiscoveryScopeSelection } from '@/features/metadata/metadata.store';

export const scopeSelectionEqual = (s1: DiscoveryScopeSelection, s2: DiscoveryScopeSelection) =>
  scopeEqual(s1.scope, s2.scope) &&
  s1.scopeSet == s2.scopeSet &&
  s1.isSoleProject == s2.isSoleProject &&
  s1.isSoleDataset == s2.isSoleDataset;
