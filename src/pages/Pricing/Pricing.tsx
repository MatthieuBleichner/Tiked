import React from 'react';
import Box from '@mui/material/Box';
import { useQuery } from '@tanstack/react-query';
import { IMarket, IPricing } from 'types/types';
import useSelectedData from 'contexts/market/useSelectedData';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import { grey } from '@mui/material/colors';
import { formatResponse } from 'api/utils';
import { config } from 'config';

/**
 * Fetch clients from the API
 * @param currentCity - The current city
 * @returns The clients
 */
const fetchPricings: (arg0: IMarket | undefined) => Promise<Response> = async currentMarket => {
  return fetch(`${config.API_URL}pricings?marketId=${currentMarket?.id}`);
};

const Pricing: React.FC = () => {
  const { currentMarket } = useSelectedData();
  //const [clients, setClients] = useState<IClient[]>([]);

  const { data: pricings = [] } = useQuery<IPricing[]>({
    queryKey: ['pricing', currentMarket?.id],
    queryFn: () =>
      fetchPricings(currentMarket)
        .then(res => res.json())
        .then(res => {
          return formatResponse(res) as IPricing[];
        }),
    enabled: !!currentMarket?.id
  });

  if (!currentMarket) {
    return null;
  }
  return (
    <Box
      sx={{
        flex: 1,
        borderRadius: 5,
        //marginTop: 2,
        height: '80%',
        backgroundColor: grey[50],
        padding: 2
        //paddingLeft: 5
      }}>
      <Box sx={{ display: 'flex', direction: 'row', padding: 2 }}>
        <Box sx={{ display: 'flex', direction: 'row', flex: 1, justifyContent: 'flex-start' }}>
          <Typography
            variant="h4"
            noWrap
            component="div"
            sx={{ color: '#263dad', fontWeight: 600 }}>
            Tarifs
          </Typography>
        </Box>
      </Box>
      <Box
        sx={{
          flex: 1,
          borderRadius: 5,
          //marginTop: 2,
          height: '80%',
          padding: 2
          //paddingLeft: 5
        }}>
        <TableContainer component={Paper}>
          <Table aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>Nom</TableCell>
                <TableCell align="right">Tarif</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {pricings?.map(pricing => (
                <TableRow
                  key={pricing.id}
                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                  <TableCell component="th" scope="client">
                    {pricing.name}
                  </TableCell>
                  <TableCell align="right">{pricing.price} €</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </Box>
  );
};

export default Pricing;
