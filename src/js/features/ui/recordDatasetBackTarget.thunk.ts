import type { AppDispatch, RootState } from '@/store';
import type { BackOrigin } from '@/types/navigation';
import { searchQueryParamsFromState } from '@/features/search/utils';
import { setDatasetBackTarget } from './ui.store';

/**
 * Call just before navigating into a dataset from one of its cards, while the origin page's state is still in Redux.
 * Records where the dataset scope's back button should return to (see DatasetBackTarget).
 */
export const recordDatasetBackTarget =
  (origin: BackOrigin, project: string, dataset: string) => (dispatch: AppDispatch, getState: () => RootState) => {
    dispatch(
      setDatasetBackTarget(
        origin === 'project'
          ? { dataset, origin, project, exploreQueryParams: searchQueryParamsFromState(getState().query) }
          : { dataset, origin }
      )
    );
  };
