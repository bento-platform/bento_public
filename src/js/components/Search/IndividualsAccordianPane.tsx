import React from 'react';
import { PORTAL_URL } from '@/config';

const IndividualsAccordianPane = ({ id }: { id: string }) => {
  console.log('called for individual', id);
  return (
    <a href={`${PORTAL_URL}/data/explorer/individuals/${id}`} target="_blank" rel="noreferrer">
      {id}
    </a>
  );
};

export default IndividualsAccordianPane;
