import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { grey } from '@mui/material/colors';
import Button from '@mui/material/Button';

interface RootContainerProps {
  title: string;
  children: React.ReactNode;
  buttonText?: string;
  onClickButton?: () => void;
}
const RootContainer: React.FC<RootContainerProps> = ({
  title,
  buttonText,
  onClickButton,
  children
}) => {
  return (
    <Box
      sx={{
        borderRadius: 5,
        backgroundColor: grey[50],
        paddingTop: 2,
        width: '100%'
      }}>
      <Box
        sx={{
          display: 'flex',
          direction: 'row',
          padding: 2,
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
        <Typography variant="h4" noWrap component="div">
          {title}
        </Typography>

        {buttonText && (
          <Button variant="contained" onClick={onClickButton}>
            {buttonText}
          </Button>
        )}
      </Box>
      {children}
    </Box>
  );
};

export default RootContainer;
