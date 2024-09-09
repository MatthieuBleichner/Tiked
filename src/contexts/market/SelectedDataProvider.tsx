import React, { useState } from 'react';
import SelectedDataContext from './SelectedDataContext';
import { IMarket, ICity } from '../../types/types';

interface MarketProviderProps {
  children: JSX.Element | null;
}

const MarketProvider = ({ children }: MarketProviderProps) => {
  const [currentMarket, setCurrentMarket] = useState<IMarket>();
  const [currentCity, setCurrentCity] = useState<ICity>();

  return (
    <SelectedDataContext.Provider
      value={{ setCurrentMarket, currentMarket, currentCity, setCurrentCity }}>
      {children}
    </SelectedDataContext.Provider>
  );
};

export default MarketProvider;
