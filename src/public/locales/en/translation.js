import def_trans_en from './default_translation_en.json';
import axios from 'axios';

const trans_en = await axios.get('/public/locales/en/translation_en.json').then((response) => response.data);

const translation = {
  // Default Translation
  ...def_trans_en,

  // Non-Default
  ...trans_en,
};

export default translation;
