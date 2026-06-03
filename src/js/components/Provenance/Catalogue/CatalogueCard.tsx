import { useMemo, useState } from 'react';

import { Button, Card, Descriptions, Divider, Flex, Tag, Tooltip, Typography } from 'antd';
import { ExpandAltOutlined, PieChartOutlined, SolutionOutlined } from '@ant-design/icons';

import type { Project } from '@/types/metadata';
import type { Dataset } from '@/types/dataset';
import type { StringOrOntologyClass } from '@/types/dataset';
import { BentoRoute } from '@/types/routes';
import { isoDateToString } from '@/utils/strings';
import { useLanguage, useTranslationFn } from '@/hooks';
import { useNavigateToScope } from '@/hooks/navigation';
import { useSmallScreen } from '@/hooks/useResponsiveContext';
import TruncatedParagraph from '@/components/Util/TruncatedParagraph';
import CountsDisplay from '@/components/Util/CountsDisplay';
import DatasetProvenanceModal from '../DatasetProvenanceModal';

const { Paragraph, Text, Title } = Typography;

const MAX_KEYWORD_CHARACTERS = 50;

const keywordLabel = (k: StringOrOntologyClass): string => (typeof k === 'string' ? k : k.label);

const CatalogueCard = ({ dataset, project, compact }: { dataset: Dataset; project: Project; compact?: boolean }) => {
  const language = useLanguage();
  const t = useTranslationFn();
  const navigateToScope = useNavigateToScope();
  const isSmallScreen = useSmallScreen();

  const [provenanceModalOpen, setProvenanceModalOpen] = useState(false);

  const { identifier, title, description } = dataset;
  const keywords = dataset.keywords ?? [];

  const { selectedKeywords, extraKeywords, extraKeywordCount } = useMemo(() => {
    const mapped = keywords.map((k) => t(keywordLabel(k)));
    let totalCharacters = 0;
    const selectedKeywords: string[] = [];
    const extraKeywords: string[] = [];
    for (const keyword of mapped) {
      if (totalCharacters + keyword.length > MAX_KEYWORD_CHARACTERS) {
        extraKeywords.push(keyword);
      } else {
        selectedKeywords.push(keyword);
        totalCharacters += keyword.length;
      }
    }
    return { selectedKeywords, extraKeywords, extraKeywordCount: extraKeywords.length };
  }, [keywords, t]);

  const createdStr = isoDateToString(dataset.release_date ?? project.created, language);
  const updatedStr = isoDateToString(dataset.last_modified ?? project.updated, language);

  const descItems = [
    {
      key: 'project',
      label: t('Project'),
      children: <Text>{t(project.title)}</Text>,
      span: 3,
    },
    {
      key: 'created',
      label: t('Created'),
      children: (
        <Paragraph ellipsis={{ rows: 1, tooltip: { title: createdStr } }} className="m-0">
          {createdStr}
        </Paragraph>
      ),
      span: 1.5,
    },
    {
      key: 'updated',
      label: t('Updated'),
      children: (
        <Paragraph ellipsis={{ rows: 1, tooltip: { title: updatedStr } }} className="m-0">
          {updatedStr}
        </Paragraph>
      ),
      span: 1.5,
    },
  ];

  const leftContent = (
    <Flex vertical={true} gap={8} className="h-full">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
        <Title level={4} style={{ margin: 0 }}>
          {t(title)}
        </Title>
        <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
          <Button
            icon={<PieChartOutlined />}
            onClick={() => navigateToScope({ project: project.identifier, dataset: identifier }, BentoRoute.Overview)}
          >
            {t('Explore')}
          </Button>
          <Button icon={<SolutionOutlined />} onClick={() => setProvenanceModalOpen(true)}>
            {t('Provenance')}
            <ExpandAltOutlined />
          </Button>
        </div>
      </div>

      <Divider style={{ margin: '8px 0' }} />

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
    </Flex>
  );

  const rightContent = (
    <Flex vertical={true} gap={8}>
      <Descriptions items={descItems} size="small" />
      <CountsDisplay counts={dataset.counts_by_entity ?? project.counts} />
    </Flex>
  );

  return (
    <>
      <DatasetProvenanceModal dataset={dataset} open={provenanceModalOpen} onCancel={() => setProvenanceModalOpen(false)} />
      <Card className="container margin-auto shadow rounded-xl h-full" size={isSmallScreen ? 'small' : 'default'}>
        {isSmallScreen || compact ? (
          <Flex vertical={true} gap={12}>
            {leftContent}
            {rightContent}
          </Flex>
        ) : (
          <Flex justify="space-between" align="stretch" gap={16} wrap>
            <div className="flex-1" style={{ minWidth: 400 }}>
              {leftContent}
            </div>
            <div style={{ flex: 1, maxWidth: 'min(500px, 100%)' }}>{rightContent}</div>
          </Flex>
        )}
      </Card>
    </>
  );
};

export default CatalogueCard;
