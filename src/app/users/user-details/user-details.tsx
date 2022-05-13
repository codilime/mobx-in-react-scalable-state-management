import { Fragment, useCallback } from 'react';
import { observer } from 'mobx-react-lite';
import { provider, useInstance } from 'react-ioc';
import { PageLayout } from '@/app/_common/components/page-layout/page-layout';
import {
  toUsersPath,
  UsersPath,
} from '@/app/users/_common/navigation/users.paths';
import { UserDetailsViewStore } from '@/app/users/user-details/user-details.view-store';
import { UserFormModalViewStore } from '@/app/users/_components/user-form-modal/user-form-modal.view-store';
import Button from '@mui/material/Button';
import { AsyncLoader } from '@/app/_common/components/async-loader/async-loader';
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

export const UserDetails = provider(
  UserDetailsDataStore,
  UserDetailsViewStore,
)(
  observer(() => {
    const store = useInstance(UserDetailsViewStore);
    const { modalState } = useInstance(UserFormModalViewStore);

    const editUser = useCallback(
      () => modalState.open({ mode: 'edit', userId: store.userId }),
      [modalState, store],
    );

    return (
      <PageLayout
        title={
          <>
            {store.user?.firstName} {store.user?.lastName}
          </>
        }
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, padding: 1 }}>
          <Button onClick={editUser} variant="contained">
            Edit
          </Button>
          <Box sx={{ flex: 1 }} />
          <FormControlLabel
            checked={store.auditTrailVisible}
            onChange={store.toggleAuditTrailVisible}
            control={<Switch />}
            label="Audit Trail"
          />
          <Link
            href={toUsersPath({ path: UsersPath.DETAILS, params: { id: '2' } })}
          >
            Go to user with ID 2
          </Link>
        </Box>

        <AsyncLoader state={store.asyncReadUsers}>
          {store.user && (
            <Card sx={{ maxWidth: 500, margin: '0 auto' }}>
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
                  <AsyncLoader state={store.asyncReadDetails}>
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
                  </AsyncLoader>
                )}
              </List>
            </Card>
          )}
        </AsyncLoader>
      </PageLayout>
    );
  }),
);
