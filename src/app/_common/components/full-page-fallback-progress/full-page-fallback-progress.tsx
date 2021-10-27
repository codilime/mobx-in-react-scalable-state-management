import React from 'react';
import { CircularProgress, Container } from '@mui/material';

export const FullPageFallbackProgress = () => (
  <Container
    sx={{
      minWidth: '100%',
      height: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    }}
  >
    <CircularProgress />
  </Container>
);
