import { type CSSProperties, useCallback, useEffect, useMemo, useState } from 'react';
import { Card, Col, Divider, FloatButton, Row, Skeleton, Typography } from 'antd';
import { AppstoreAddOutlined } from '@ant-design/icons';

import { convertSequenceAndDisplayData, saveValue } from '@/utils/localStorage';
import type { Sections } from '@/types/data';
import { RequestStatus } from '@/types/requests';

import { BOX_SHADOW, LOCALSTORAGE_CHARTS_KEY } from '@/constants/overviewConstants';
import { WAITING_STATES } from '@/constants/requests';

import OverviewSection from './OverviewSection';
import ManageChartsDrawer from './Drawer/ManageChartsDrawer';
import Counts from './Counts';
import LastIngestionInfo from './LastIngestion';
import Loader from '@/components/Loader';
import Dataset from '@/components/Provenance/Dataset';
import Catalogue from '@/components/Provenance/Catalogue/Catalogue';

import { useTranslation } from 'react-i18next';
import { useAppSelector, useTranslationFn } from '@/hooks';
import { useData, useSearchableFields } from '@/features/data/hooks';
import { useMetadata, useSelectedProject, useSelectedScope } from '@/features/metadata/hooks';

const ABOUT_CARD_STYLE: CSSProperties = { width: '100%', maxWidth: '1390px', borderRadius: '11px', ...BOX_SHADOW };
const MANAGE_CHARTS_BUTTON_STYLE: CSSProperties = { right: '5em', bottom: '1.5em', transform: 'scale(125%)' };

const InstanceAboutBox = ({ style, bottomDivider }: { style?: CSSProperties; bottomDivider?: boolean }) => {
  const { i18n } = useTranslation();

  const { status: aboutStatus, about } = useAppSelector((state) => state.content);
  const aboutContent = useMemo(() => about[i18n.language].trim(), [about, i18n.language]);

  // If about is blank after loading, we don't have anything - so don't render the box.
  return aboutStatus === RequestStatus.Fulfilled && !aboutContent ? null : (
    <>
      <Card style={{ ...ABOUT_CARD_STYLE, ...(style ?? {}) }}>
        {aboutStatus === RequestStatus.Idle || aboutStatus === RequestStatus.Pending ? (
          <Skeleton title={false} paragraph={{ rows: 2 }} />
        ) : (
          <div className="about-content" dangerouslySetInnerHTML={{ __html: aboutContent }} />
        )}
      </Card>
      {bottomDivider && <Divider style={{ maxWidth: 1310, minWidth: 'auto', margin: '32px auto' }} />}
    </>
  );
};

const PublicOverview = () => {
  const t = useTranslationFn();

  const [drawerVisible, setDrawerVisible] = useState(false);

  const selectedProject = useSelectedProject();
  const { scope, scopeSet } = useSelectedScope();
  const { projects } = useMetadata();

  const showCatalogue = scopeSet && !selectedProject && projects.length > 1;

  const { status: overviewDataStatus, sections } = useData({ fetchEnabled: showCatalogue });

  useEffect(() => {
    // Save sections to localStorage when they change
    if (overviewDataStatus != RequestStatus.Fulfilled) return;
    saveToLocalStorage(sections);
  }, [overviewDataStatus, sections]);

  const displayedSections = sections.filter(({ charts }) => charts.findIndex(({ isDisplayed }) => isDisplayed) !== -1);

  const onManageChartsOpen = useCallback(() => setDrawerVisible(true), []);
  const onManageChartsClose = useCallback(() => {
    setDrawerVisible(false);
    // When we close the drawer, save any changes to localStorage. This helps ensure width gets saved:
    saveToLocalStorage(sections);
  }, [sections]);

  const searchableFields = useSearchableFields();

  if (showCatalogue) {
    return (
      <>
        <InstanceAboutBox style={{ maxWidth: 1325, margin: 'auto' }} bottomDivider={true} />
        <Catalogue />
      </>
    );
  }

  return WAITING_STATES.includes(overviewDataStatus) ? (
    <Loader />
  ) : (
    <>
      <InstanceAboutBox />
      <Row>
        <Col flex={1}>
          <Counts />
        </Col>
      </Row>
      {selectedProject && !scope.dataset && selectedProject.datasets.length ? (
        // If we have a project with more than one dataset, show a dataset selector in the project overview
        <Row>
          <Col flex={1}>
            <Typography.Title level={3}>Datasets</Typography.Title>
            <div className="dataset-provenance-card-grid">
              {selectedProject.datasets.map((d) => (
                <div key={d.identifier}>
                  <Dataset parentProjectID={selectedProject.identifier} dataset={d} format="card" />
                </div>
              ))}
            </div>
          </Col>
        </Row>
      ) : null}
      <Row>
        <Col flex={1}>
          {displayedSections.map(({ sectionTitle, charts }, i) => (
            <div key={i} className="overview">
              <OverviewSection title={sectionTitle} chartData={charts} searchableFields={searchableFields} />
            </div>
          ))}
          <LastIngestionInfo />
        </Col>
      </Row>

      <ManageChartsDrawer onManageDrawerClose={onManageChartsClose} manageDrawerVisible={drawerVisible} />
      <FloatButton
        type="primary"
        icon={<AppstoreAddOutlined rotate={270} />}
        tooltip={t('Manage Charts')}
        style={MANAGE_CHARTS_BUTTON_STYLE}
        onClick={onManageChartsOpen}
      />
    </>
  );
};

const saveToLocalStorage = (sections: Sections) => {
  saveValue(LOCALSTORAGE_CHARTS_KEY, convertSequenceAndDisplayData(sections));
};

export default PublicOverview;
