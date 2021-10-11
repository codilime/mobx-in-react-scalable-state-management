import React, { useCallback } from 'react';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import AppBar from '@mui/material/AppBar';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import { observer } from 'mobx-react-lite';
import { provider, useInstance } from 'react-ioc';
import { Dashboard, Person } from '@mui/icons-material';
import { PageLayoutViewStore } from './page-layout.view-store';
import { useHistory } from 'react-router-dom';
import { DashboardPath, toDashboardPath } from '@/app/dashboard/_common/navigation/dashboard.paths';
import { toUsersPath, UsersPath } from '@/app/users/_common/navigation/users.paths';

interface PageLayoutProps {
  title: React.ReactNode;
}

export const PageLayout: React.FC<PageLayoutProps> = provider(
  PageLayoutViewStore,
  //
)(
  observer(({ title, children }) => {
    const store = useInstance(PageLayoutViewStore);
    const history = useHistory();

    const goToDashboard = useCallback(() => history.push(toDashboardPath({ path: DashboardPath.MAIN })), [history]);
    const goToUsers = useCallback(() => history.push(toUsersPath({ path: UsersPath.MAIN })), [history]);

    return (
      <div>
        <Box sx={{ flexGrow: 1 }}>
          <AppBar position="static">
            <Toolbar>
              <IconButton
                size="large"
                edge="start"
                color="inherit"
                aria-label="menu"
                sx={{ mr: 2 }}
                onClick={store.openDrawer}
              >
                <MenuIcon />
              </IconButton>
              <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                {title}
              </Typography>
              <IconButton sx={{ ml: 1 }} onClick={store.toggleTheme} color="inherit">
                {store.theme === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
              </IconButton>
            </Toolbar>
          </AppBar>
          {children}
        </Box>
        <Drawer anchor="left" open={store.drawerOpened} onClose={store.closeDrawer}>
          <Box sx={{ width: 250 }} role="presentation" onClick={store.closeDrawer}>
            <List>
              <ListItem button key="Dashboard">
                <ListItemIcon>
                  <Dashboard />
                </ListItemIcon>
                <ListItemText primary="Dashboard" onClick={goToDashboard} />
              </ListItem>
              <ListItem button key="Users">
                <ListItemIcon>
                  <Person />
                </ListItemIcon>
                <ListItemText primary="Users" onClick={goToUsers} />
              </ListItem>
            </List>
          </Box>
        </Drawer>
      </div>
    );
  }),
);
