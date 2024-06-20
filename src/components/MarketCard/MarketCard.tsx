import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { IMarket } from 'types/types';
import { grey } from '@mui/material/colors';
import StorefrontIcon from '@mui/icons-material/Storefront';

import ButtonBase from '@mui/material/ButtonBase';

interface MarketCardProps {
  market: IMarket;
  onClick: (element: React.MouseEvent<HTMLElement>) => void;
  isFocused: boolean;
}

function MarketCard(props: MarketCardProps): JSX.Element {
  const { market, onClick, isFocused } = props;

  return (
    <ButtonBase
      style={{ flex: 1, display: 'flex', width: '100%' }}
      onClick={onClick}
      id={market.id}>
      <Box
        sx={{
          display: 'flex',
          backgroundColor: isFocused ? 'white' : grey[100],
          marginTop: 2,
          marginLeft: 2,
          flexDirection: 'row',
          flex: 1,
          height: 150,
          alignItems: 'center'
        }}>
        <Box
          sx={{
            display: 'flex',
            height: 120,
            width: 120,
            backgroundColor: market.color,
            borderRadius: 5,
            marginLeft: 1,
            alignItems: 'center',
            justifyContent: 'center'
          }}>
          <StorefrontIcon sx={{ width: 60, height: 60, color: 'white' }} />
        </Box>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-start',
            alignItems: 'flex-start',
            marginLeft: 1,
            height: 100
          }}>
          <Typography variant={'h6'} fontWeight={'bold'} sx={{ marginRight: 1 }}>
            {market.title}
          </Typography>
          <Typography sx={{ marginRight: 1 }}>{market.dates}</Typography>
        </Box>
      </Box>
    </ButtonBase>
  );
}

export default MarketCard;
