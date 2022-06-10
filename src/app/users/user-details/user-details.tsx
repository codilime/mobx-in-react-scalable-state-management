import React, { Fragment, useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import { provider, useInstance } from 'react-ioc';
import { PageLayout } from '@/app/_common/components/page-layout/page-layout';
import {
  toUsersPath,
  UsersPath,
} from '@/app/users/_common/navigation/users.paths';
import { UserDetailsViewStore } from '@/app/users/user-details/user-details.view-store';
import { UserDetailsDataStore } from '@/app/users/_common/stores/user-details.data-store';
import Card from '@mui/material/Card/Card';
import Link from '@mui/material/Link';
import Box from '@mui/material/Box/Box';
import Avatar from '@mui/material/Avatar/Avatar';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Divider from '@mui/material/Divider';
import Switch from '@mui/material/Switch';
import FormControlLabel from '@mui/material/FormControlLabel/FormControlLabel';
import CircularProgress from '@mui/material/CircularProgress';
import Button from '@mui/material/Button';

const pathJohn = toUsersPath({
  path: UsersPath.DETAILS,
  params: { id: '1' },
});

const pathMary = toUsersPath({
  path: UsersPath.DETAILS,
  params: { id: '2' },
});

export const UserDetails = provider(
  UserDetailsDataStore,
  UserDetailsViewStore,
)(
  observer(() => {
    const store = useInstance(UserDetailsViewStore);

    return (
      <PageLayout
        title={
          <>
            {store.user?.firstName} {store.user?.lastName}
          </>
        }
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, padding: 1 }}>
          <Button variant="contained" onClick={store.refresh}>
            Refresh
          </Button>
          <FormControlLabel
            checked={store.auditTrailVisible}
            onChange={store.toggleAuditTrailVisible}
            control={<Switch />}
            label="Audit Trail"
          />
          <Link href={pathJohn}>John</Link>
          <Link href={pathMary}>Mary</Link>
        </Box>

        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
          {store.usersLoading ? (
            <CircularProgress />
          ) : store.usersError ? (
            store.usersError
          ) : (
            store.user && (
              <Card sx={{ width: 600 }}>
                <List
                  sx={{
                    width: '100%',
                  }}
                >
                  <ListItem>
                    <ListItemAvatar>
                      <Avatar />
                    </ListItemAvatar>
                    <ListItemText
                      primary={store.user.firstName}
                      secondary={store.user.email}
                    />
                  </ListItem>
                  {store.auditTrailVisible && (
                    <>
                      {store.detailsLoading && <CircularProgress />}
                      {store.detailsError && store.detailsError}
                      {store.auditTrail.map((item) => (
                        <Fragment key={item.id}>
                          <Divider component="li" />
                          <ListItem>
                            <ListItemText
                              primary={item.name}
                              secondary={item.details}
                            />
                            <ListItemText
                              secondary={item.createdAt}
                              sx={{ textAlign: 'right' }}
                            />
                          </ListItem>
                        </Fragment>
                      ))}
                    </>
                  )}
                </List>
              </Card>
            )
          )}
        </Box>
      </PageLayout>
    );
  }),
);
