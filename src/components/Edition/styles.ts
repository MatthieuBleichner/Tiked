import { grey } from '@mui/material//colors';

export const styles = {
  balanceSheetsContainer: {
    width: '100%',
    height: '100%',
    marginTop: 2,
    flexDirection: { xs: 'column', md: 'row' },
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    paddingLeft: 2
  },
  shortcutContainer: {
    flexDirection: 'column',
    display: 'flex',
    width: { xs: '100%', md: '50%' },
    height: '100%',
    alignItems: 'flex-start'
  },
  shortcuts: {
    flexDirection: 'column',
    display: 'flex',
    width: '100%',
    height: '100%',
    alignItems: 'flex-start',
    paddingLeft: 2,
    marginTop: 1
  },
  sheetsDropboxContainer: {
    width: { xs: '100%', md: '50%' },
    height: '100%',
    flexDirection: 'column',
    paddingLeft: 2,
    marginTop: { xs: 3, md: 0 },
    marginBottom: { xs: 3 }
  },
  sheetsDropbox: {
    display: 'flex',
    justifyContent: 'flex-start',
    width: { xs: '100%', md: '50%' },
    marginTop: 1
  }
};
