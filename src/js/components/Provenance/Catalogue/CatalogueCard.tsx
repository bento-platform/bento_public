import { useMemo } from 'react';
import i18n from '@/i18n';
import { Card, Carousel, Descriptions, Flex, Space, Tag, Tooltip, Typography } from 'antd';
import type { Project } from '@/types/metadata';
import { isoDateToString } from '@/utils/strings';
import { useTranslationFn } from '@/hooks';
import { BOX_SHADOW } from '@/constants/overviewConstants';
import Dataset from '@/components/Provenance/Catalogue/Dataset';
import { scopeToUrl } from '@/utils/router';
import { useLocation } from 'react-router-dom';

const { Paragraph, Text, Title, Link } = Typography;

const MAX_KEYWORD_CHARACTERS = 50;

const CatalogueCard = ({ project }: { project: Project }) => {
  const lang = i18n.language;
  const t = useTranslationFn();
  const location = useLocation();
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
    <Card style={{ maxWidth: '1300px', ...BOX_SHADOW }}>
      <Flex justify="space-between" wrap>
        <div style={{ flex: 1, paddingRight: '10px', minWidth: '450px' }}>
          <Space direction="vertical">
            <Space direction="horizontal">
              <Title level={4} style={{ marginTop: 0 }}>
                {t(title)}
              </Title>
              <div style={{ marginBottom: '8px' }}>
                <Link href={scopeToUrl({ project: identifier }, baseURL)}>{t('Explore Project')}</Link>
              </div>
            </Space>

            {description && (
              <Paragraph
                ellipsis={{
                  rows: 3,
                  tooltip: { title: t(description) },
                }}
              >
                {t(description)}
              </Paragraph>
            )}
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
            <Descriptions items={projectInfo} />
          </Space>
        </div>
        <div style={{ flex: 1, maxWidth: '600px' }}>
          <Title level={5} style={{ marginTop: 0 }}>
            {t('Datasets')}
          </Title>
          <Carousel
            arrows={datasets.length > 1}
            style={{ border: '1px solid lightgray', borderRadius: '7px', height: '170px', padding: '16px' }}
          >
            {datasets.map((d) => (
              <Dataset
                parentProjectID={identifier}
                key={d.identifier}
                dataset={d}
                format="carousel"
                navigateLink={scopeToUrl({ project: identifier, dataset: d.identifier }, baseURL)}
              />
            ))}
          </Carousel>
        </div>
      </Flex>
    </Card>
  );
};
export default CatalogueCard;
