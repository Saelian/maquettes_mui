import * as React from 'react';
import * as ReactDOM from 'react-dom/client';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import App from './App.tsx';

const theme = createTheme({
  palette: {
    primary: {
      main: '#008577',
    },
  },
  typography: {
    fontFamily: 'Montserrat, Roboto, Arial, sans-serif',
  },
});

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <App />
    </ThemeProvider>
  </React.StrictMode>,
);
