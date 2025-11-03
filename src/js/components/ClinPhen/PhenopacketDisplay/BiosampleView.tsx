import { memo, useState } from 'react';

import { Radio, Space } from 'antd';
import { PointMap } from 'bento-charts/dist/maps';
import OntologyTermComponent, { OntologyTermStack } from '@Util/ClinPhen/OntologyTerm';
import TimeElementDisplay from '@Util/ClinPhen/TimeElementDisplay';
import TDescriptions from '@Util/TDescriptions';
import CustomTable, { type CustomTableColumns } from '@Util/CustomTable';
import Procedure from '@Util/ClinPhen/Procedure';
import FileTable from '@Util/FileTable';
import JsonView from '@Util/JsonView';
import ExtraPropertiesDisplay from './ExtraPropertiesDisplay';

import type { Biosample } from '@/types/clinPhen/biosample';
import type { OntologyTerm } from '@/types/ontology';
import type { ConditionalDescriptionItem } from '@/types/descriptions';
import type { GeoLocation } from '@/types/geo';

import { useTranslationFn } from '@/hooks';
import { objectToBoolean } from '@/utils/boolean';

import { EM_DASH } from '@/constants/common';
import { ISO_3166_1_ISO3_TO_ISO2 } from '@/constants/countryCodes';

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

export const BiosampleLocationCollected = ({ biosample }: { biosample: Biosample }) => {
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
                  items={[
                    {
                      key: 'label',
                      label: 'geo_location.label',
                      children: props.label,
                      isVisible: !!props.label && props.label !== props.city,
                    },
                    { key: 'city', label: 'geo_location.city', children: t(props.city) },
                    { key: 'country', label: 'geo_location.country', children: t(props.country) },
                    { key: 'precision', label: 'geo_location.precision', children: t(props.precision) },
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
        <JsonView src={biosample.location_collected} />
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
            label: 'biosample_table.sampled_tissue',
            children: <OntologyTermComponent term={biosample.sampled_tissue} />,
            isVisible: biosample.sampled_tissue,
          },
        ]
      : []),
    {
      key: 'description',
      label: 'biosample_expanded_row.description',
      children: biosample.description,
    },
    {
      key: 'derived_from_id',
      label: 'biosample_expanded_row.derived_from',
      children: biosample.derived_from_id,
    },
    {
      key: 'sample_type',
      label: 'biosample_expanded_row.sample_type',
      children: <OntologyTermComponent term={biosample.sample_type} />,
      isVisible: biosample.sample_type,
    },
    {
      key: 'taxonomy',
      label: 'biosample_expanded_row.taxonomy',
      children: (
        <em>
          <OntologyTermComponent term={biosample.taxonomy} />
        </em>
      ),
      isVisible: biosample.taxonomy,
    },
    {
      key: 'time_of_collection',
      label: 'biosample_expanded_row.collection_time',
      children: <TimeElementDisplay element={biosample.time_of_collection} />,
      isVisible: biosample.time_of_collection,
    },
    {
      key: 'location_collected',
      label: 'biosample_expanded_row.location_collected',
      children: biosample.location_collected && <BiosampleLocationCollected biosample={biosample} />,
      isVisible: biosample.location_collected,
      span: 3,
    },
    {
      key: 'histological_diagnosis',
      label: 'biosample_expanded_row.histological_diagnosis',
      children: <OntologyTermComponent term={biosample.histological_diagnosis} />,
      isVisible: biosample.histological_diagnosis,
    },
    {
      key: 'pathological_stage',
      label: 'biosample_expanded_row.pathological_stage',
      children: <OntologyTermComponent term={biosample.pathological_stage} />,
      isVisible: biosample.pathological_stage,
    },
    {
      key: 'pathological_tnm_finding',
      label: 'biosample_expanded_row.pathological_tnm_finding',
      children: <OntologyTermStack terms={biosample.pathological_tnm_finding} />,
      isVisible: biosample.pathological_tnm_finding?.length,
    },
    {
      key: 'diagnostic_markers',
      label: 'biosample_expanded_row.diagnostic_markers',
      children: <OntologyTermStack terms={biosample.diagnostic_markers} />,
      isVisible: biosample.diagnostic_markers?.length,
    },
    {
      key: 'tumor_progression',
      label: 'biosample_expanded_row.tumor_progression',
      children: <OntologyTermComponent term={biosample.tumor_progression} />,
      isVisible: biosample.tumor_progression,
    },
    {
      key: 'tumor_grade',
      label: 'biosample_expanded_row.tumor_grade',
      children: <OntologyTermComponent term={biosample.tumor_grade} />,
      isVisible: biosample.tumor_grade,
    },
    {
      key: 'material_sample',
      label: 'biosample_expanded_row.material_sample',
      children: <OntologyTermComponent term={biosample.material_sample} />,
      isVisible: biosample.material_sample,
    },
    {
      key: 'sample_processing',
      label: 'biosample_expanded_row.sample_processing',
      children: <OntologyTermComponent term={biosample.sample_processing} />,
      isVisible: biosample.sample_processing,
    },
    {
      key: 'sample_storage',
      label: 'biosample_expanded_row.sample_storage',
      children: <OntologyTermComponent term={biosample.sample_storage} />,
      isVisible: biosample.sample_storage,
    },
    {
      key: 'procedure',
      label: 'biosample_expanded_row.procedure',
      children: <Procedure procedure={biosample.procedure} />,
      isVisible: objectToBoolean(biosample.procedure),
    },
    {
      key: 'files',
      label: 'biosample_expanded_row.files',
      children: <FileTable files={biosample.files ?? []} />,
      isVisible: objectToBoolean(biosample.files),
    },
  ];

  return (
    <Space direction="vertical" className="w-full">
      <TDescriptions bordered size="compact" column={{ lg: 1, xl: 3 }} items={items} />
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
    Object.keys(r.extra_properties ?? {}).length
  );

interface BiosampleViewProps {
  biosamples: Biosample[];
}

const BIOSAMPLE_VIEW_COLUMNS: CustomTableColumns<Biosample> = [
  {
    title: 'biosample_table.biosample_id',
    dataIndex: 'id',
    alwaysShow: true,
  },
  {
    title: 'biosample_table.sampled_tissue',
    dataIndex: 'sampled_tissue',
    render: (term: OntologyTerm) => <OntologyTermComponent term={term} />,
  },
  // TODO: instead re-use translation but with a title case transform.
  {
    title: 'biosample_table.location_collected',
    dataIndex: 'location_collected',
    render: (locationCollected: GeoLocation | undefined) => <LatLong location={locationCollected} />,
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
