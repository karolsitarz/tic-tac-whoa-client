import { createGlobalStyle } from 'styled-components';

export default createGlobalStyle`
  /* latin-ext */
  @font-face {
    font-family: 'Work Sans';
    font-style: normal;
    font-weight: 400;
    src: local('Work Sans'), local('WorkSans-Regular'), url(https://fonts.gstatic.com/s/worksans/v4/QGYsz_wNahGAdqQ43Rh_cqDpp_k.woff2) format('woff2');
    unicode-range: U+0100-024F, U+0259, U+1E00-1EFF, U+2020, U+20A0-20AB, U+20AD-20CF, U+2113, U+2C60-2C7F, U+A720-A7FF;
  }
  /* latin */
  @font-face {
    font-family: 'Work Sans';
    font-style: normal;
    font-weight: 400;
    src: local('Work Sans'), local('WorkSans-Regular'), url(https://fonts.gstatic.com/s/worksans/v4/QGYsz_wNahGAdqQ43Rh_fKDp.woff2) format('woff2');
    unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
  }
  /* latin-ext */
  @font-face {
    font-family: 'Work Sans';
    font-style: bold;
    font-weight: 700;
    src: local('Work Sans Bold'), local('WorkSans-Bold'), url(https://fonts.gstatic.com/s/worksans/v4/QGYpz_wNahGAdqQ43Rh3x4X8lthN2fk.woff2) format('woff2');
    unicode-range: U+0100-024F, U+0259, U+1E00-1EFF, U+2020, U+20A0-20AB, U+20AD-20CF, U+2113, U+2C60-2C7F, U+A720-A7FF;
  }
  /* latin */
  @font-face {
    font-family: 'Work Sans';
    font-style: bold;
    font-weight: 700;
    src: local('Work Sans Bold'), local('WorkSans-Bold'), url(https://fonts.gstatic.com/s/worksans/v4/QGYpz_wNahGAdqQ43Rh3x4X8mNhN.woff2) format('woff2');
    unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
  }
  
  *,:after,:before,input {
    box-sizing: border-box;
    position: relative;
    font-family: 'Work Sans', Helvetica, sans-serif;
    -webkit-tap-highlight-color: rgba(0,0,0,0);
    -webkit-tap-highlight-color: transparent;
    color: #666;
    pointer-events: none;
  }
  *:not(input) {
    -webkit-touch-callout: none;
    -webkit-user-select: none;
    -khtml-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
  }
  html {
    font-size: 1.25em;
  }
  html, body {
    padding: 0;
    margin: 0;
    width: 100%;
    height: 100%;
    overscroll-behavior: contain;
    background: #fff
  }
  h1, h2, h3, h4, h5, h6 {
    margin: 0;
    padding: 0;
  }
  p, th, td, li, dd, dt, ul, ol, blockquote, q, acronym, abbr, a, input, select, textarea {
    margin: 0;
    padding: 0;
  }
  :focus {
    outline: none;
  }
  #container {
    width: 100%;
    height: 100%;
    margin: auto;
  }
`;
