import def_fr_trans from './default_translation_fr.json';
import axios from 'axios';

const fr_trans = await axios.get('/public/locales/fr/translation_fr.json').then((response) => response.data);

const translation = {
  // Default Translation
  ...def_fr_trans,

  // Non-Default
  ...fr_trans,
};

export default translation;
