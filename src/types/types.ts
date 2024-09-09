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
  firstname: string;
  lastname: string;
  cityId: string;
  siren: string;
}
