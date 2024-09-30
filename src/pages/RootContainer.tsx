import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { grey } from '@mui/material/colors';

interface RootContainerProps {
  title: string;
  children: React.ReactNode;
}
const RootContainer: React.FC<RootContainerProps> = ({ title, children }) => {
  return (
    <Box
      sx={{
        flex: 1,
        borderRadius: 5,
        //marginTop: 2,
        height: '80%',
        backgroundColor: grey[50],
        padding: 2
        //paddingLeft: 5
      }}>
      <Box
        sx={{
          display: 'flex',
          direction: 'row',
          padding: 2,
          flex: 1,
          justifyContent: 'flex-start'
        }}>
        <Typography variant="h4" noWrap component="div">
          {title}
        </Typography>
      </Box>
      {children}
    </Box>
  );
};

export default RootContainer;
