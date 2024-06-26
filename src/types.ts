import { Operation } from 'fast-json-patch';
import {
  AdminRoleType,
  AuthStrategy,
  ClassifierTypes,
  FieldTypes,
  HistoryTypes,
  LegalForms,
  MatchTypes,
  MembershipTypes,
  ResultTypeTypes,
  StatusTypes,
  TableItemWidth,
  TenantTypes,
} from './utils/constants';

export interface CommonFields {
  id?: number;
  updatedAt?: Date;
  createdAt?: Date;
  deletedAt?: Date;
  createdBy?: User;
  updatedBy?: User;
  deletedBy?: User;
  tenant?: Tenant;
}

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
  position?: string;
}

export interface SportsBasesLevel {
  id: any;
  name: string;
}

export interface Types {
  id: any;
  name: string;
}

export interface SportsBasesCondition {
  id: any;
  name: string;
}

export interface Source {
  id: number;
  name: string;
}

export type FileProps = {
  url: string;
  name: string;
  size: number;
};

export type Photo = {
  id?: any;
  url: string;
  description: string;
  representative: boolean;
  public: boolean;
};

export interface SportsBasesBuildingType {
  id: any;
  name: string;
}

export interface SportBaseSpaceSportType {
  id: any;
  name: string;
}

export interface SportsBaseOwner {
  legalForm: LegalForms;
  name: string;
  code: string;
  website: string;
}

export interface SportBaseSpace {
  id?: number;
  name: string;
  type?: Types;
  sportTypes?: SportType[];
  sportBase?: SportBase;
  technicalCondition?: SportsBasesCondition;
  buildingNumber?: string;
  buildingPurpose?: { id: number; name: string };
  buildingArea?: number;
  energyClass?: number;
  constructionDate?: string;
  latestRenovationDate?: string;
  photos: Photo[];
  additionalValues: { [key: string]: any };
  energyClassCertificate?: {
    url: string;
    name: string;
    size: number;
  };
}

export interface SportBase extends CommonFields {
  id?: number;
  name: string;
  phone?: string;
  email?: string;
  canCreateRequest: boolean;
  type?: Types;
  level?: SportsBasesLevel;
  technicalCondition?: SportsBasesCondition;
  address: {
    municipality: string;
    city: string;
    street: string;
    house: string;
    apartment?: string;
  };
  coordinates: { x: string; y: string };
  webPage: string;
  photos: Photo[];
  plotNumber: string;
  disabledAccessible: boolean;
  blindAccessible: boolean;
  plotArea?: number;
  builtPlotArea?: number;
  parkingPlaces?: number;
  dressingRooms?: number;
  methodicalClasses?: number;
  saunas?: number;
  diningPlaces?: number;
  accommodationPlaces?: number;
  publicWifi: boolean;
  lastRequest: Request;
  spaces: SportBaseSpace[];
  owners: SportsBaseOwner[];
  tenants: {
    name: string;
    startAt: string;
    endAt: string;
  }[];
  investments: Investment[];
  plans: Array<{
    url: string;
    name?: string;
    size?: number;
  }>;
}

export interface Investment {
  appointedAt: string;
  investmentSources: { source: Source; fundsAmount: string }[];
  improvements: string;
}

export type ProfileId = 'freelancer' | string;

export interface Profile {
  id: ProfileId;
  name: string;
  freelancer: boolean;
  email?: string;
  code?: string;
  role: AdminRoleType;
  tenantType: TenantTypes;
  data: {
    canHaveChildren: boolean;
  };
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

export interface SimpleFilters {
  name?: string;
}

export interface UnconfirmedRequestFilters {
  status?: { id: StatusTypes; label: string }[];
}

export interface ClassifierFilters {
  [ClassifierTypes.LEVEL]: SimpleFilters;
  [ClassifierTypes.TECHNICAL_CONDITION]: SimpleFilters;
  [ClassifierTypes.SPACE_TYPE]: SimpleFilters;
  [ClassifierTypes.SOURCE]: SimpleFilters;
  [ClassifierTypes.SPORTS_BASE_TYPE]: SimpleFilters;
  [ClassifierTypes.SPORT_TYPE]: SimpleFilters;
  [ClassifierTypes.SPORT_ORGANIZATION_TYPE]: SimpleFilters;
  [ClassifierTypes.LEGAL_FORMS]: SimpleFilters;
}

export interface UnconfirmedRequestFiltersProps {
  status?: { $in: StatusTypes[] };
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
  handleDelete: (props?: any) => void;
}

export interface Group {
  id: string;
  name?: string;
  parent?: Group;
  usersCount?: number;
  children?: Group[];
  users?: User[];
}

export interface Tenant {
  id: string;
  lastRequest: Request;
  name?: string;
  code?: string;
  parent?: Tenant;
  email?: string;
  phone?: string;
  tenantType: TenantTypes;
  canCreateRequest: boolean;
  children?: Tenant[];
  fundingSources: TenantFundingSource[];
  memberships: TenantMembership[];
  governingBodies: GoverningBody[];
  address?: string;
  data?: any;
}

export interface GoverningBody {
  id: number;
  name: string;
  users: {
    firstName: string;
    lastName: string;
    position: string;
    personalCode: string;
  }[];
}

export interface TenantFundingSource {
  id: number;
  fundsAmount: number;
  description: string;
  appointedAt: Date;
  source: Source;
}

export interface TenantMembership {
  improvements: string;
  type: MembershipTypes;
  name: string;
  companyCode: string;
  startAt: Date;
  endAt: Date;
}

export interface Field {
  id: number;
  title: string;
  precision?: number;
  scale?: number;
  options: any[];
  type: FieldTypes;
}

export interface TypesAndFields {
  id: number;
  type: Types;
  field: Field;
}

export interface Request extends CommonFields {
  id: number;
  canValidate: boolean;
  canEdit: boolean;
  status: StatusTypes;
  field: Field;
  changes: Operation[];
  entity: any;
}
export interface FormHistory {
  type: HistoryTypes;
  comment: string;
  createdBy: User;
  createdAt: Date;
}

export type FeatureCollection = {
  type: 'FeatureCollection';
  features: Feature[];
};

type GenericObject = {
  [key: string]: any;
};

type Feature = {
  type: 'Feature';
  geometry: Geometry;
  properties?: GenericObject;
};

type Geometry = {
  type: string;
  coordinates: CoordinatesTypes;
};
type CoordinatesPoint = number[];
type CoordinatesMultiPoint = CoordinatesPoint[];
type CoordinatesLineString = CoordinatesPoint[];
type CoordinatesMultiLineString = CoordinatesLineString[];
type CoordinatesPolygon = CoordinatesLineString[];
type CoordinatesMultiPolygon = CoordinatesPolygon[];

type CoordinatesTypes =
  | CoordinatesPoint
  | CoordinatesLineString
  | CoordinatesPolygon
  | CoordinatesMultiPoint
  | CoordinatesMultiLineString
  | CoordinatesMultiPolygon;

export interface SportsPerson extends CommonFields {
  id?: number;
  firstName: string;
  lastName: string;
  type?: { id: number; name: string };
  sportTypes: SportType[];
  competitionCount: any;
  canCreateRequest: boolean;
  lastRequest: Request;
  personalCode: string;
  nationality: string;
  competitionsCount: number;
}

export interface Athlete extends CommonFields {
  id?: number;
  competitionResults: Result[];
}

export interface SportType extends CommonFields {
  name: string;
  olympic: boolean;
  paralympic: boolean;
  strategic: boolean;
  technical: boolean;
  deaf: boolean;
  specialOlympics: boolean;
}

export interface Match extends CommonFields {
  name: string;
  type: MatchTypes;
  olympic: boolean;
  paralympic: boolean;
  deaf: boolean;
  specialOlympics: boolean;
  index?: number;
}

export interface Competition extends CommonFields {
  id?: number;
  name: string;
  year: string;
  competitionType?: { id: number; name: string };
  lastRequest: Request;
  results: Result[];
}

export interface Result extends CommonFields {
  sportType: SportType;
  match: Match;
  competition: Competition;
  selection: boolean;
  sportsPersons: SportsPerson[];
  resultType: ResultType;
  result?: {
    value: any;
  };
  participantsNumber: string;
  stages: string;
  countriesCount?: string;
  otherMatch?: string;
  matchType?: MatchTypes;
  index?: number;
}

export interface ResultType {
  name: string;
  type: ResultTypeTypes;
}
