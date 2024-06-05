export const getCurrentPage = (): string => {
  const location = window.location;
  const pathArray = location.pathname.split('/');
  const validPages = ['overview', 'search', 'beacon', 'provenance'];
  if (pathArray.length > 2 && validPages.includes(pathArray[2])) {
    return pathArray[2];
  } else {
    return 'overview';
  }
};
