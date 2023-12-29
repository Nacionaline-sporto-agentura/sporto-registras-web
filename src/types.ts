import { AdminRoleType, AuthStrategy, TableItemWidth } from './utils/constants';

export interface User {
  id?: string;
  firstName?: string;
  role?: AdminRoleType;
  fullName?: string;
  lastName?: string;
  email?: string;
  type?: AdminRoleType;
  phone?: string;
  profiles?: Profile[];
  groups?: Group[];
  authStrategy?: AuthStrategy;
  permissions?: { [key: string]: { accesses: string[]; features: string[] } };
}

export type ProfileId = 'freelancer' | string;

export interface Profile {
  id: ProfileId;
  name: string;
  freelancer: boolean;
  email?: string;
  code?: string;
  role: AdminRoleType;
}

export type ChildrenType = string | JSX.Element | JSX.Element[] | any;

export type Column = {
  label: string | JSX.Element;
  mobileOrder?: number;
  desktopOrder?: number;
  show: boolean;
  visible?: boolean;
  width?: TableItemWidth;
};

export type Columns = {
  [key: string]: Column;
};
export interface NotFoundInfoProps {
  text?: string;
  url?: string;
  urlText?: string;
}

export interface ReactQueryError {
  response: {
    data: {
      type: string;
      message: string;
    };
  };
}

export interface TableRow {
  id?: string | number;
  [key: string]: any;
}

export interface TableData {
  data: TableRow[];
  total?: number;
  page?: number;
  pageSize?: number;
  totalPages?: number;
}

export interface TableDataProp {
  endpoint: () => Promise<any>;
  mapData: (props: any) => TableRow[];
  dependencyArray: any[];
  name: string;
}

export interface UserFilters {
  firstName?: string;
  lastName?: string;
  email?: string;
}

export interface GroupFilters {
  name?: string;
}

export interface NotFoundInfoProps {
  text?: string;
  url?: string;
  urlText?: string;
}

export interface Group {
  id: string;
  name?: string;
  parent?: Group;
  usersCount?: number;
  children?: Group[];
  role: string;
  error?: string;
  users?: User[];
  municipalities?: string[];
}
export interface DeleteInfoProps {
  deleteButtonText?: string;
  deleteDescriptionFirstPart?: string;
  deleteDescriptionSecondPart?: string;
  deleteTitle?: string;
  deleteName?: string;
  handleDelete?: (props?: any) => void;
}

export interface Group {
  id: string;
  name?: string;
  parent?: Group;
  usersCount?: number;
  children?: Group[];
  error?: string;
  users?: User[];
}
