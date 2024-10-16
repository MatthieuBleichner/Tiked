import React, { useState, useEffect, Suspense } from 'react';
import Box from '@mui/material/Box';
import { useQueryClient } from '@tanstack/react-query';
import { ICity, IClient } from 'types/types';
import useSelectedData from 'contexts/market/useSelectedData';
import Paper from '@mui/material/Paper';
import ClientModal from 'components/Modals/ClientModal/ClientModal';
import { useClientMutation } from 'api/clients/hooks';
import { getClientsQuery } from 'api/clients/helpers';
import RootContainer from '../RootContainer/RootContainer';
import RootContainerLoading from '../RootContainer/RootContainerLoading';

import { useTranslation } from 'react-i18next';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import { useSuspenseQuery } from '@tanstack/react-query';
import { ErrorBoundary } from 'react-error-boundary';

interface ClientsProps {
  currentCity: ICity;
}

const ClientsSuspense: React.FC<ClientsProps> = ({ currentCity }) => {
  const { t } = useTranslation();

  const queryClient = useQueryClient();
  const { queryKey, queryFn } = getClientsQuery(currentCity);
  const { data: clients = [] } = useSuspenseQuery<IClient[]>({
    queryKey,
    queryFn
  });

  const onAddClients = (newClients: IClient[]) =>
    queryClient.setQueryData(queryKey, [...clients, ...newClients]);

  const mutation = useClientMutation({
    onSuccess: data => onAddClients(data)
  });

  const handleAddClient = (client: IClient) => {
    mutation.mutate(client);
  };

  const [open, setIsOpened] = useState(false);
  const [selectedClient, setSelectedClient] = useState<IClient>(clients?.[0]);

  useEffect(() => {
    if (clients?.length && !selectedClient) {
      setSelectedClient(clients[0]);
    }
  }, [clients]);

  if (!currentCity) {
    return null;
  }
  return (
    <RootContainer
      title={t('page.clients.title')}
      buttonText={t('page.clients.newClient')}
      onClickButton={() => setIsOpened(true)}>
      <Box
        sx={{
          flex: 1,
          borderRadius: 5,
          height: '80%',
          padding: 2,
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' }
        }}>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'flex-start',
            width: { xs: '100%', md: '30%' },
            height: '85%',
            zIndex: 5
          }}>
          <List sx={{ maxHeight: '100%', overflow: 'auto', width: '100%' }} component={Paper}>
            {clients?.map(client => (
              <React.Fragment key={client.id}>
                <ListItem disablePadding key={client.id}>
                  <ListItemButton
                    component="a"
                    href="#simple-list"
                    selected={client.id === selectedClient?.id}
                    onClick={() => setSelectedClient(client)}>
                    <ListItemText
                      sx={{ color: 'primary.main' }}
                      primary={`${client.firstName} ${client.lastName}`}
                    />
                  </ListItemButton>
                </ListItem>
                <Divider />
              </React.Fragment>
            ))}
          </List>
        </Box>
        <Box sx={{ width: { xs: '100%', md: '70%' }, height: '87%', padding: 2, paddingLeft: 4 }}>
          <Typography color={'primary.main'} fontWeight={'fontWeightBold'} variant="h5">
            {' '}
            {`${selectedClient?.firstName} ${selectedClient?.lastName}`}{' '}
          </Typography>
          {selectedClient?.job && (
            <Typography sx={{ paddingTop: 1 }} fontWeight={'fontWeightBold'}>
              {selectedClient.job}
            </Typography>
          )}
          {selectedClient?.mail && (
            <Typography sx={{ paddingTop: 1 }}>{selectedClient.mail}</Typography>
          )}
          {selectedClient?.address && (
            <Typography sx={{ paddingTop: 1 }}>
              {selectedClient.address} {selectedClient.postalCode} {selectedClient.city}
            </Typography>
          )}
          <Typography sx={{ paddingTop: 1 }}>{`Siret: ${selectedClient?.siren}`}</Typography>
        </Box>
        <ClientModal
          open={open}
          onClose={() => setIsOpened(false)}
          onClientCreated={handleAddClient}
          city={currentCity}
        />
      </Box>
    </RootContainer>
  );
};

const Clients: React.FC = () => {
  const { currentCity } = useSelectedData();
  const { t } = useTranslation();

  return (
    <React.Fragment>
      <Suspense fallback={<RootContainerLoading title={t('page.balancesheet.title')} />}>
        <ErrorBoundary fallback={<div>Something went wrong!</div>}>
          {currentCity && <ClientsSuspense currentCity={currentCity} />}
        </ErrorBoundary>
      </Suspense>
    </React.Fragment>
  );
};

export default Clients;
