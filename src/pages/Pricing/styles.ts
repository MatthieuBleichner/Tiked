const style = {
  container: {
    paddingLeft: 2,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    width: '100%'
  },
  tableContainer: { display: 'flex', justifyContent: 'center', width: { xs: '70%', md: '50%' } }
} as const;

export default style;
