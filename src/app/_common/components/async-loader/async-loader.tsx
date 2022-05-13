import React, { FC, PropsWithChildren } from 'react';
import { observer } from 'mobx-react-lite';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import { AsyncState } from '@/app/_common/stores/async.state';

interface AsyncLoaderProps {
  state: AsyncState;
}

export const AsyncLoader: FC<PropsWithChildren<AsyncLoaderProps>> = observer(
  ({ state, children }) => {
    if (state.isRejected) {
      return <div>Error: {state.errorMessage}</div>;
    } else if (state.isPending) {
      return (
        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
          <CircularProgress />
        </Box>
      );
    } else {
      return <>{children}</>;
    }
  },
);
