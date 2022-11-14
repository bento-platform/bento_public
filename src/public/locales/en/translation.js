import def_trans_en from './default_translation_en.json';
import trans_en from './translation_en.json';

const translation = {
  // Default Translation
  ...def_trans_en,

  // Non-Default
  ...trans_en,
};

export default translation;
