import React, { useState } from 'react';
import Box from '@mui/material/Box';
import { useQueryClient } from '@tanstack/react-query';
import { IBalanceSheet } from 'types/types';
import useSelectedData from 'contexts/market/useSelectedData';
import { BalanceSheetModal } from 'components/Modals/BalanceSheetModal/BalanceSheetModal';
import BalanceSheetCreationModal from 'components/Modals/BalanceSheetCreationModal';
import { useBalanceSheetsDetailsQuery } from 'api/balanceSheets/hooks';
import RootContainer from '../RootContainer/RootContainer';
import { useTranslation } from 'react-i18next';

import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';

import { BalanceSheetShortcut } from 'components';

const BalanceSheets: React.FC = () => {
  const queryClient = useQueryClient();
  const { currentMarket } = useSelectedData();
  const { t } = useTranslation();

  const { data: sheets = [] } = useBalanceSheetsDetailsQuery(currentMarket, [
    'sheets',
    currentMarket?.id || ''
  ]);

  const [selectedSheet, setSelectedSheet] = React.useState<IBalanceSheet | undefined | null>();
  const handleClose = () => setSelectedSheet(null);

  const [openCrationMode, setCreationModeIsOpened] = useState(false);

  if (!currentMarket) {
    return null;
  }

  return (
    <RootContainer
      title={t('page.bilan.title')}
      buttonText={t('page.bilan.newBilan')}
      onClickButton={() => setCreationModeIsOpened(true)}>
      <Box>
        {sheets.length ? (
          <React.Fragment>
            <Box
              sx={{
                flexDirection: 'row',
                display: 'flex',
                width: '100%',
                alignItems: 'center',
                justifyContent: 'space-around'
              }}>
              {sheets.length > 0 && (
                <BalanceSheetShortcut
                  sheet={sheets[0]}
                  onClick={sheet => setSelectedSheet(sheet)}
                />
              )}
              {sheets.length > 1 && (
                <BalanceSheetShortcut
                  sheet={sheets[1]}
                  onClick={sheet => setSelectedSheet(sheet)}
                />
              )}
              {sheets.length > 2 && (
                <Box sx={{ display: 'flex', justifyContent: 'center', width: '50%' }}>
                  <Autocomplete
                    id="balancehseetautocomplete"
                    sx={{ width: '100%' }}
                    options={sheets}
                    autoHighlight
                    getOptionLabel={option =>
                      option.date.toLocaleString('fr-FR', {
                        weekday: 'long',
                        month: 'long',
                        year: 'numeric',
                        day: 'numeric'
                      })
                    }
                    renderOption={(props, option) => {
                      const { ...optionProps } = props;
                      return (
                        <Box
                          component="li"
                          sx={{ '& > img': { mr: 2, flexShrink: 0 } }}
                          {...optionProps}
                          key={option.id}>
                          {option.date.toLocaleString('fr-FR', {
                            weekday: 'long',
                            month: 'long',
                            year: 'numeric',
                            day: 'numeric'
                          })}
                        </Box>
                      );
                    }}
                    onChange={(e, value) => setSelectedSheet(value)}
                    renderInput={params => (
                      <TextField
                        {...params}
                        label={t('page.bilan.openOtherBalancesheet')}
                        slotProps={{
                          htmlInput: {
                            ...params.inputProps,
                            autoComplete: 'new-password' // disable autocomplete and autofill
                          }
                        }}
                      />
                    )}
                  />
                </Box>
              )}
            </Box>
          </React.Fragment>
        ) : (
          <React.Fragment>{'Pas de bilan pour ce marché'}</React.Fragment>
        )}
      </Box>
      {selectedSheet && (
        <BalanceSheetModal
          open={!!selectedSheet}
          handleClose={handleClose}
          balanceSheet={selectedSheet}
        />
      )}
      <BalanceSheetCreationModal
        open={openCrationMode}
        onClose={() => setCreationModeIsOpened(false)}
        onAddSheeet={data => {
          queryClient.setQueryData(['sheets', currentMarket?.id], [...sheets, ...data]);
        }}
      />
    </RootContainer>
  );
};

export default BalanceSheets;
