import def_fr_trans from './default_translation_fr.json';
import fr_trans from './translation_fr.json';

const translation = {
  // Default Translation
  ...def_fr_trans,

  // Non-Default
  ...fr_trans,
};

export default translation;
