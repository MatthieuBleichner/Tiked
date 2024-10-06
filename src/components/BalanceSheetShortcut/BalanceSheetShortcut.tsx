import React from 'react';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import InsertDriveFile from '@mui/icons-material/InsertDriveFile';
import Typography from '@mui/material/Typography';
import { IBalanceSheet } from 'types/types';

interface BalanceSheetShortcutProps {
  sheet: IBalanceSheet;
  onClick: (sheet: IBalanceSheet) => void;
}
const BalanceSheetShortcut: React.FC<BalanceSheetShortcutProps> = ({ sheet, onClick }) => {
  return (
    <Box sx={{ width: 120, height: 120 }}>
      <IconButton
        aria-label="open1"
        sx={{ width: '100%', height: '100%', flexDirection: 'column' }}
        onClick={() => {
          onClick(sheet);
        }}>
        <InsertDriveFile sx={{ width: '80%', height: '80%', color: 'primary.main' }} />
        <Typography color={'primary.main'}>
          {sheet.date.toLocaleString('fr-FR', {
            month: 'numeric',
            day: 'numeric'
          })}
        </Typography>
      </IconButton>
    </Box>
  );
};

export default BalanceSheetShortcut;
