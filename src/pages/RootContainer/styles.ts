import { grey } from '@mui/material/colors';

export const styles = {
  root: {
    borderRadius: 5,
    backgroundColor: grey[50],
    paddingTop: 2,
    width: '100%',
    height: '100%'
  },
  headerContainer: {
    display: 'flex',
    direction: 'row',
    padding: 2,
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  loader: {
    width: '100%',
    height: '80%',
    alignItems: 'center',
    justifyContent: 'center',
    display: 'flex'
  }
};
