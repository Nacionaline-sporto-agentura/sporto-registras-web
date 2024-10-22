import { Operation } from 'fast-json-patch';
import {
  AdminRoleType,
  Apps,
  AuthStrategy,
  BonusType,
  ClassifierTypes,
  FieldTypes,
  HistoryTypes,
  LegalForms,
  MatchTypes,
  MembershipTypes,
  ResultTypeTypes,
  ScholarshipType,
  StatusTypes,
  StudiesType,
  TableItemWidth,
  TenantTypes,
  UserRoleType,
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
  authType?: AdminRoleType;
  permissions?: { [key: string]: { features: string[] } };
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

export interface SportsBaseSpaceGroup extends CommonFields {
  name: string;
}

export interface SportBaseSpaceType {
  id: any;
  name: string;
  needSportType: boolean;
  group: SportsBaseSpaceGroup;
}

export interface SportsBasesCondition extends CommonFields {
  name: string;
  color: string;
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
  group?: Types;
  type?: SportBaseSpaceType;
  sportTypes?: SportType[];
  sportBase?: SportsBase;
  technicalCondition?: SportsBasesCondition;
  buildingNumber?: string;
  buildingPurpose?: string;
  buildingArea?: number;
  energyClass?: number;
  constructionDate?: string;
  latestRenovationDate?: string;
  photos: Photo[];
  additionalValues: { [key: string]: any };
}

export interface SportsBase extends CommonFields {
  id?: number;
  name: string;
  phone?: string;
  email?: string;
  canCreateRequest: boolean;
  type?: Types;
  level?: SportsBasesLevel;
  technicalCondition?: SportsBasesCondition;
  address: Address;
  geom: FeatureCollection;
  webPage: string;
  photos: Photo[];
  plotNumber: string;
  plotArea?: number;
  areaUnits?: number;
  builtPlotArea?: number;
  parkingPlaces?: number;
  methodicalClasses?: number;
  saunas?: number;
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
  notes?: string;
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
  role: UserRoleType;
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
  [ClassifierTypes.SOURCE]: SimpleFilters;
  [ClassifierTypes.SPORTS_BASE_TYPE]: SimpleFilters;
  [ClassifierTypes.SPORT_TYPE]: SimpleFilters;
  [ClassifierTypes.SPORT_ORGANIZATION_TYPE]: SimpleFilters;
  [ClassifierTypes.LEGAL_FORMS]: SimpleFilters;
  [ClassifierTypes.NATIONAL_TEAM_AGE_GROUP]: SimpleFilters;
  [ClassifierTypes.NATIONAL_TEAM_GENDER]: SimpleFilters;
  [ClassifierTypes.WORK_RELATIONS]: SimpleFilters;
  [ClassifierTypes.COMPETITION_TYPE]: SimpleFilters;
  [ClassifierTypes.VIOLATIONS_ANTI_DOPING]: SimpleFilters;
  [ClassifierTypes.ORGANIZATION_BASIS]: SimpleFilters;
  [ClassifierTypes.RESULT_TYPE]: SimpleFilters;
  [ClassifierTypes.SPORTS_BASE_SPACE_GROUP]: SimpleFilters;
}

export interface UnconfirmedRequestFiltersProps {
  status?: { $in: StatusTypes[] };
}

export interface NotFoundInfoProps {
  text?: string;
  url?: string;
  urlText?: string;
}

export interface Group<T = number> {
  id: string;
  name?: string;
  parent?: Group;
  apps: T[];
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
  required: boolean;
  description?: string;
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

export type Feature = {
  type: 'Feature';
  geometry: Geometry;
  properties?: GenericObject;
};

export type Geometry = {
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
  studies: Study[];
  competitionsCount: number;
  workRelations: WorkRelation[];
  sportsBases: SportsBase[];
}

export interface Coach extends CommonFields {
  competences: CoachCategory[];
  bonuses: Bonus[];
  nationalTeams: NationalTeam[];
}

export interface CoachCategory {
  company: Types;
  category: Types;
  issuedAt: string;
  expiresAt: string;
}

export interface Referee extends CommonFields {
  categories: RefereeCategory[];
  careerEndedAt: string;
}

export interface FaInstructor extends CommonFields {
  faSpecialists: FaSpecialist[];
}

export interface AmsInstructor extends CommonFields {
  coaches: FaSpecialist[];
}

export interface FaSpecialist extends CommonFields {
  faSpecialist: SportsPerson;
  dateFrom: string;
  dateTo: string;
}

export interface AmsInstructor extends CommonFields {
  coach: SportsPerson;
  startAt: string;
  endAt: string;
}

export interface RefereeCategory {
  company: Types;
  documentNumber: string;
  formCode: string;
  series: string;
  issuedAt: string;
}

export interface WorkRelation extends CommonFields {
  organization: Tenant;
  basis: Types;
  startAt: string;
  endAt: string;
  index?: any;
}

export interface Study extends CommonFields {
  type: StudiesType;
  program: Types;
  company: Types;
  startAt: string;
  endAt: string;
  index?: any;
}

export interface Athlete extends CommonFields {
  competitionResults: Result[];
  bonuses: Bonus[];
  nationalTeams: NationalTeam[];
  memberships: AthleteMembership[];
  coaches: AthleteCoach[];
  careerEndedAt: string;
  rents: Rent[];
  scholarships: ScholarShip[];
}

export interface AthleteCoach {
  sportsPerson: any;
  startAt: string;
  endAt: string;
}

export interface AthleteMembership {
  documentNumber: string;
  series: string;
  date: string;
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

export type ArrayToObject<T> = {
  [K in keyof T]: T[K] extends Array<infer U> ? { [key: string]: U } : T[K];
};

export interface Bonus extends CommonFields {
  sportsPerson?: SportsPerson;
  result?: Result;
  documentNumber?: string;
  date?: Date;
  amount?: string;
  type: BonusType;
}

export interface ScholarShip extends CommonFields {
  sportsPerson?: SportsPerson;
  result?: Result;
  documentNumber?: string;
  date?: Date;
  amount?: string;
  dateFrom?: Date;
  dateTo?: Date;
  data?: {
    from: Date;
    reason: string;
    renewFrom?: Date;
  };
  status: ScholarshipType;
}

export interface Rent extends CommonFields {
  sportsPerson?: SportsPerson;
  result?: Result;
  documentNumber?: string;
  date?: Date;
  amount?: string;
  unit?: Types;
  dateFrom?: Date;
  data?: {
    from: Date;
    reason: string;
    renewFrom?: Date;
  };
  status: ScholarshipType;
}

export interface NationalTeam extends CommonFields {
  name: string;
  startAt: Date;
  endAt: Date;
  ageGroup: Types;
  gender: Types;
  sportType: SportType;
  athletes: SportsPerson[];
  coaches: SportsPerson[];
  canCreateRequest: boolean;
  lastRequest: Request;
}

export interface Address {
  municipality: { code: number; name: string };
  city: { code: number; name: string };
  street: { code: number; name: string };
  house: { code: number; plot_or_building_number: string };
  apartment: { code: number; room_number: string };
}

export interface Permission<T = string> {
  id?: string;
  role?: string;
  app?: number | string;
  group?: T;
  features?: string[];
}

export interface App {
  id: number;
  name: string;
  type: Apps;
  url?: string;
  settings?: {
    isApp: boolean;
    canInviteSelf: boolean;
    productNameTo: string;
    createUserOnEvartaiLogin: boolean;
    createCompanyOnEvartaiLogin: boolean;
  };
}
