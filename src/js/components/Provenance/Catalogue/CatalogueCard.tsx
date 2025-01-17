import { useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import { Button, Card, Carousel, Descriptions, Flex, Space, Tag, Tooltip, Typography } from 'antd';
import { PieChartOutlined, SearchOutlined } from '@ant-design/icons';

import i18n from '@/i18n';

import type { Project } from '@/types/metadata';
import { isoDateToString } from '@/utils/strings';
import { useTranslationFn } from '@/hooks';
import { BOX_SHADOW } from '@/constants/overviewConstants';
import Dataset from '@/components/Provenance/Dataset';
import TruncatedParagraph from '@/components/Util/TruncatedParagraph';
import { scopeToUrl } from '@/utils/router';

const { Paragraph, Text, Title } = Typography;

const MAX_KEYWORD_CHARACTERS = 50;

const CatalogueCard = ({ project }: { project: Project }) => {
  const lang = i18n.language;
  const t = useTranslationFn();
  const location = useLocation();
  const navigate = useNavigate();
  const baseURL = '/' + location.pathname.split('/')[1];
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
    <Card className="container" style={BOX_SHADOW}>
      <Flex justify="space-between" align="stretch" gap={16} wrap>
        <div style={{ flex: 1, paddingRight: '10px', minWidth: '450px' }}>
          <div style={{ height: '100%', flex: 1, flexDirection: 'column', display: 'flex' }}>
            <Space direction="horizontal">
              <Title level={4} style={{ marginTop: 0 }}>
                {t(title)}
              </Title>
            </Space>

            {description && <TruncatedParagraph>{t(description)}</TruncatedParagraph>}

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

            <Descriptions items={projectInfo} />

            <div style={{ flex: 1, display: 'flex', alignItems: 'flex-end', gap: 12 }}>
              <Button
                icon={<PieChartOutlined />}
                onClick={() => navigate(scopeToUrl({ project: identifier }, baseURL, 'overview'))}
              >
                {t('Overview')}
              </Button>
              <Button
                icon={<SearchOutlined />}
                onClick={() => navigate(scopeToUrl({ project: identifier }, baseURL, 'search'))}
              >
                {t('Search')}
              </Button>
            </div>
          </div>
        </div>
        <div style={{ flex: 1, maxWidth: '600px' }}>
          <Title level={5} style={{ marginTop: 0 }}>
            {t('Datasets')}
          </Title>
          <Carousel
            arrows={datasets.length > 1}
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
        </div>
      </Flex>
    </Card>
  );
};
export default CatalogueCard;
