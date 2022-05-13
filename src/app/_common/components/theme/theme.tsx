import React from 'react';
import { useInstance } from 'react-ioc';
import { observer } from 'mobx-react-lite';
import { createTheme, CssBaseline, ThemeProvider } from '@mui/material';
import darkScrollbar from '@mui/material/darkScrollbar';
import { ThemeDataStore } from '@/app/_common/stores/theme.data-store';
import {
  Link as RouterLink,
  LinkProps as RouterLinkProps,
} from 'react-router-dom';
import { LinkProps } from '@mui/material/Link';

export const Theme: React.FC = observer(({ children }) => {
  const themeStore = useInstance(ThemeDataStore);
  return (
    <ThemeProvider theme={themeStore.theme === 'dark' ? darkTheme : lightTheme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  );
});

const LinkBehavior = React.forwardRef<
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  any,
  Omit<RouterLinkProps, 'to'> & { href: RouterLinkProps['to'] }
>((props, ref) => {
  const { href, ...other } = props;
  // Map href (MUI) -> to (react-router)
  return (
    <RouterLink data-testid="custom-link" ref={ref} to={href} {...other} />
  );
});

const common = {
  MuiLink: {
    defaultProps: {
      component: LinkBehavior,
    } as LinkProps,
  },
  MuiButtonBase: {
    defaultProps: {
      LinkComponent: LinkBehavior,
    },
  },
};

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
    ...common,
  },
});

const lightTheme = createTheme({
  palette: {
    mode: 'light',
  },
  components: {
    ...common,
  },
});
