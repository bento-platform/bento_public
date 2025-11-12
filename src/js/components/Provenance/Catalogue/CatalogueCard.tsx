import { type ReactNode, useMemo } from 'react';

import { Button, Card, Carousel, Descriptions, Flex, Tag, Tooltip, Typography } from 'antd';
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
        <div className="flex-1" style={{ minWidth: 400 }}>
          <Flex className="h-full flex-1" vertical={true}>
            {firstContent}
          </Flex>
        </div>
        {secondContent && <div style={{ flex: 2, maxWidth: 'min(600px, 100%)' }}>{secondContent}</div>}
      </Flex>
    );
  }
};

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
      <CatalogueCardInner
        firstContent={
          <Flex vertical={true} gap={8} className="h-full">
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

            <Flex align="flex-end" gap={12} className="flex-1">
              <Button
                icon={datasets.length ? <PieChartOutlined /> : <ProfileOutlined />}
                onClick={() => navigateToScope({ project: identifier }, 'overview')}
              >
                {t('Explore')}
              </Button>
            </Flex>
          </Flex>
        }
        secondContent={
          datasets.length ? (
            <>
              <Title level={5}>{t('entities.dataset', T_PLURAL_COUNT)}</Title>
              <Carousel
                arrows={datasets.length > 1}
                dots={datasets.length > 1}
                className="rounded-lg"
                style={{
                  border: '1px solid lightgray',
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
