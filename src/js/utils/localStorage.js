export const verifyData = (nObj, oObj) => {
  const verifyCharts = (nCharts, oCharts) => {
    if (nCharts.length !== oCharts.length) return false;

    const nChartsMap = {};
    for (const { id, isDisplayed } of nCharts) {
      if (id && typeof isDisplayed === 'boolean') nChartsMap[id] = true;
      else return false;
    }
    return oCharts.every((e) => nChartsMap[e.id]);
  };

  if (Object.keys(oObj).length !== Object.keys(nObj).length) return false;
  return Object.entries(oObj).every(([key, charts]) => verifyCharts(nObj[key], charts));
};

export const saveValue = (key, value) => {
  try {
    const serialized = JSON.stringify(value);
    localStorage.setItem(key, serialized);
  } catch {
    //ignore
  }
};

export const getValue = (key, defaultVal, verifyFunc) => {
  try {
    const serializedState = localStorage.getItem(key);
    if (serializedState === null) {
      return defaultVal;
    }
    const unserializedState = JSON.parse(serializedState);
    if (!verifyFunc(unserializedState)) {
      return defaultVal;
    }

    return unserializedState;
  } catch (err) {
    return defaultVal;
  }
};

export const convertSequenceAndDisplayData = (sections) => {
  const temp = {};
  sections.forEach(({ sectionTitle, charts }) => {
    temp[sectionTitle] = charts.map(({ id, isDisplayed }) => ({ id, isDisplayed }));
  });
  return temp;
};
