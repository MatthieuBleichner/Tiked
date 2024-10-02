import { grey } from '@mui/material/colors';

const styles = {
  container: {
    bgcolor: grey[50],
    paddingLeft: 2,
    display: 'flex',
    justifyContent: { xs: 'center', md: 'flex-start' },
    alignItems: { xs: 'flex-start', md: 'center' },
    borderRadius: 5,
    zIndex: 10,
    height: '100%',
    flexDirection: { xs: 'column', md: 'row' }
  }
} as const;

export default styles;
