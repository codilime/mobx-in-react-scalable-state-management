import React from 'react';
import { useInstance } from 'react-ioc';
import { observer } from 'mobx-react-lite';
import { createTheme, CssBaseline, ThemeProvider as MuiThemeProvider } from '@mui/material';
import darkScrollbar from '@mui/material/darkScrollbar';
import { ThemeDataStore } from '../../stores/theme.data-store';

export const ThemeProvider: React.FC = observer(({ children }) => {
  const themeStore = useInstance(ThemeDataStore);
  return (
    <MuiThemeProvider theme={themeStore.theme === 'dark' ? darkTheme : lightTheme}>
      <CssBaseline />
      {children}
    </MuiThemeProvider>
  );
});

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
});

const lightTheme = createTheme({
  palette: {
    mode: 'light',
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: darkScrollbar(),
      },
    },
  },
});
