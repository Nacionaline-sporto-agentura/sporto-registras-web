export enum ServerErrorTypes {
  EMAIL_NOT_FOUND = `EMAIL_NOT_FOUND`,
  WRONG_PASSWORD = 'WRONG_PASSWORD',
  USER_EXISTS = 'USER_EXISTS',
  NOT_FOUND = 'NOT_FOUND',
}

export enum AdminRoleType {
  ADMIN = 'ADMIN',
  USER = 'USER',
  SUPER_ADMIN = 'SUPER_ADMIN',
}

export enum UserRoleType {
  ADMIN = 'ADMIN',
  USER = 'USER',
}

export enum TableItemWidth {
  MEDIUM = '76px',
  SMALL = '40px',
  LARGE = 'auto',
}

export enum AuthStrategy {
  PASSWORD = 'PASSWORD',
}

export enum TenantTypes {
  MUNICIPALITY = 'MUNICIPALITY',
  ORGANIZATION = 'ORGANIZATION',
}

export enum MembershipTypes {
  LITHUANIAN = 'LITHUANIAN',
  INTERNATIONAL = 'INTERNATIONAL',
}

export enum Apps {
  USERS = 'USERS',
  REGISTRAS = 'REGISTRAS',
}

export enum FieldTypes {
  SELECT = 'SELECT',
  TEXT_AREA = 'TEXT_AREA',
  BOOLEAN = 'BOOLEAN',
  NUMBER = 'NUMBER',
  DECIMAL = 'DECIMAL',
}

export enum TagColors {
  BLUE = 'blue',
  BROWN = 'brown',
  GREEN = 'green',
  PINK = 'pink',
  VIOLET = 'violet',
  ORANGE = 'orange',
  SKYBLUE = 'skyblue',
  GREY = 'grey',
}

export enum StatusTypes {
  CREATED = 'CREATED',
  SUBMITTED = 'SUBMITTED',
  APPROVED = 'APPROVED',
  RETURNED = 'RETURNED',
  REJECTED = 'REJECTED',
  DRAFT = 'DRAFT',
}

export const colorsByStatus = {
  [StatusTypes.CREATED]: TagColors.BLUE,
  [StatusTypes.SUBMITTED]: TagColors.BLUE,
  [StatusTypes.APPROVED]: TagColors.GREEN,
  [StatusTypes.RETURNED]: TagColors.ORANGE,
  [StatusTypes.REJECTED]: TagColors.PINK,
};

export enum HistoryTypes {
  CREATED = 'CREATED',
  SUBMITTED = 'SUBMITTED',
  REJECTED = 'REJECTED',
  RETURNED = 'RETURNED',
  APPROVED = 'APPROVED',
}

export enum RequestEntityTypes {
  SPORTS_BASES = 'SPORTS_BASES',
  SPORTS_PERSONS = 'SPORTS_PERSONS',
  TENANTS = 'TENANTS',
  COMPETITIONS = 'COMPETITIONS',
  NATIONAL_TEAMS = 'NATIONAL_TEAMS',
}

export enum ClassifierTypes {
  SPACE_TYPE = 'sporto_erdves_tipas',
  TECHNICAL_CONDITION = 'technine_bukle',
  LEVEL = 'sporto_bazes_lygis',
  SOURCE = 'investicijos_saltinis',
  SPORTS_BASE_TYPE = 'sporto_bazes_tipas',
  SPORT_TYPE = 'sporto_saka',
  SPORT_ORGANIZATION_TYPE = 'sporto_organizacijos_tipas',
  LEGAL_FORMS = 'teisine_forma',
  NATIONAL_TEAM_AGE_GROUP = 'nacionalines_rinktines_amziaus_grupe',
  NATIONAL_TEAM_GENDER = 'nacionalines_rinktines_lytis',
  WORK_RELATIONS = 'darbo_santykiai',
  COMPETITION_TYPE = 'varzybu_tipas',
  VIOLATIONS_ANTI_DOPING = 'antidopingo_pazeidimas',
  ORGANIZATION_BASIS = 'organizacijos_veiklos_tipas',
  RESULT_TYPE = 'rezultatai',
  SPORTS_BASE_SPACE_GROUP = 'sporto_bazes_erdves_rusis',
}

export enum SportTypeButtonKeys {
  olympic = 'olympic',
  paralympic = 'paralympic',
  strategic = 'strategic',
  technical = 'technical',
  deaf = 'deaf',
  specialOlympics = 'specialOlympics',
}

export enum ResultTypeTypes {
  NONE = 'NONE',
  RANGE = 'RANGE',
  NUMBER = 'NUMBER',
}

export enum MatchTypes {
  INDIVIDUAL = 'INDIVIDUAL',
  TEAM = 'TEAM',
}

export enum LegalForms {
  COMPANY = 'COMPANY',
  PERSON = 'PERSON',
}

export enum StudiesType {
  LEARNING = 'LEARNING',
  STUDIES = 'STUDIES',
}

export enum BonusType {
  NATIONAL = 'NATIONAL',
  MUNICIPAL = 'MUNICIPAL',
}

export enum ScholarshipType {
  ACTIVE = 'ACTIVE',
  SUSPENDED = 'SUSPENDED',
  TERMINATED = 'TERMINATED',
}

export enum AreaUnits {
  HA = 'HA',
  A = 'A',
  M2 = 'M2',
}
