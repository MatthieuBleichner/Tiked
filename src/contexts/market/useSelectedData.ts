import { useContext } from 'react';
import SelectedDataContext, { SelectedDataContextValue } from './SelectedDataContext';

const useSelectedData = () => useContext<SelectedDataContextValue>(SelectedDataContext);

export default useSelectedData;
