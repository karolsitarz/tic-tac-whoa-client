const theme = {};

theme.light = {
  base: '#fff',
  main: '#777',
  secondaryButton: '#fff',
  lightShadow: '#00000011',
  hardShadow: '#0003',
  buttonText: '#aaa',
  primaryButtonText: '#fff',
  input: '#f7f7f7',
  inputPlate: '#ebebeb',
  gradient: '#fc8ca1, #dc64b9, #8c5dc7, #5b80cc',
  redGradient: '#ff76ad, #ffb58c',
  blueGradient: '#48afcc, #6a62cc',
  red: '#ff969c',
  blue: '#5988cc',
  icon: '#ccc',
  icon2: '#888'
};

theme.dark = {
  ...theme.light,
  base: '#222',
  main: '#ccc',
  secondaryButton: '#252525',
  hardShadow: '#0006',
  lightShadow: '#00000022',
  buttonText: '#777',
  primaryButtonText: '#ddd',
  input: '#2b2b2b',
  inputPlate: '#383838',
  gradient: '#f2637e, #c748a1, #7349a7, #4669af',
  redGradient: '#ed5e97, #e99263',
  blueGradient: '#3d8da4, #736cc1',
  red: '#d98c90',
  blue: '#50719f',
  icon: '#888',
  icon2: '#383838'
};

export default theme;
