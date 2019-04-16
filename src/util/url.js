export default id => {
  if (id == null) {
    window.history.pushState(null, '', window.location.origin);
    return;
  }
  window.history.pushState(null, '', `${window.location.origin}/?id=${id}`);
};

export const getIDfromURL = () => {
  return new URL(window.location.href).searchParams.get('id');
};
