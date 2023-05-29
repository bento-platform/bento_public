import React from 'react';
import { useAppSelector, useTranslationDefault } from '@/hooks';
import { serializeChartData } from '@/utils/chart';
import SearchResultsPane from '../Search/SearchResultsPane';

const BeaconSearchResults = () => {
  const { response } = useAppSelector((state) => state.beaconQuery);
  const individualCount = useAppSelector((state) => state.beaconQuery?.response?.responseSummary?.count);
  const isFetchingData = useAppSelector((state) => state.beaconQuery?.isFetchingQueryResponse);
  const hasInsufficientData = individualCount == 0

  const { info } = response;

  const biosamples = info?.bento?.biosamples ?? {};
  const biosampleCount = biosamples.count;
  const biosampleChartData = serializeChartData(biosamples.sampled_tissue ?? []);

  const experiments = info?.bento?.experiments ?? {};
  const experimentCount = experiments.count ?? 0;
  const experimentChartData = serializeChartData(experiments?.experiment_type ?? []);

  // shown when count = 0
  const message = 'Insufficient data available.';


  return (
    <SearchResultsPane
      isFetchingData={isFetchingData}
      hasInsufficientData={hasInsufficientData}
      message={message}
      individualCount={individualCount}
      biosampleCount={biosampleCount}
      biosampleChartData={biosampleChartData}
      experimentCount={experimentCount}
      experimentChartData={experimentChartData}
    />











  // const wrapperStyle = {
  //   padding: '40px',
  //   minHeight: '150px',
  //   maxHeight: '475px',
  // };

  // return (
  //   <div style={wrapperStyle}>
  //     <Card
  //       style={{ borderRadius: '10px', padding: '10px 33px', width: '1200px', height: '428px'}}
  //     >
  //       <Row gutter={16}>
  //         <Col span={4}>
  //           <Space direction="vertical" size="middle" style={{ display: 'flex' }}>
  //             <Statistic
  //               title={t('Individuals')}
  //               value={individualCount ? individualCount : t(message)}
  //               valueStyle={{ color: COUNTS_FILL }}
  //               prefix={<TeamOutlined />}
  //             />
  //             <Statistic
  //               title={t('Biosamples')}
  //               value={individualCount ? biosampleCount : '----' }
  //               valueStyle={{ color: COUNTS_FILL }}
  //               prefix={<BiDna />}
  //             />
  //             <Statistic
  //               title={t('Experiments')}
  //               value={individualCount ? experimentCount : '----' }
  //               valueStyle={{ color: COUNTS_FILL }}
  //               prefix={<ExpSvg />}
  //             />
  //           </Space>
  //         </Col>
  //         <Col span={10}>
  //           <Typography.Title level={5}>{t('Biosamples')}</Typography.Title>
  //           {biosampleChartData.length ? (
  //             <PieChart data={biosampleChartData} height={CHART_HEIGHT} sort={true} />
  //           ) : (
  //             <CustomEmpty text="No Results" />
  //           )}
  //         </Col>
  //         <Col span={10}>
  //           <Typography.Title level={5}>{t('Experiments')}</Typography.Title>
  //           {experimentChartData.length ? (
  //             <PieChart data={experimentChartData} height={CHART_HEIGHT} sort={true} />
  //           ) : (
  //             <CustomEmpty text="No Results" />
  //           )}
  //         </Col>
  //       </Row>
  //     </Card>
  //   </div>
  // );
};

export default BeaconSearchResults;
