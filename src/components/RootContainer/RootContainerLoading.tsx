import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { styles } from './styles';

import CircularProgress from '@mui/material/CircularProgress';

interface RootContainerProps {
  title: string;
}
const RootContainerLoading: React.FC<RootContainerProps> = ({ title }) => {
  return (
    <Box sx={styles.root}>
      <Box sx={styles.headerContainer}>
        <Typography variant="h4" noWrap component="div">
          {title}
        </Typography>
      </Box>
      <Box style={styles.loader}>
        <CircularProgress />
      </Box>
    </Box>
  );
};

export default RootContainerLoading;
