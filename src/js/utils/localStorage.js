export const verifyData = (nArr, oArr) => {
  if (nArr.length !== oArr.length) {
    return false;
  }

  return oArr.every(
    (e) =>
      nArr.findIndex(
        (v) => v.name === e.name && typeof v?.isDisplayed === 'boolean'
      ) !== -1
  );
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
    const unsearlizedState = JSON.parse(serializedState);
    if (!verifyFunc(unsearlizedState)) {
      return defaultVal;
    }

    return unsearlizedState;
  } catch (err) {
    return defaultVal;
  }
};

export const convertSequenceAndDisplayData = (arr) =>
  arr.map((e) => ({ name: e.name, isDisplayed: e.isDisplayed }));
