import { createGlobalStyle } from 'styled-components';

export const palette = {
  primary: '#003D2B',
};

export const theme: any = {
  colors: {
    map: {
      primary: '#003D2B',
    },
    primary: '#003D2B',
    secondary: '#ADE6B9',
    tertiary: '#7A7E9F',
    background: '#F8FAFC',
    transparent: 'transparent',
    danger: '#FE5B78',
    success: '#4FB922',
    login: '#FFFFFFA3',
    hover: {
      primary: '#003D2B',
      secondary: '#ADE6B9',
      tertiary: '#7A7E9F',
      danger: '#FE5B78E6',
      success: '#4FB922B3',
      login: '#FFFFFFA3',
      transparent: 'transparent',
    },
    text: {
      primary: '#231f20',
      secondary: '#121926',
      tertiary: '#4B5565',
      labels: '#121926',
      accent: '#102EB1',
      error: '#FE5B78',
      input: '#231f20',
      active: '#2463EB',
    },
    tertiaryMedium: '#C6C8D6',
    tertiaryLight: '#F3F3F7',
    input: '#F3F3F7',
    border: '#121A553D',
    label: '#0B1F51',
    error: '#FE5B78',
    light: '#f3f3f7',
    white: '#ffffff',
    grey: '#B3B5C4',
    fields: {
      borderFocus: palette.primary,
    },
  },
  height: {
    fields: 4,
    buttons: 4,
  },
  radius: {
    multiSelectFieldTag: 0.2,
    fields: 0.4,
  },
};

export const GlobalStyle = createGlobalStyle`
 *{
    box-sizing: border-box;
    font-family: "Inter", sans-serif;
 
  }
  html { 
    font-size: 62.5%; 
    width: 100vw;
  }
  body {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    background-color: ${theme.colors.background};
    font-size: 1.6rem;
    overflow:hidden;
    min-height:100vh;
  } 
  h1 {
    font-size: 3.2rem;
    color: "#121A55";
  }
  a {
    text-decoration: none;
    :hover{
      color: inherit;
    }
  }
  button {
    outline: none;
    text-decoration: none;
    display: block;
    border: none;
    background-color: transparent;
  }
  textarea {
    font-size: 1.6rem;
  }


`;

export const device = {
  mobileS: `(max-width: 320px)`,
  mobileM: `(max-width: 425px)`,
  mobileL: `(max-width: 788px)`,
  mobileXL: `(max-width: 1025px)`,
  tablet: `(max-width: 1400px)`,
};
