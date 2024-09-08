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
