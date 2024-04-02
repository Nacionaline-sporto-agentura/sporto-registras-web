import { createGlobalStyle } from 'styled-components';
export interface Theme {
  colors: {
    primary: string;
    secondary: string;
    tertiary: string;
    transparent: string;
    danger: string;
    success: string;
    login: string;
    hover: {
      primary: string;
      secondary: string;
      tertiary: string;
      danger: string;
      success: string;
      transparent: string;
      [key: string]: string;
    };
    text: {
      primary: string;
      secondary: string;
      tertiary: string;
      labels: string;
      accent: string;
      active: string;
      error: string;
      [key: string]: string;
    };
    tertiaryMedium: string;
    tertiaryLight: string;
    input: string;
    border: string;
    label: string;
    error: string;
    light: string;
    white: string;
    grey: string;
    [key: string]: any;
  };
}

export const theme: Theme = {
  colors: {
    primary: '#003D2B',
    secondary: '#ADE6B9',
    tertiary: '#7A7E9F',
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
    background-color: #f8fafc;
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
