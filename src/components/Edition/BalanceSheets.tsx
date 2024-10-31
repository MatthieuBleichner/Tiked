import React, { useState, useMemo, Suspense } from 'react';
import Box from '@mui/material/Box';
import { useQueryClient, useSuspenseQuery } from '@tanstack/react-query';
import { IBalanceSheet, IMarket } from 'types/types';
import useSelectedData from 'contexts/market/useSelectedData';
import { BalanceSheetModal } from 'components/Modals/BalanceSheetModal/BalanceSheetModal';
import BalanceSheetCreationModal from 'components/Modals/BalanceSheetCreationModal';
import { getBalanceSheetQuery } from 'api/balanceSheets/helpers';
import RootContainer from '../RootContainer/RootContainer';
import RootContainerLoading from '../RootContainer/RootContainerLoading';
import { useTranslation } from 'react-i18next';

import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';

import { ErrorBoundary } from 'react-error-boundary';

import { BalanceSheetShortcut } from 'components';
import { styles } from './styles';

const NB_DISPLAYED_SHORTCUTS = 3;

interface BalanceSheetsSuspenseProps {
  currentMarket: IMarket;
}
const BalanceSheetsSuspense: React.FC<BalanceSheetsSuspenseProps> = ({ currentMarket }) => {
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  const query = getBalanceSheetQuery(currentMarket);
  const { data: sheets = [] } = useSuspenseQuery<IBalanceSheet[]>({
    ...query
  });

  const [selectedSheet, setSelectedSheet] = React.useState<IBalanceSheet | undefined | null>();
  const handleClose = () => setSelectedSheet(null);

  const [openCrationMode, setCreationModeIsOpened] = useState(false);

  const shortCutTranslations = useMemo(() => {
    if (sheets.length === 1) {
      return t('page.balancesheet.SingleShortcut');
    } else if (sheets.length === 2) {
      return t('page.balancesheet.TwoShortcuts');
    } else if (sheets.length >= 3) {
      return t('page.balancesheet.ThreeShortcuts');
    } else {
      return '';
    }
  }, [sheets]);

  if (!currentMarket) {
    return null;
  }

  return (
    <RootContainer
      title={t('page.balancesheet.title')}
      buttonText={t('page.balancesheet.newBilan')}
      onClickButton={() => setCreationModeIsOpened(true)}>
      <Box sx={{ width: '100%', height: '70%' }}>
        {sheets.length ? (
          <Box sx={styles.balanceSheetsContainer}>
            <Box sx={styles.shortcutContainer}>
              <Box>{shortCutTranslations}</Box>
              <Box sx={styles.shortcuts}>
                {sheets.slice(0, NB_DISPLAYED_SHORTCUTS).map(sheet => (
                  <BalanceSheetShortcut
                    key={sheet.id}
                    sheet={sheet}
                    onClick={() => setSelectedSheet(sheet)}
                  />
                ))}
              </Box>
            </Box>
            {sheets.length > 2 && (
              <Box sx={styles.sheetsDropboxContainer}>
                {t('page.balancesheet.OtherSheets')}
                <Box sx={styles.sheetsDropbox}>
                  <Autocomplete
                    id="balancehseetautocomplete"
                    sx={{ width: { xs: '60%', md: '100%' } }}
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
                        label={t('page.balancesheet.openOtherBalancesheet')}
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
              </Box>
            )}
          </Box>
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
          queryClient.setQueryData(query.queryKey, [...sheets, ...data]);
        }}
      />
    </RootContainer>
  );
};

const BalanceSheets: React.FC = () => {
  const { currentMarket } = useSelectedData();
  const { t } = useTranslation();

  return (
    <React.Fragment>
      <Suspense fallback={<RootContainerLoading title={t('page.balancesheet.title')} />}>
        <ErrorBoundary fallback={<div>Something went wrong!</div>}>
          {currentMarket && <BalanceSheetsSuspense currentMarket={currentMarket} />}
        </ErrorBoundary>
      </Suspense>
    </React.Fragment>
  );
};

export default BalanceSheets;
