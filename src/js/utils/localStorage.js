export const verifyData = (nArr, oArr) => {
  if (nArr.length !== oArr.length) {
    return false;
  }
  const nArrMap = {};
  for (const { name, isDisplayed } of nArr) {
    if (name && typeof isDisplayed === 'boolean') nArrMap[name] = true;
    else return false;
  }
  return oArr.every((e) => nArrMap[e.name]);
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

export const convertSequenceAndDisplayData = (arr) =>
  arr.map((e) => ({ name: e.name, isDisplayed: e.isDisplayed }));
