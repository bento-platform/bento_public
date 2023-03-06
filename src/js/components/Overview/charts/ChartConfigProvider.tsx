import React, { useContext } from 'react';

import { DEFAULT_CHART_THEME, defaultTranslationObject } from './chartConstants';
import { ChartTheme, LngDictionary, SupportedLng, TranslationObject } from './chartTypes';

const ChartThemeContext = React.createContext<ChartTheme>(DEFAULT_CHART_THEME);
export const useChartTheme = () => useContext(ChartThemeContext);

const ChartTranslationContext = React.createContext<LngDictionary>(defaultTranslationObject.en);
export const useChartTranslation = () => useContext(ChartTranslationContext);

export const ChartConfigProvider = ({
  theme = useChartTheme(),
  Lng,
  translationMap,
  children,
}: {
  theme?: ChartTheme;
  Lng: string;
  translationMap?: TranslationObject;
  children: React.ReactElement;
}) => {
  let lang: SupportedLng = 'en';
  try {
    lang = Lng as SupportedLng;
  } catch (e) {
    console.error('Lng is not a supported language');
  }
  return (
    <ChartThemeContext.Provider value={theme}>
      <ChartTranslationContext.Provider value={translationMap ? translationMap[lang] : defaultTranslationObject[lang]}>
        {children}
      </ChartTranslationContext.Provider>
    </ChartThemeContext.Provider>
  );
};
