import React, { Fragment } from 'react';
import { Image, Text, View, Page, Document, StyleSheet } from '@react-pdf/renderer';

import logo from '../../../../../public/logo_sb_marche.png';

import { IMarket, ICity, IBalanceSheetDetails, IBalanceSheet, IClient } from 'types/types';

interface BalanceSheetDetailsPDFProps {
  currentMarket: IMarket;
  currentCity: ICity;
  balanceSheetDetails: IBalanceSheetDetails[];
  balanceSheet: IBalanceSheet;
  clients: IClient[];
}

const BalanceSheetDetailsPDF = ({
  currentMarket,
  currentCity,
  balanceSheetDetails,
  balanceSheet,
  clients
}: BalanceSheetDetailsPDFProps) => {
  const styles = StyleSheet.create({
    page: {
      fontSize: 11,
      paddingTop: 20,
      paddingLeft: 40,
      paddingRight: 40,
      lineHeight: 1.5,
      flexDirection: 'column'
    },

    spaceBetween: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      color: '#3E3E3E'
    },

    center: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center'
    },

    titleContainer: { flexDirection: 'row', marginTop: 24 },
    marketTitleContainer: { flexDirection: 'row', marginTop: 24, marginBottom: 24 },
    logo: { width: 90 },

    reportTitle: { fontSize: 16, textAlign: 'center' },

    addressTitle: { fontSize: 11, fontStyle: 'bold' },
    marketTitle: { fontSize: 16, fontStyle: 'bold' },

    invoice: { fontWeight: 'bold', fontSize: 20 },

    invoiceNumber: { fontSize: 11, fontWeight: 'bold' },

    address: { fontWeight: 400, fontSize: 14 },

    theader: {
      marginTop: 20,
      fontSize: 10,
      fontStyle: 'bold',
      paddingTop: 4,
      paddingLeft: 7,
      flex: 1,
      height: 20,
      backgroundColor: '#DEDEDE',
      borderColor: 'whitesmoke',
      borderRightWidth: 1,
      borderBottomWidth: 1
    },

    theader2: { flex: 2, borderRightWidth: 0, borderBottomWidth: 1 },

    tbody: {
      fontSize: 9,
      paddingTop: 4,
      paddingLeft: 7,
      flex: 1,
      borderColor: 'whitesmoke',
      borderRightWidth: 1,
      borderBottomWidth: 1
    },

    total: {
      fontSize: 9,
      paddingTop: 4,
      paddingLeft: 7,
      flex: 1.5,
      borderColor: 'whitesmoke',
      borderBottomWidth: 1
    },

    tbody2: { flex: 2, borderRightWidth: 1 }
  });

  const PDFTitle = () => (
    <View style={styles.titleContainer}>
      <View style={styles.spaceBetween}>
        <Image
          style={styles.logo}
          src={
            'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSu0KnWKICFL4lJf_qVzcWVrAMnS5UIk_QOwQ&s'
          }
        />
        <Text style={styles.reportTitle}>SB Marché</Text>
      </View>
    </View>
  );

  const Address = () => (
    <View style={styles.titleContainer}>
      <View style={styles.spaceBetween}>
        <View>
          <Text style={styles.addressTitle}>Rue de l&apos;orangerie </Text>
          <Text style={styles.addressTitle}>56100,</Text>
          <Text style={styles.addressTitle}>Lorient, France.</Text>
        </View>
      </View>
    </View>
  );

  const MarketDetails = () => (
    <View style={styles.marketTitleContainer}>
      <View style={styles.center}>
        <View style={{ maxWidth: 200 }}>
          <Text style={styles.marketTitle}>{currentMarket.name} </Text>
          <Text style={styles.address}>
            {currentCity.name} -{' '}
            {balanceSheet?.date.toLocaleDateString('fr-FR', {
              year: 'numeric',
              month: 'numeric',
              day: 'numeric'
            })}
          </Text>
        </View>
      </View>
    </View>
  );

  const TableHead = () => (
    <View style={{ width: '100%', flexDirection: 'row', marginTop: 10 }}>
      <View style={[styles.theader, styles.theader2]}>
        <Text>Clients</Text>
      </View>
      <View style={styles.theader}>
        <Text>Articles</Text>
      </View>
      <View style={styles.theader}>
        <Text>Moyen de paiement</Text>
      </View>
      <View style={styles.theader}>
        <Text>Prix</Text>
      </View>
    </View>
  );

  const TableBody = () => (
    <Fragment>
      {balanceSheetDetails.map(details => {
        const client = clients.find(client => client.id === details.clientId);
        return (
          <Fragment key={details.id}>
            <View style={{ width: '100%', flexDirection: 'row' }}>
              <View style={[styles.tbody, styles.tbody2]}>
                <Text>
                  {client?.firstName} {client?.lastName}
                </Text>
              </View>
              <View style={styles.tbody}>
                <Text>Abonné annuel</Text>
              </View>
              <View style={styles.tbody}>
                <Text>Espèces</Text>
              </View>
              <View style={styles.tbody}>
                <Text>{details.total}</Text>
              </View>
            </View>
          </Fragment>
        );
      })}
    </Fragment>
  );

  const TableTotal = () => (
    <View style={{ width: '100%', flexDirection: 'row' }}>
      <View style={styles.total}>
        <Text></Text>
      </View>
      <View style={styles.total}>
        <Text> </Text>
      </View>
      <View style={styles.tbody}>
        <Text>Total</Text>
      </View>
      <View style={styles.tbody}>
        <Text>{balanceSheetDetails.reduce((sum, details) => sum + details.total, 0)}</Text>
      </View>
    </View>
  );

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <PDFTitle />
        <Address />
        <MarketDetails />
        <TableHead />
        <TableBody />
        <TableTotal />
      </Page>
    </Document>
  );
};
export default BalanceSheetDetailsPDF;
