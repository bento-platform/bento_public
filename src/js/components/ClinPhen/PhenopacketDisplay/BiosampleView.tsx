import { memo, useState, Fragment } from 'react';

import { Radio, Space, Tooltip } from 'antd';
import { PointMap } from 'bento-charts/dist/maps';
import OntologyTermComponent, { OntologyTermStack } from '@Util/ClinPhen/OntologyTerm';
import TimeElementDisplay from '@Util/ClinPhen/TimeElementDisplay';
import TDescriptions from '@Util/TDescriptions';
import CustomTable, { type CustomTableColumns } from '@Util/CustomTable';
import Procedure from '@Util/ClinPhen/Procedure';
import FileTable from '@Util/FileTable';
import JsonView from '@Util/JsonView';
import ExtraPropertiesDisplay from '@Util/ClinPhen/ExtraPropertiesDisplay';

import type { Biosample } from '@/types/clinPhen/biosample';
import type { Experiment } from '@/types/clinPhen/experiments/experiment';
import type { OntologyTerm } from '@/types/ontology';
import type { ConditionalDescriptionItem } from '@/types/descriptions';
import type { GeoLocation } from '@/types/geo';

import { useTranslationFn } from '@/hooks';
import { objectToBoolean } from '@/utils/boolean';

import { EM_DASH } from '@/constants/common';
import { ISO_3166_1_ISO3_TO_ISO2 } from '@/constants/countryCodes';
import PhenopacketLink from '../PhenopacketLink';

const MAP_WIDTH = 500;

// See https://www.bqst.fr/country-code-to-flag-emoji/
const FlagEmoji = memo(({ countryCode }: { countryCode: string }) =>
  String.fromCodePoint(
    ...countryCode
      .toUpperCase()
      .split('')
      .map((char) => 127397 + char.charCodeAt(0))
  )
);
FlagEmoji.displayName = 'FlagEmoji';

const BiosampleLocationCollected = ({ biosample }: { biosample: Biosample }) => {
  const t = useTranslationFn();

  const [locationView, setLocationView] = useState<'map' | 'json'>('map');

  if (!biosample.location_collected) return null;

  return (
    <div className="w-full position-relative" style={{ minWidth: MAP_WIDTH }}>
      <Radio.Group
        value={locationView}
        onChange={(e) => {
          setLocationView(e.target.value);
        }}
        options={[
          { label: t('Map'), value: 'map' },
          { label: t('JSON'), value: 'json' },
        ]}
        optionType="button"
        className="position-absolute"
        style={{ top: 8, right: 0, zIndex: 999 }}
      />
      <div className={locationView === 'map' ? 'block' : 'none'} style={{ width: MAP_WIDTH }}>
        <PointMap
          data={[{ ...biosample.location_collected.geometry, title: biosample.id }]}
          center={[
            biosample.location_collected.geometry.coordinates[1],
            biosample.location_collected.geometry.coordinates[0],
          ]}
          zoom={13}
          height={350}
          renderPopupBody={(p) => {
            const props = biosample.location_collected?.properties ?? {};
            console.debug('showing popup body for point:', p, props);

            // @ts-expect-error TODO fix katsu
            const countryCode: string = props.ISO3166alpha3 ?? props.iso3166alpha3;

            return (
              <div>
                <TDescriptions
                  column={1}
                  defaultI18nPrefix="geo_location."
                  items={[
                    { key: 'label', children: props.label, isVisible: !!props.label && props.label !== props.city },
                    { key: 'city', children: t(props.city) },
                    { key: 'country', children: t(props.country) },
                    { key: 'precision', children: t(props.precision) },
                    {
                      key: 'ISO3166alpha3',
                      label: 'geo_location.country_code',
                      children: countryCode ? (
                        <>
                          {countryCode} <FlagEmoji countryCode={ISO_3166_1_ISO3_TO_ISO2[countryCode]} />
                        </>
                      ) : null,
                    },
                  ]}
                />
              </div>
            );
          }}
        />
      </div>
      <div className={locationView === 'json' ? 'block' : 'none'}>
        <JsonView src={biosample.location_collected} collapsed={3} />
      </div>
    </div>
  );
};

export const BiosampleExpandedRow = ({ biosample, searchRow }: { biosample: Biosample; searchRow?: boolean }) => {
  const items: ConditionalDescriptionItem[] = [
    ...(searchRow
      ? [
          {
            key: 'sampled_tissue',
            children: <OntologyTermComponent term={biosample.sampled_tissue} />,
            isVisible: biosample.sampled_tissue,
          },
        ]
      : []),
    { key: 'description', children: biosample.description },
    { key: 'derived_from_id', children: biosample.derived_from_id },
    {
      key: 'sample_type',
      children: <OntologyTermComponent term={biosample.sample_type} />,
      isVisible: biosample.sample_type,
    },
    {
      key: 'taxonomy',
      children: <OntologyTermComponent term={biosample.taxonomy} italic />,
      isVisible: biosample.taxonomy,
    },
    {
      key: 'time_of_collection',
      children: <TimeElementDisplay element={biosample.time_of_collection} />,
      isVisible: biosample.time_of_collection,
    },
    {
      key: 'location_collected',
      children: biosample.location_collected && <BiosampleLocationCollected biosample={biosample} />,
      isVisible: biosample.location_collected,
      span: 3,
    },
    {
      key: 'histological_diagnosis',
      children: <OntologyTermComponent term={biosample.histological_diagnosis} />,
      isVisible: biosample.histological_diagnosis,
    },
    {
      key: 'pathological_stage',
      children: <OntologyTermComponent term={biosample.pathological_stage} />,
      isVisible: biosample.pathological_stage,
    },
    {
      key: 'pathological_tnm_finding',
      children: <OntologyTermStack terms={biosample.pathological_tnm_finding} />,
      isVisible: biosample.pathological_tnm_finding?.length,
    },
    {
      key: 'diagnostic_markers',
      children: <OntologyTermStack terms={biosample.diagnostic_markers} />,
      isVisible: biosample.diagnostic_markers?.length,
    },
    {
      key: 'tumor_progression',
      children: <OntologyTermComponent term={biosample.tumor_progression} />,
      isVisible: biosample.tumor_progression,
    },
    {
      key: 'tumor_grade',
      children: <OntologyTermComponent term={biosample.tumor_grade} />,
      isVisible: biosample.tumor_grade,
    },
    {
      key: 'material_sample',
      children: <OntologyTermComponent term={biosample.material_sample} />,
      isVisible: biosample.material_sample,
    },
    {
      key: 'sample_processing',
      children: <OntologyTermComponent term={biosample.sample_processing} />,
      isVisible: biosample.sample_processing,
    },
    {
      key: 'sample_storage',
      children: <OntologyTermComponent term={biosample.sample_storage} />,
      isVisible: biosample.sample_storage,
    },
    {
      key: 'procedure',
      children: <Procedure procedure={biosample.procedure} />,
      isVisible: objectToBoolean(biosample.procedure),
    },
    {
      key: 'files',
      children: <FileTable files={biosample.files ?? []} />,
      isVisible: objectToBoolean(biosample.files),
    },
  ];

  return (
    <Space direction="vertical" className="w-full">
      <TDescriptions bordered size="compact" defaultI18nPrefix="biosample." column={{ lg: 1, xl: 3 }} items={items} />
      <ExtraPropertiesDisplay extraProperties={biosample.extra_properties} />
    </Space>
  );
};

export const LatLong = ({ location }: { location?: GeoLocation }) => {
  const t = useTranslationFn();
  if (!location) return EM_DASH;
  return (
    <>
      <strong>{t('geo_location.latitude')}:</strong>&nbsp;{location.geometry.coordinates[1]}
      <br />
      <strong>{t('geo_location.longitude')}:</strong>&nbsp;{location.geometry.coordinates[0]}
    </>
  );
};

export const isBiosampleRowExpandable = (r: Biosample, searchRow: boolean = false) =>
  !!(
    (searchRow && r.sampled_tissue) ||
    r.description ||
    r.derived_from_id ||
    r.individual_id ||
    r.sample_type ||
    r.taxonomy ||
    r.time_of_collection ||
    r.location_collected ||
    r.histological_diagnosis ||
    r.pathological_stage ||
    r.pathological_tnm_finding?.length ||
    r.tumor_progression ||
    r.tumor_grade ||
    r.material_sample ||
    r.sample_processing ||
    r.sample_storage ||
    r.procedure ||
    r.files?.length ||
    objectToBoolean(r.extra_properties)
  );

const ExperimentReferences = ({ experiments }: { experiments: Experiment[] }) => {
  const typeSafeExperiments = experiments ? [...experiments] : [];
  const sorted = typeSafeExperiments
    .sort((a, b) => a.experiment_type.localeCompare(b.experiment_type) || a.id.localeCompare(b.id))
    .map((e, _, arr) => ({
      ...e,
      typeIndex: arr.slice(0, arr.indexOf(e)).filter((x) => x.experiment_type === e.experiment_type).length + 1,
    }));
  return (
    <div>
      {sorted.map((e, i) => (
        <Fragment key={e.id}>
          <PhenopacketLink.Experiment experimentId={e.id}>
            <Tooltip title={e.id} styles={{ body: { wordWrap: 'normal', inlineSize: 'max-content' } }}>
              {e.experiment_type} ({e.typeIndex})
            </Tooltip>
          </PhenopacketLink.Experiment>

          {i < sorted.length - 1 ? ', ' : ''}
        </Fragment>
      ))}
    </div>
  );
};

interface BiosampleViewProps {
  biosamples: Biosample[];
}

const BIOSAMPLE_VIEW_COLUMNS: CustomTableColumns<Biosample> = [
  {
    title: 'biosample.biosample_id',
    dataIndex: 'id',
    alwaysShow: true,
  },
  {
    title: 'biosample.sampled_tissue',
    dataIndex: 'sampled_tissue',
    render: (term: OntologyTerm) => <OntologyTermComponent term={term} />,
  },
  // TODO: instead re-use translation but with a title case transform.
  {
    title: 'biosample.location_collected',
    dataIndex: 'location_collected',
    render: (locationCollected: GeoLocation | undefined) => <LatLong location={locationCollected} />,
  },
  {
    title: 'biosample.linked_experiments',
    dataIndex: 'experiments',
    render: (experiments: Experiment[]) => <ExperimentReferences experiments={experiments} />,
  },
];

//TODO: add button that links to experiment (like bento web)
const BiosampleView = ({ biosamples }: BiosampleViewProps) => {
  return (
    <CustomTable<Biosample>
      dataSource={biosamples}
      columns={BIOSAMPLE_VIEW_COLUMNS}
      expandedRowRender={(record) => <BiosampleExpandedRow biosample={record} />}
      rowKey="id"
      queryKey="biosample"
      isRowExpandable={isBiosampleRowExpandable}
    />
  );
};

export default BiosampleView;
