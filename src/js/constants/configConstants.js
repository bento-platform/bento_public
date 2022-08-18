const { CLIENT, HOST, DEBUG, MAX_QUERY_PARAMETERS } = process.env;

export const debug = DEBUG.toLowerCase() === 'true';
export const client = CLIENT;
export const maxQueryParameters = MAX_QUERY_PARAMETERS;

export const configUrl = HOST + '/config';
export const publicOverviewUrl = HOST + '/overview';
export const searchFieldsUrl = HOST + '/fields';
export const katsuUrl = HOST + '/katsu';

export const demo = {
  title: 'Biobanque québécoise de la COVID-19 (BQC19)',
  description:
    'The Biobanque québécoise de la COVID-19 (BQC19) stores and shares blood samples from both severe and non-severe cases of Quebec COVID-19 patients, as well as from control individuals. It makes samples, as well as data, available to scientists such as immunologists, virologists and public health researchers.',
  creators: [
    {
      name: 'Biobanque québécoise de la COVID-19',
      abbreviation: 'BQC19',
    },
  ],
  types: [
    {
      information: {
        value: 'Biobank',
      },
    },
  ],
  version: '1.0',
  privacy: 'controlled',
  licenses: [
    {
      name: '',
    },
  ],
  distributions: [
    {
      formats: ['XLSX, CRAM, VCF, PLINK, etc.'],
      size: 500,
      unit: {
        value: 'TB',
      },
      access: {
        landingPage: 'https://www.quebeccovidbiobank.ca/',
        authorizations: [
          {
            value: 'public',
          },
        ],
      },
    },
  ],
  isAbout: [
    {
      name: 'Homo sapiens',
      identifier: {
        identifier: 'https://www.ncbi.nlm.nih.gov/taxonomy/9606',
        identifierSource: 'NCBI Taxonomy Database',
      },
    },
  ],
  spatialCoverage: [
    {
      name: 'Quebec, Canada',
      description: '',
    },
  ],
  acknowledges: [
    {
      name: 'Grants',
      funders: [
        {
          name: 'https://docs.google.com/document/d/1AbU4u_V84LousGzZB_zYWyMLWqta_YNJO2Bes4--26c/',
          abbreviation: '',
        },
      ],
    },
  ],
  keywords: [
    {
      value: 'COVID-19 Biobank',
    },
  ],
  extraProperties: [
    {
      category: 'files',
      values: [
        {
          value: '1',
        },
      ],
    },
    {
      category: 'origin_consortium',
      values: [
        {
          value: 'Biobanque québécoise de la COVID-19',
        },
      ],
    },
    {
      category: 'origin_province',
      values: [
        {
          value: 'Quebec',
        },
      ],
    },
    {
      category: 'origin_country',
      values: [
        {
          value: 'Canada',
        },
      ],
    },
    {
      category: 'logo',
      values: [
        {
          value: 'https://www.bqc19.ca/images/logo/logo-bleu@250x200.png',
        },
      ],
    },
    {
      category: 'contact',
      values: [
        {
          value: 'BQC19 support, info@bqc19.ca',
        },
      ],
    },
  ],
};
