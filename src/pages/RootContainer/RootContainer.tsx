import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { styles } from './styles';
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
    <Box sx={styles.root}>
      <Box sx={styles.headerContainer}>
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
