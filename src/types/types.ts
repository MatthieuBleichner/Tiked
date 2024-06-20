export interface ICity {
  id: string;
  url: string;
  title: string;
}

export interface IMarket {
  id: string;
  title: string;
  city: ICity;
  dates: string;
  color: string;
}
