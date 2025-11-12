const LANGUAGE_HIGHLIGHTERS: Record<string, string> = {
  bash: 'bash',
  js: 'javascript',
  json: 'json',
  md: 'markdown',
  mjs: 'javascript',
  txt: 'plaintext',
  py: 'python',
  R: 'r',
  sh: 'shell',
  xml: 'xml',

  // Special files
  Dockerfile: 'dockerfile',
  README: 'plaintext',
  CHANGELOG: 'plaintext',
};

export const VIEWABLE_FILE_FORMATS = ['PDF', 'CSV', 'TSV'];

export const AUDIO_FILE_EXTENSIONS = ['3gp', 'aac', 'flac', 'm4a', 'mp3', 'ogg', 'wav'];
export const CSV_LIKE_FILE_EXTENSIONS = ['csv', 'tsv'];
export const IMAGE_FILE_EXTENSIONS = ['apng', 'avif', 'bmp', 'gif', 'jpg', 'jpeg', 'png', 'svg', 'webp'];
export const VIDEO_FILE_EXTENSIONS = ['mp4', 'webm'];

// TODO: ".bed",
//  .bed files are basically TSVs, but they can have instructions and can be whitespace-delimited instead
export const VIEWABLE_FILE_EXTENSIONS = [
  // Audio
  ...AUDIO_FILE_EXTENSIONS,

  // Images
  ...IMAGE_FILE_EXTENSIONS,

  // Videos
  ...VIDEO_FILE_EXTENSIONS,

  // Documents
  'docx',
  'html',
  'pdf',

  // Tabular data
  ...CSV_LIKE_FILE_EXTENSIONS,
  'csv',
  'tsv',
  'xls',
  'xlsx',

  // Code & text formats
  ...Object.keys(LANGUAGE_HIGHLIGHTERS),
];
