import React from 'react';
import { useInstance } from 'react-ioc';
import { observer } from 'mobx-react-lite';
import { createTheme, CssBaseline, ThemeProvider } from '@mui/material';
import darkScrollbar from '@mui/material/darkScrollbar';
import { ThemeDataStore } from '@/app/_common/stores/theme.data-store';

export const Theme: React.FC = observer(({ children }) => {
  const themeStore = useInstance(ThemeDataStore);
  return (
    <ThemeProvider theme={themeStore.theme === 'dark' ? darkTheme : lightTheme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  );
});

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: darkScrollbar(),
      },
    },
  },
});

const lightTheme = createTheme({
  palette: {
    mode: 'light',
  },
});
