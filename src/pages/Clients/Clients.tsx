import React, { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { IClient } from 'types/types';
import useSelectedData from 'contexts/market/useSelectedData';
import Paper from '@mui/material/Paper';
import ClientModal from 'components/Modals/ClientModal/ClientModal';
import { formatResponse, formatQueryData } from 'api/utils';
import { config } from 'config';
import { useClientsQuery, useClientMutation } from 'api/clients/hooks';
import RootContainer from '../RootContainer/RootContainer';
import { useTranslation } from 'react-i18next';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';

const Clients: React.FC = () => {
  const { t } = useTranslation();

  const queryClient = useQueryClient();
  const { currentCity } = useSelectedData();

  const { data: clients = [] } = useClientsQuery(currentCity, ['clients', currentCity?.id || '']);

  const onAddClients = (newClients: IClient[]) =>
    queryClient.setQueryData(['clients', currentCity?.id], [...clients, ...newClients]);
  const mutation = useClientMutation({
    onSuccess: data => onAddClients(data)
  });

  useMutation({
    mutationFn: (newClient: IClient) => {
      const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formatQueryData(newClient))
      };
      return fetch(`${config.API_URL}client?`, requestOptions)
        .then(response => response.json())
        .then(response => formatResponse(response));
    },
    onSuccess: (data, variables) => {
      queryClient.setQueryData(['clients', currentCity?.id], [...clients, ...(data as IClient[])]);
      console.log('Dans le onSuccess, data :', data, 'variables :', variables);
    },
    onError: error => {
      console.error('Error adding client:', error);
    }
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

export default Clients;
