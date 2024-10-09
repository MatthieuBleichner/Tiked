export interface ICity {
  id: string;
  name: string;
}

export interface IMarket {
  id: string;
  name: string;
  city: ICity;
  dates: string;
  color: string;
}

export interface IClient {
  id: string;
  firstName: string;
  lastName: string;
  cityId: string;
  siren: string;
  postalCode?: number;
  city?: string;
  address?: string;
  mail?: string;
  job?: string;
}

export interface IPricing {
  id: string;
  name: string;
  price: number;
  marketId: string;
}

export interface IBalanceSheet {
  id: string;
  date: Date;
  marketId: string;
}

export interface IBalanceSheetDetails {
  id: string;
  balanceSheetId: string;
  clientId: string;
  total: number;
}
