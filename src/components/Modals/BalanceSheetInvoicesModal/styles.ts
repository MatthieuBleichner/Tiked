import { grey } from '@mui/material//colors';

export const styles = {
  header: {
    flexDirection: 'row',
    backgroundColor: grey[100],
    padding: 2,
    alignItems: 'center',
    justifyContent: 'center'
  },
  textFieldContainer: { flexDirection: 'row', width: '100%', paddingTop: 1 },
  buttonsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    width: '100%',
    display: 'flex'
  }
};
