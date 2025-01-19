import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/hooks';

import { Modal, Skeleton } from 'antd';
import { makeGetIndividualData } from '@/features/search/makeGetIndividualData.thunk';

const IndividualModal = ({
  individualID,
  isOpen,
  onClose,
}: {
  individualID: string | null;
  isOpen: boolean;
  onClose: () => void;
}) => {
  if (!individualID) return <></>;
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(makeGetIndividualData(individualID));
  }, [individualID]);

  const isFetchingIndividualData = useAppSelector((state) => state.query.isFetchingIndividualData[individualID]);
  const individualData = useAppSelector((state) => state.query.individualDataCache[individualID]);

  return (
    <Modal
      title={`Individual ${individualID}`}
      open={isOpen}
      onCancel={onClose}
      footer={null}
      width={800}
      destroyOnClose={true}
      maskClosable={false}
    >
      <Skeleton loading={isFetchingIndividualData} active={!isFetchingIndividualData}>
        {individualData && <div>Individual Data for {individualID}</div>}
      </Skeleton>
    </Modal>
  );
};

export default IndividualModal;
