import { PaiementMethod } from 'types/types';
import { useTranslation } from 'react-i18next';

export const usePaiementMethodTranslation = () => {
  const { t } = useTranslation();
  const translatePaiementMethod = (paiementMedtod: PaiementMethod): string => {
    switch (paiementMedtod) {
      case PaiementMethod.CASH: {
        return t('paiementMethod.cash');
      }
      case PaiementMethod.CHECK: {
        return t('paiementMethod.check');
      }
      case PaiementMethod.CB: {
        return t('paiementMethod.cb');
      }
    }
  };

  return translatePaiementMethod;
};
