import { FC } from 'react';
import { Dialog } from '@mui/material';
import { observer } from 'mobx-react-lite';
import { ModalState } from '@/app/_common/stores/modal.state';

export const Modal: FC<{ state: ModalState<unknown> }> = observer(
  ({ state, children }) => {
    return (
      <Dialog open={state.opened} onClose={state.close}>
        {children}
      </Dialog>
    );
  },
);
