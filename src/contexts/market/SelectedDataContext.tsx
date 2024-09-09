import { IMarket, ICity } from 'types/types';
import { createContext } from 'react';

export type SelectedDataContextValue = {
  currentMarket: IMarket | undefined;
  setCurrentMarket: (arg0: IMarket) => void;
  currentCity: ICity | undefined;
  setCurrentCity: (arg0: ICity) => void;
};

const SelectedDataContext = createContext<SelectedDataContextValue>({
  currentMarket: undefined,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  setCurrentMarket: (market: IMarket) => {},
  currentCity: undefined,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  setCurrentCity: (city: ICity) => {}
});

export default SelectedDataContext;
