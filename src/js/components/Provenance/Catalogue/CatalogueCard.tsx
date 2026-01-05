import { useMemo } from 'react';

import { Button, Card, Descriptions, Flex, Tag, Tooltip, Typography } from 'antd';
import { PieChartOutlined, ProfileOutlined } from '@ant-design/icons';

import type { Project } from '@/types/metadata';
import { isoDateToString } from '@/utils/strings';
import { useLanguage, useTranslationFn } from '@/hooks';
import { useNavigateToScope } from '@/hooks/navigation';
import { useSmallScreen } from '@/hooks/useResponsiveContext';
import { T_PLURAL_COUNT } from '@/constants/i18n';
import Dataset from '@/components/Provenance/Dataset';
import TruncatedParagraph from '@/components/Util/TruncatedParagraph';
import CountsDisplay from '@/components/Util/CountsDisplay';

const { Paragraph, Text, Title } = Typography;

const MAX_KEYWORD_CHARACTERS = 50;

const CatalogueCard = ({ project }: { project: Project }) => {
  const language = useLanguage();
  const t = useTranslationFn();
  const navigateToScope = useNavigateToScope();

  const isSmallScreen = useSmallScreen();

  const { datasets, created, updated, title, description, identifier, counts } = project;

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

  const projectCreated = isoDateToString(created, language);

  // TODO: this should be newer of project updated + last ingested of any data type
  const projectUpdated = isoDateToString(updated, language);

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
          className="m-0"
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
    <Card className="container margin-auto shadow rounded-xl" size={isSmallScreen ? 'small' : 'default'}>
      <Flex vertical={true} gap={16}>
        {/* Project info */}
        <Flex vertical={true} gap={8}>
          <Title level={4} className="m-0">
            {t(title)}
          </Title>

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

          <CountsDisplay counts={counts} />

          <Flex gap={12}>
            <Button
              icon={datasets.length ? <PieChartOutlined /> : <ProfileOutlined />}
              onClick={() => navigateToScope({ project: identifier }, 'overview')}
            >
              {t('Explore')}
            </Button>
          </Flex>
        </Flex>

        {/* Datasets displayed horizontally */}
        {datasets.length > 0 && (
          <>
            <Title level={5} className="m-0">
              {t('entities.dataset', T_PLURAL_COUNT)}
            </Title>
            <Flex gap={16} wrap>
              {datasets.map((d) => (
                <div key={d.identifier} style={{ flex: '1 1 300px', maxWidth: 500 }}>
                  <Dataset parentProjectID={identifier} dataset={d} format="card" />
                </div>
              ))}
            </Flex>
          </>
        )}
      </Flex>
    </Card>
  );
};
export default CatalogueCard;
