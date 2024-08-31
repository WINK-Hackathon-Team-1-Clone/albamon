export interface IAlbamonResponse {
  pageProps: IAlbamonPageProps;
}

export interface IAlbamonPageProps {
  dehydratedState: IAlbamonDehydratedState;
}

export interface IAlbamonDehydratedState {
  queries: IAlbamonQuery[];
}

export interface IAlbamonQuery {
  state: IAlbamonQueryState;
}

export interface IAlbamonQueryState {
  data: IAlbamonQueryData;
}

export interface IAlbamonQueryData {
  base: IAlbamonQueryDataBase;
}

export interface IAlbamonQueryDataBase {
  pagination: {
    page: number;
    size: number;
    totalCount: number;
  };
  normal: {
    collection: IAlbamonCollection[];
  };
}

export interface IAlbamonCollection {
  recruitNo: number;
  recruitTitle: string;
  postStatusType: {
    key: string;
    value: string;
    description: string;
  };
  companyName: string;
  payType: {
    key: string;
    value: string;
    description: string;
  };
  pay: string;
  negoPay: boolean;
  workingTime: string;
  workingPeriod: string;
  negoWorkPeriod: string;
  workingWeek: string;
  workingDate: string;
  trainee: boolean;
  parts: string[];
  closingDate: string;
  closingDateWithDDay: string;
  closingDDay: string;
  age: string;
  latitude: number;
  longitude: number;
  existsMap: boolean;
  workplaceAddress: string;
  workplaceArea: string;
}
