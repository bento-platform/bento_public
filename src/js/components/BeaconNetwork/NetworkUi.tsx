import React, { useEffect, useState, ReactNode } from 'react';
import { useAppSelector, useAppDispatch, useTranslationDefault, useBeaconWithAuthIfAllowed } from '@/hooks';
import { Button, Card, Col, Form, Row, Space, Tooltip, Typography } from 'antd';
import NetworkBeacons from './NetworkBeacons';
import NetworkSearchResults from './NetworkSearchResults';
import BeaconQueryFormUi from '../BeaconCommon/BeaconQueryFormUi';
import { FAKE_QUERY_SECTIONS } from '@/constants/beaconConstants';
import { beaconNetworkQuery } from '@/features/beacon/networkQuery.store';
import { Section } from '@/types/search';

import {
  WRAPPER_STYLE,
  FORM_ROW_GUTTERS,
  CARD_STYLE,
  BUTTON_AREA_STYLE,
  BUTTON_STYLE,
  CARD_STYLES,
} from '@/constants/beaconConstants';

import { BOX_SHADOW } from '@/constants/overviewConstants';
const { Text, Title } = Typography;

const NetworkUi = () => {
  const dispatch = useAppDispatch();
  const beacons = useAppSelector((state) => state.beaconNetwork.beacons);
  const isFetchingConfig = useAppSelector((state) => state.beaconNetwork.isFetchingBeaconNetworkConfig);
  const networkAssemblyIds = useAppSelector((state) => state.beaconNetwork.assemblyIds)

  const networkQuerySections = useAppSelector((state) => state.beaconNetwork.currentQuerySections)
  
  console.log({networkQuerySections})
  
// either have to pass all filters and a toggle function
// or
// pass two sets of filters
// or
// have filters set completly by state, no props

// no point trying to pass beaconAssemblyIds if config is not fetched yetg
// in fact no point rendering this component if config is unknown 

  return (
  <div style={WRAPPER_STYLE}>
      <BeaconQueryFormUi
        isFetchingConfig={isFetchingConfig}
        isFetchingQueryResponse={false} //TODO? this is n/a here
        isNetworkQuery={true}
        beaconAssemblyIds={networkAssemblyIds}
        querySections={networkQuerySections}
        launchQuery={beaconNetworkQuery}
      />
      <NetworkSearchResults />
      <NetworkBeacons beacons={beacons} />
    </div>
  );
};

export default NetworkUi;
