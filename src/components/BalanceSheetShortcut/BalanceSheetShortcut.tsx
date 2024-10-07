import React from 'react';
import Button from '@mui/material/Button';
import InsertDriveFile from '@mui/icons-material/InsertDriveFile';
import { IBalanceSheet } from 'types/types';

interface BalanceSheetShortcutProps {
  sheet: IBalanceSheet;
  onClick: () => void;
}
const BalanceSheetShortcut: React.FC<BalanceSheetShortcutProps> = ({ sheet, onClick }) => {
  return (
    <Button component="label" startIcon={<InsertDriveFile />} onClick={onClick}>
      {sheet.date.toLocaleString('fr-FR', {
        weekday: 'long',
        month: 'long',
        year: 'numeric',
        day: 'numeric'
      })}
    </Button>
  );
};

export default BalanceSheetShortcut;
