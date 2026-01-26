import { useMemo } from 'react';

import { Button, Card, Descriptions, Divider, Flex, Tag, Tooltip, Typography } from 'antd';
import type { DescriptionsProps } from 'antd';
import { PieChartOutlined, ProfileOutlined, ProjectFilled } from '@ant-design/icons';

import type { Project, Dataset as DatasetType } from '@/types/metadata';
import { isoDateToString } from '@/utils/strings';
import { useLanguage, useTranslationFn } from '@/hooks';
import { useNavigateToScope } from '@/hooks/navigation';
import { useSmallScreen } from '@/hooks/useResponsiveContext';
import { T_PLURAL_COUNT } from '@/constants/i18n';
import Dataset from '@/components/Provenance/Dataset';
import TruncatedParagraph from '@/components/Util/TruncatedParagraph';
import CountsDisplay from '@/components/Util/CountsDisplay';
import ScrollableCardRow from '@/components/Util/ScrollableCardRow';

const { Paragraph, Text, Title } = Typography;

const MAX_KEYWORD_CHARACTERS = 50;

const ProjectCard = ({ project }: { project: Project }) => {
  const language = useLanguage();
  const navigateToScope = useNavigateToScope();

  const isSmallScreen = useSmallScreen();
  const t = useTranslationFn();

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

  const projectInfo: DescriptionsProps['items'] = [
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
    <Card className=" shadow rounded-xl w-425 h-350 flex-shrink-0" size={isSmallScreen ? 'small' : 'default'}>
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
    </Card>
  );
};

// TODO: Remove replication factor after testing scrollable behavior
const DATASET_REPLICATION_FACTOR = 2;

const DatasetRow = ({ datasets, projectId }: { datasets: DatasetType[]; projectId: string }) => {
  const t = useTranslationFn();

  // Duplicate datasets for testing scrollable behavior
  const replicatedDatasets = useMemo(() => {
    return Array.from({ length: DATASET_REPLICATION_FACTOR }, (_, i) =>
      datasets.map((d) => ({ ...d, _replicaIndex: i }))
    ).flat();
  }, [datasets]);

  return (
    <div style={{maxWidth: '900px'}}>
      {datasets.length ? (
        <div className="w-full">
          <Title level={5}>{t('entities.dataset', T_PLURAL_COUNT)}</Title>

          <ScrollableCardRow cardWidth={400}>
            {replicatedDatasets.map((d, idx) => (
              <Dataset parentProjectID={projectId} key={`${d.identifier}-${idx}`} dataset={d} format="card" />
            ))}
          </ScrollableCardRow>
        </div>
      ) : null}
    </div>
  );
};

const CatalogueProjectSection = ({ project }: { project: Project }) => {
  const { datasets, identifier } = project;

  return (
    <div className="container margin-auto catalogue-row rounded-xl bordered">
      <Flex gap="small" justify="flex-start" align='center'>
        <ProjectCard project={project} />
        <div className="divider flex-shrink-0" />
        <DatasetRow datasets={datasets} projectId={identifier} />
      </Flex>
    </div>
  );
};
export default CatalogueProjectSection;
