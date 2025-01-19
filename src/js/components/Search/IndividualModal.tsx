import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/hooks';

import { Modal, Skeleton, Tabs, TabsProps } from 'antd';
import { makeGetIndividualData } from '@/features/search/makeGetIndividualData.thunk';
import IndividualOverview from '@/components/Search/Individuals/IndividualOverview';

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

  const tabItems: TabsProps['items'] = [
    {
      key: 'overview',
      label: 'Overview',
      children: <IndividualOverview individualData={individualData} />,
    },
    {
      key: 'biosamples',
      label: 'Biosamples',
      children: <div>Biosamples</div>,
    },
    {
      key: 'Measurements',
      label: 'Measurements',
      children: <div>Measurements</div>,
    },
    {
      key: 'Phenotypic Features',
      label: 'Phenotypic Features',
      children: <div>Phenotypic Features</div>,
    },
    {
      key: 'Diseases',
      label: 'Diseases',
      children: <div>Diseases</div>,
    },
    {
      key: 'Interpretations',
      label: 'Interpretations',
      children: <div>Interpretations</div>,
    },
    {
      key: 'Medical Actions',
      label: 'Medical Actions',
      children: <div>Medical Actions</div>,
    },
    {
      key: 'Experiments',
      label: 'Experiments',
      children: <div>Experiments</div>,
    },
    {
      key: 'Tracks',
      label: 'Tracks',
      children: <div>Tracks</div>,
    },
    {
      key: 'Ontologies',
      label: 'Ontologies',
      children: <div>Ontologies</div>,
    },
    {
      key: 'Phenopackets JSON',
      label: 'Phenopackets JSON',
      children: <div>Phenopackets JSON</div>,
    },
  ];

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
        {individualData && <Tabs items={tabItems} />}
      </Skeleton>
    </Modal>
  );
};

export default IndividualModal;
