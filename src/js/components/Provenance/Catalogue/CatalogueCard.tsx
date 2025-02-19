import { type ReactNode, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import { Button, Card, Carousel, Descriptions, Flex, Space, Tag, Tooltip, Typography } from 'antd';
import { PieChartOutlined, ProfileOutlined, SearchOutlined } from '@ant-design/icons';

import i18n from '@/i18n';

import type { Project } from '@/types/metadata';
import { isoDateToString } from '@/utils/strings';
import { useTranslationFn } from '@/hooks';
import { useSmallScreen } from '@/hooks/useResponsiveContext';
import { BOX_SHADOW } from '@/constants/overviewConstants';
import Dataset from '@/components/Provenance/Dataset';
import TruncatedParagraph from '@/components/Util/TruncatedParagraph';
import { scopeToUrl } from '@/utils/router';

const { Paragraph, Text, Title } = Typography;

const MAX_KEYWORD_CHARACTERS = 50;

const CatalogueCardInner = ({ firstContent, secondContent }: { firstContent: ReactNode; secondContent: ReactNode }) => {
  const isSmallScreen = useSmallScreen();

  if (isSmallScreen) {
    return (
      <Flex vertical={true} gap={12}>
        <div>{firstContent}</div>
        <div>{secondContent}</div>
      </Flex>
    );
  } else {
    return (
      <Flex justify="space-between" align="stretch" gap={16} wrap>
        <div style={{ flex: 1, minWidth: 400 }}>
          <div style={{ height: '100%', flex: 1, flexDirection: 'column', display: 'flex' }}>{firstContent}</div>
        </div>
        {secondContent && <div style={{ flex: 2, maxWidth: 'min(600px, 100%)' }}>{secondContent}</div>}
      </Flex>
    );
  }
};

const CatalogueCard = ({ project }: { project: Project }) => {
  const lang = i18n.language;
  const t = useTranslationFn();
  const location = useLocation();
  const navigate = useNavigate();
  const baseURL = '/' + location.pathname.split('/')[1];

  const isSmallScreen = useSmallScreen();

  const { datasets, created, updated, title, description, identifier } = project;

  const { selectedKeywords, extraKeywords, extraKeywordCount } = useMemo(() => {
    const keywords = datasets.flatMap((d) => d.dats_file.keywords ?? []).map((k) => t(k.value as string));

    let totalCharacters = 0;
    const selectedKeywords: string[] = [];
    const extraKeywords: string[] = [];

    for (const keyword of keywords) {
      if (totalCharacters + keyword.length > MAX_KEYWORD_CHARACTERS) {
        extraKeywords.push(keyword);
      } else {
        selectedKeywords.push(keyword);
        totalCharacters += keyword.length;
      }
    }

    return {
      selectedKeywords,
      extraKeywords,
      extraKeywordCount: extraKeywords.length,
    };
  }, [datasets, t]);

  const projectCreated = isoDateToString(created, lang);

  // TODO: this should be newer of project updated + last ingested of any data type
  const projectUpdated = isoDateToString(updated, lang);

  const projectInfo = [
    {
      key: '1',
      label: t('Created'),
      children: (
        <Paragraph
          ellipsis={{
            rows: 1,
            tooltip: { title: projectCreated },
          }}
          style={{ margin: 0 }}
        >
          {projectCreated}
        </Paragraph>
      ),
      span: 1.5,
    },
    {
      key: '2',
      label: t('Updated'),
      children: <Paragraph ellipsis={{ rows: 1, tooltip: { title: projectUpdated } }}>{projectUpdated}</Paragraph>,
      span: 1.5,
    },
  ];

  return (
    <Card className="container margin-auto" style={BOX_SHADOW} size={isSmallScreen ? 'small' : 'default'}>
      <CatalogueCardInner
        firstContent={
          <Flex vertical={true} gap={8} style={{ height: '100%' }}>
            <Space direction="horizontal">
              <Title level={4} style={{ margin: 0 }}>
                {t(title)}
              </Title>
            </Space>

            {description && <TruncatedParagraph style={{ maxWidth: 660 }}>{t(description)}</TruncatedParagraph>}

            {!!selectedKeywords.length && (
              <div>
                {selectedKeywords.map((kw) => (
                  <Tag key={kw} color="blue">
                    {kw}
                  </Tag>
                ))}
                {extraKeywordCount !== 0 && (
                  <Tooltip title={extraKeywords.join(', ')}>
                    <Text>+{extraKeywordCount} more</Text>
                  </Tooltip>
                )}
              </div>
            )}

            <Descriptions items={projectInfo} size="small" style={{ maxWidth: 500 }} />

            <div style={{ flex: 1, display: 'flex', alignItems: 'flex-end', gap: 12 }}>
              <Button
                icon={datasets.length ? <PieChartOutlined /> : <ProfileOutlined />}
                onClick={() => navigate(scopeToUrl({ project: identifier }, baseURL, 'overview'))}
              >
                {t('Overview')}
              </Button>
              {datasets.length ? (
                <Button
                  icon={<SearchOutlined />}
                  onClick={() => navigate(scopeToUrl({ project: identifier }, baseURL, 'search'))}
                >
                  {t('Search')}
                </Button>
              ) : null}
            </div>
          </Flex>
        }
        secondContent={
          datasets.length ? (
            <>
              <Title level={5} style={{ marginTop: 0 }}>
                {t('Datasets')}
              </Title>
              <Carousel
                arrows={datasets.length > 1}
                dots={datasets.length > 1}
                style={{
                  border: '1px solid lightgray',
                  borderRadius: '7px',
                  height: '170px',
                  // If we have more than one dataset, we have some arrows on either side of the carousel
                  //  --> add in extra horizontal padding to nicely clear the arrows.
                  padding: datasets.length > 1 ? '16px 26px' : '16px',
                }}
              >
                {datasets.map((d) => (
                  <Dataset parentProjectID={identifier} key={d.identifier} dataset={d} format="carousel" />
                ))}
              </Carousel>
            </>
          ) : null
        }
      />
    </Card>
  );
};
export default CatalogueCard;
