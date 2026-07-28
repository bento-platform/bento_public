import { scopeEqual } from '@/utils/router';
import type { DiscoveryScopeSelection } from '@/features/metadata/metadata.store';

export const scopeSelectionEqual = (s1: DiscoveryScopeSelection, s2: DiscoveryScopeSelection) =>
  scopeEqual(s1.scope, s2.scope) &&
  s1.scopeSet == s2.scopeSet &&
  s1.fixedProject == s2.fixedProject &&
  s1.fixedDataset == s2.fixedDataset;
