import Axios, { AxiosInstance, AxiosResponse } from 'axios';
import { isEmpty, isFinite } from 'lodash';
import Cookies from 'universal-cookie';
import { GroupProps } from '../pages/GroupForm';
import {
  App,
  Bonus,
  Group,
  Permission,
  Rent,
  Request,
  ResultType,
  ScholarShip,
  SportBaseSpaceType,
  SportsBase,
  SportsBasesCondition,
  SportsBaseSpaceGroup,
  SportType,
  Tenant,
  TypesAndFields,
  Violation,
} from '../types';
const cookies = new Cookies();

export enum Resources {
  NATIONAL_TEAMS = 'api/nationalTeams',
  LOGIN = 'auth/login',
  HISTORY = 'history',
  WORK_RELATIONS = 'api/tenants/workRelations',
  FILES_UPLOAD = 'api/files/upload',
  REFRESH_TOKEN = 'auth/refresh',
  E_GATES_LOGIN = 'auth/evartai/login',
  E_GATES_SIGN = 'auth/evartai/sign',
  VERIFY_USER = 'auth/verify',
  SET_PASSWORD = 'auth/accept',
  REMIND_PASSWORD = 'auth/remind',
  REQUESTS = 'api/requests',
  SPORTS_BASES = 'api/sportsBases',
  SPORTS_PERSONS = 'api/sportsPersons',
  RESULTS = 'api/competitions/results',
  COMPETITIONS = 'api/competitions',
  SPORT_BASE_INVESTMENTS_SOURCES = 'api/sportsBases/investments/sources',
  TENANT_INVESTMENTS_SOURCES = 'api/tenants/fundingSources/types',
  LEVELS = 'api/sportsBases/levels',
  TECHNICAL_CONDITIONS = 'api/sportsBases/technicalConditions',
  TYPES = 'api/sportsBases/types',
  SPORT_TYPES = 'api/types/sportTypes',
  COMPETITION_TYPES = 'api/types/competitions/types',
  RESULT_TYPES = 'api/types/competitions/resultTypes',
  MATCH_TYPES = 'api/types/sportTypes/matches',
  SPACE_TYPES = 'api/types/sportsBases/spaces/types',
  VIOLATIONS_ANTI_DOPING_TYPES = 'api/types/sportsPersons/violationsAntiDoping',
  SPACE_GROUPS = 'api/types/sportsBases/spaces/groups',
  FIELDS = 'api/sportsBases/spaces/typesAndFields',
  ADMINS = 'api/admins',
  USERS = 'api/users',
  GROUPS = 'api/groups',
  TENANTS = 'api/tenants',
  ORGANIZATIONS = 'api/tenants/organizations',
  INSTITUTIONS = 'api/tenants/institutions',
  PROFILES = 'api/profiles',
  ORGANIZATION_BASIS = '/api/sportsBases/tenants/basis',
  LEGAL_FORMS = '/api/tenants/legalForms',
  SPORT_ORGANIZATION_TYPES = '/api/tenants/sportOrganizationTypes',
  RC = '/api/rc',
  STUDIES_COMPANIES = '/api/types/studies/companies',
  STUDIES_PROGRAMS = '/api/types/studies/programs',
  COACHES = '/api/sportsPersons/coaches',
  ATHLETE = '/api/sportsPersons/athletes',
  EDUCATIONAL_COMPANIES = 'api/types/educationalCompanies',
  QUALIFICATION_CATEGORIES = 'api/types/qualificationCategories',
  BONUSES = '/api/bonuses',
  SCHOLARSHIPS = '/api/scholarships',
  VIOLATIONS = '/api/violations',
  RENTS = '/api/rents',
  RENTS_UNITS = '/api/types/rents/units',
  AGE_GROUPS = 'api/types/nationalTeam/ageGroups',
  GENDERS = 'api/types/nationalTeam/genders',
  PERMISSIONS = 'api/permissions',
  USERS_APP = `api/apps/users`,
  SCHOLARSHIPS_REASONS = '/api/types/scholarships/reasons',
  VIOLATIONS_DISQUALIFICATION_REASONS = '/api/types/violations/disqualificationReasons',
}
export enum Populations {
  DATA = 'data',
  AGE_GROUP = 'ageGroup',
  ATHLETES = 'athletes',
  UNIT = 'unit',
  RESULT_TYPE = 'resultType',
  COMPETITION = 'competition',
  RESULT = 'result',
  SPORT_TYPES = 'sportTypes',
  ATHLETE = 'athlete',
  CHILDREN = 'children',
  PARENT = 'parent',
  GROUPS = 'groups',
  FIELD = 'field',
  ENTITY = 'entity',
  TYPE = 'type',
  LAST_REQUEST = 'lastRequest',
  CAN_EDIT = 'canEdit',
  CAN_CREATE_REQUEST = 'canCreateRequest',
  CAN_VALIDATE = 'canValidate',
  LEGAL_FORM = 'legalForm',
  TENANT = 'tenant',
  COMPETITION_TYPE = 'competitionType',
  SPORTS_PERSON = 'sportsPerson',
  SPORT_TYPE = 'sportType',
  DISQUALIFICATION_REASON = 'disqualificationReason',
  COMPETITION_RESULT = 'competitionResult',
}

export enum SortAscFields {
  NAME = `name`,
  FIRST_NAME = 'firstName',
  LAST_NAME = 'lastName',
}
export enum SortDescFields {
  NAME = `-name`,
  FIRST_NAME = '-firstName',
  LAST_NAME = '-lastName',
  ID = '-id',
  CREATED_AT = '-createdAt',
}

interface TableList<T = any> {
  query?: any;
  page?: string | number;
  id?: string;
  pageSize?: string;
  isMy?: boolean;
  scope?: string;
  fields?: string[];
  resource?: Resources;
  search?: string;
  sort?: string[];
}

interface GetAllProps {
  resource?: string;
  page?: string | number;
  populate?: string[];
  query?: any;
  pageSize?: string;
  search?: string;
  searchFields?: string[];
  sort?: string[];
  scope?: string;
  fields?: string[];
}

export interface GetAllResponse<T> {
  rows?: T[];
  totalPages?: number;
  page?: number;
  pageSize?: number;
  error?: any;
}

interface GetOne {
  resource: string;
  id?: string;
  populate?: string[];
  scope?: string;
}
interface Update {
  resource?: string;
  id?: string;
  params?: any;
}

interface Delete {
  resource: string;
  id: string;
  params?: any;
}

interface Create {
  resource: string;
  params?: any;
}

interface AuthApiProps {
  resource: string;
  params?: any;
}

class Api {
  private axios: AxiosInstance;
  private readonly proxy: string = '/api';
  constructor() {
    this.axios = Axios.create();

    this.axios.interceptors.request.use(
      (config) => {
        if (!config.url) {
          return config;
        }
        const token = cookies.get('token');
        const profileId = cookies.get('profileId');
        if (token) {
          config.headers!.Authorization = 'Bearer ' + token;

          if (isFinite(parseInt(profileId))) config.headers!['X-Profile'] = profileId;
        }
        config.url = this.proxy + config.url;

        return config;
      },
      (error) => {
        Promise.reject(error);
      },
    );
  }

  errorWrapper = async (endpoint: () => Promise<AxiosResponse<any, any>>) => {
    const res = await endpoint();
    return res.data;
  };

  customGet = ({ resource = '', ...rest }: GetAllProps & { [key: string]: any }): Promise<any> => {
    return this.errorWrapper(() => this.axios.get(resource, { params: rest }));
  };

  getList = async ({ resource, page, pageSize, query, ...rest }: GetAllProps): Promise<any> => {
    const config = {
      params: {
        pageSize: pageSize || 10,
        page: page || 1,
        ...rest,
        query: JSON.stringify(query),
      },
    };

    return this.errorWrapper(() => this.axios.get(`/${resource}`, config));
  };

  getAll = async ({ resource, query, ...rest }: GetAllProps): Promise<any> => {
    const config = {
      params: {
        ...rest,
        query: JSON.stringify(query),
      },
    };

    return this.errorWrapper(() => this.axios.get(`/${resource}/all`, config));
  };

  getOne = async ({ resource, id, populate, scope }: GetOne) => {
    const config = {
      params: {
        ...(!!populate && { populate }),
        ...(!!scope && { scope }),
      },
    };

    return this.errorWrapper(() => this.axios.get(`/${resource}${id ? `/${id}` : ''}`, config));
  };

  patch = async ({ resource, id, params }: Update) => {
    return this.errorWrapper(() => this.axios.patch(`/${resource}/${id}`, params));
  };

  delete = async ({ resource, id, params }: Delete) => {
    return this.errorWrapper(() =>
      this.axios.delete(`/${resource}/${id}`, {
        data: params,
      }),
    );
  };

  post = async ({ resource, params }: Create) => {
    return this.errorWrapper(() => this.axios.post(`/${resource}`, params));
  };

  uploadFiles = async (files: File[] = []): Promise<any> => {
    if (isEmpty(files)) return [];

    const config = {
      headers: { 'Content-Type': 'multipart/form-data' },
    };

    try {
      const data = await Promise.all(
        files?.map(async (file) => {
          const formData = new FormData();
          formData.append('file', file);
          const { data } = await this.axios.post(`/${Resources.FILES_UPLOAD}`, formData, config);
          return data;
        }),
      );

      return data?.map((file) => {
        return {
          name: file.filename,
          size: file.size,
          url: file?.url,
        };
      });
    } catch (e: any) {
      return { error: e.response.data.message };
    }
  };

  authApi = async ({ resource, params }: AuthApiProps) => {
    return this.errorWrapper(() => this.axios.post(`/${resource}`, params || {}));
  };

  getUserInfo = async () => {
    return this.errorWrapper(() => this.axios.get('/api/users/me'));
  };

  logout = async () => {
    return this.errorWrapper(() => this.axios.get('/api/users/logout'));
  };

  refreshToken = async () => {
    return this.authApi({
      resource: Resources.REFRESH_TOKEN,
      params: { token: cookies.get('refreshToken') },
    });
  };

  login = async (params: { password: string; email: string }) => {
    return this.authApi({
      resource: Resources.LOGIN,
      params,
    });
  };

  remindPassword = async (params: { email: string }) => {
    return this.authApi({
      resource: Resources.REMIND_PASSWORD,
      params,
    });
  };

  verifyUser = async (params: {
    h: string;
    s: string;
  }): Promise<{
    inviter: { name: string; email: string };
    user: { email: string };
  }> => {
    return this.authApi({
      resource: Resources.VERIFY_USER,
      params,
    });
  };

  eGatesSign = async () => {
    return this.authApi({
      resource: Resources.E_GATES_SIGN,
    });
  };

  eGatesLogin = async (params) => {
    return this.authApi({
      resource: Resources.E_GATES_LOGIN,
      params,
    });
  };

  setPassword = async (params: { h: string; s: string; password: string }): Promise<any> => {
    return this.authApi({
      resource: Resources.SET_PASSWORD,
      params,
    });
  };

  updateAdminUser = async ({ params, id }: { params: any; id: string }) => {
    return this.patch({
      resource: Resources.ADMINS,
      params,
      id,
    });
  };

  updateProfile = async ({ params }: { params: any }) => {
    return this.patch({
      resource: Resources.USERS + '/me',
      params,
    });
  };

  getAdminUser = async ({ id }: { id: string }) => {
    return this.getOne({
      resource: Resources.ADMINS,
      populate: [Populations.GROUPS],
      id,
    });
  };

  deleteAdminUser = async ({ id }: { id: string }) => {
    return this.delete({
      resource: Resources.ADMINS,
      id,
    });
  };

  getAdminUsers = async ({ query, page }: TableList) => {
    return this.getList({
      resource: Resources.ADMINS,
      populate: [Populations.GROUPS],
      sort: [SortAscFields.FIRST_NAME, SortAscFields.LAST_NAME],
      page,
      query,
    });
  };

  createAdminUser = async ({ params }: { params: any }) => {
    return this.post({
      resource: Resources.ADMINS,
      params,
    });
  };

  updateTenantUser = async ({
    params,
    id,
    tenantId,
  }: {
    params: any;
    id: string;
    tenantId: string;
  }) => {
    return this.patch({
      resource: `${Resources.TENANTS}/${tenantId}/users`,
      params,
      id,
    });
  };

  getTenantUser = async ({ tenantId, id }: { id: string; tenantId: string }) => {
    return this.getOne({
      resource: `${Resources.TENANTS}/${tenantId}/users`,
      id,
    });
  };

  deleteTenantUser = async ({ tenantId, id }: { id: string; tenantId: string }) => {
    return this.delete({
      resource: `${Resources.TENANTS}/${tenantId}/users`,
      id,
    });
  };

  updateUser = async ({ params, id }: { params: any; id: string }) => {
    return this.patch({
      resource: Resources.ADMINS,
      params,
      id,
    });
  };

  getUser = async ({ id }: { id: string }) => {
    return this.getOne({
      resource: Resources.USERS,
      id,
    });
  };

  deleteUser = async ({ id }: { id: string }) => {
    return this.delete({
      resource: Resources.USERS,
      id,
    });
  };

  createUser = async ({ params }: { params: any }) => {
    return this.post({
      resource: Resources.USERS,
      params,
    });
  };

  getUsers = async ({ page, query }: TableList) => {
    return this.getList({
      resource: Resources.USERS,
      sort: [SortAscFields.FIRST_NAME, SortAscFields.LAST_NAME],
      query,
      page,
    });
  };

  getTenantUsers = async ({ page, id, query }: TableList) => {
    return this.getList({
      resource: `${Resources.TENANTS}/${id}/users`,
      sort: [SortAscFields.FIRST_NAME, SortAscFields.LAST_NAME],
      query,
      page,
    });
  };

  getSportsBases = async ({ page, query }: TableList) =>
    await this.getList({
      resource: Resources.SPORTS_BASES,
      populate: [Populations.TYPE, Populations.LAST_REQUEST],
      sort: [SortDescFields.ID],
      page,
      query,
    });

  getSportsPersons = async ({ page, query }: TableList) =>
    await this.getList({
      resource: Resources.SPORTS_PERSONS,
      populate: [
        Populations.TYPE,
        Populations.LAST_REQUEST,
        Populations.TENANT,
        Populations.SPORT_TYPES,
        Populations.ATHLETE,
      ],
      sort: [SortDescFields.ID],
      page,
      query,
    });

  getListSportsPersons = async ({ page, query }: TableList) =>
    await this.getList({
      resource: Resources.SPORTS_PERSONS,
      sort: [SortDescFields.ID],
      page,
      query,
    });

  getNationalTeams = async ({ page, query }: TableList) =>
    await this.getList({
      resource: Resources.NATIONAL_TEAMS,
      populate: [
        Populations.LAST_REQUEST,
        Populations.TENANT,
        Populations.SPORT_TYPES,
        Populations.AGE_GROUP,
        Populations.ATHLETES,
      ],
      sort: [SortDescFields.ID],
      page,
      query,
    });

  getSportsPerson = async (id: string): Promise<SportsBase> =>
    await this.getOne({
      resource: `${Resources.SPORTS_PERSONS}/${id}/base`,
    });

  getNationalTeam = async (id: string): Promise<SportsBase> =>
    await this.getOne({
      resource: `${Resources.NATIONAL_TEAMS}/${id}/base`,
    });

  getCompetitions = async ({ page, query }: TableList) =>
    await this.getList({
      resource: Resources.COMPETITIONS,
      populate: [
        Populations.TYPE,
        Populations.LAST_REQUEST,
        Populations.TENANT,
        Populations.COMPETITION_TYPE,
      ],
      sort: [SortDescFields.ID],
      page,
      query,
    });

  getNewRequests = async ({ page, query }: TableList) =>
    await this.getList({
      resource: Resources.REQUESTS + '/new',
      populate: [Populations.ENTITY, Populations.TENANT],
      sort: [SortDescFields.ID],
      page,
      query,
    });

  getSportsBase = async (id: string): Promise<SportsBase> =>
    await this.getOne({
      resource: `${Resources.SPORTS_BASES}/${id}/base`,
      populate: [
        Populations.LAST_REQUEST,
        Populations.CAN_EDIT,
        Populations.CAN_CREATE_REQUEST,
        'type',
        'level',
        'technicalCondition',
        'spaces',
        'investments',
        'tenants',
        'owners',
        'canValidate',
      ],
    });

  deleteSportsBase = async ({ id }: { id: string }) => {
    return this.delete({
      resource: Resources.SPORTS_BASES,
      id,
    });
  };

  deleteRequest = async ({ id }) => {
    return this.delete({
      resource: Resources.REQUESTS,
      id,
    });
  };

  getCompetition = async (id: string): Promise<SportsBase> =>
    await this.getOne({
      resource: `${Resources.COMPETITIONS}/${id}/base`,
    });

  getRequest = async (id: string): Promise<Request> =>
    await this.getOne({
      resource: Resources.REQUESTS,
      populate: ['canEdit', 'canValidate'],
      id,
    });

  createRequests = async (params) =>
    await this.post({
      resource: Resources.REQUESTS,
      params,
    });

  updateRequest = async (params, id: any) =>
    await this.patch({
      resource: Resources.REQUESTS,
      params,
      id,
    });

  approveRequest = async (id: string) =>
    await this.post({
      resource: `${Resources.REQUESTS}/${id}/approve`,
    });

  getGroupsOptions = async () =>
    await this.getList({
      resource: Resources.GROUPS,
      populate: [Populations.CHILDREN],
      pageSize: '9999',
      sort: [SortAscFields.NAME],
    });

  getGroups = async ({ page, query }: TableList) =>
    await this.getList({
      resource: Resources.GROUPS,
      page,
      query,
      populate: [Populations.CHILDREN],
      sort: [SortAscFields.NAME],
    });

  getGroup = async ({ id }: { id: string }): Promise<Group> => {
    return await this.getOne({
      resource: Resources.GROUPS,
      populate: [Populations.CHILDREN],
      id,
    });
  };

  createGroup = async ({ params }: { params: GroupProps }): Promise<Group> =>
    await this.post({
      resource: Resources.GROUPS,
      params,
    });

  updateGroup = async ({ params, id }: { params: GroupProps; id: string }): Promise<Group> =>
    await this.patch({
      resource: Resources.GROUPS,
      params,
      id,
    });
  deleteGroup = async ({ id }) =>
    await this.getOne({
      id,
      resource: Resources.GROUPS,
    });

  getGroupParent = async ({ id }) =>
    await this.getOne({
      id,
      resource: Resources.GROUPS,
      populate: [Populations.PARENT],
    });

  getGroupUsers = async ({ id, page }) =>
    await this.getList({
      page,
      sort: [SortAscFields.FIRST_NAME, SortAscFields.LAST_NAME],
      resource: `${Resources.GROUPS}/${id}/users`,
    });

  getTenants = async ({ page, query }: TableList) =>
    await this.getList({
      resource: Resources.TENANTS,
      populate: [Populations.CHILDREN],
      query,
      page,
      sort: [SortAscFields.NAME],
    });

  getOrganizations = async ({ page, query }: TableList) =>
    await this.getList({
      resource: Resources.ORGANIZATIONS,
      populate: [Populations.PARENT, Populations.LAST_REQUEST],
      page,
      query,
      sort: [SortAscFields.NAME],
    });

  getEducationalCompanies = async ({ page, query }: TableList) =>
    await this.getList({
      resource: Resources.EDUCATIONAL_COMPANIES,
      page,
      query,
    });

  getQualificationCategories = async ({ page, query }: TableList) =>
    await this.getList({
      resource: Resources.QUALIFICATION_CATEGORIES,
      page,
      query,
    });

  getInstitutions = async ({ page, query }: TableList) =>
    await this.getList({
      resource: Resources.INSTITUTIONS,
      populate: [Populations.PARENT],
      page,
      query,
      sort: [SortAscFields.NAME],
    });

  getTenantOptions = async (): Promise<GetAllResponse<Tenant>> =>
    await this.getList({
      resource: Resources.TENANTS,
      populate: [Populations.CHILDREN],
      pageSize: '9999',
      sort: [SortAscFields.NAME],
    });

  getTenant = async ({ id }: { id: string }): Promise<Tenant> => {
    return await this.getOne({
      resource: Resources.TENANTS,
      populate: [Populations.CHILDREN],
      id,
    });
  };

  getRequestTenant = async ({ id }: { id: string }): Promise<Tenant> => {
    return await this.getOne({
      resource: `${Resources.TENANTS}/${id}/base`,
      populate: [
        Populations.CHILDREN,
        Populations.LAST_REQUEST,
        Populations.CAN_EDIT,
        Populations.CAN_CREATE_REQUEST,
        Populations.CAN_VALIDATE,
        Populations.TYPE,
        Populations.LEGAL_FORM,
      ],
    });
  };

  createTenant = async ({ params }: { params: GroupProps }) =>
    await this.post({
      resource: Resources.TENANTS,
      params,
    });

  updateTenant = async ({ params, id }: { params: GroupProps; id: string }) =>
    await this.patch({
      resource: Resources.TENANTS,
      params,
      id,
    });
  deleteTenant = async ({ id }) =>
    await this.getOne({
      id,
      resource: Resources.TENANTS,
    });

  getProfiles = async () =>
    await this.getList({
      pageSize: '99999',
      resource: Resources.PROFILES,
    });

  getSportBaseSources = async ({ page, query, sort }: TableList) =>
    await this.getList({
      page,
      query,
      fields: ['id', 'name'],
      resource: Resources.SPORT_BASE_INVESTMENTS_SOURCES,
      sort,
    });

  getTenantSources = async ({ query, page }) =>
    await this.getList({
      query,
      page,
      fields: ['id', 'name'],
      resource: Resources.TENANT_INVESTMENTS_SOURCES,
      sort: [SortAscFields.NAME],
    });

  getSportBaseLevels = async ({ query, page, sort }: TableList) =>
    await this.getList({
      query,
      page,
      fields: ['id', 'name'],
      resource: Resources.LEVELS,
      sort,
    });

  getScholarshipReasons = async ({ page, query }: TableList) =>
    await this.getList({
      resource: Resources.SCHOLARSHIPS_REASONS,
      sort: [SortDescFields.ID],
      fields: ['id', 'name'],
      page,
      query,
    });

  getSportBaseTechnicalConditions = async ({ query, page, sort }: TableList) =>
    await this.getList({
      query,
      page,
      fields: ['id', 'name', 'color'],
      resource: Resources.TECHNICAL_CONDITIONS,
      sort,
    });

  getSportBaseTechnicalCondition = async ({ id }: TableList): Promise<SportsBasesCondition> =>
    await this.getOne({
      resource: Resources.TECHNICAL_CONDITIONS,
      id,
    });

  createSportBaseTechnicalCondition = async ({ params }: { params: SportsBasesCondition }) =>
    await this.post({
      resource: Resources.TECHNICAL_CONDITIONS,
      params,
    });

  updateSportBaseTechnicalCondition = async ({
    params,
    id,
  }: {
    params: SportsBasesCondition;
    id: string;
  }) =>
    await this.patch({
      resource: Resources.TECHNICAL_CONDITIONS,
      params,
      id,
    });

  deleteSportBaseTechnicalCondition = async ({ id }: { id: string }) => {
    return this.delete({
      resource: Resources.TECHNICAL_CONDITIONS,
      id,
    });
  };

  getSportBaseTypes = async ({ query, page, sort }: TableList) =>
    await this.getList({
      query,
      page,
      fields: ['id', 'name'],
      resource: Resources.TYPES,
      sort,
    });

  getSportType = async ({ id }: TableList): Promise<SportType> =>
    await this.getOne({
      resource: Resources.SPORT_TYPES,
      id,
    });

  createSportType = async ({ params }: { params: SportType }) =>
    await this.post({
      resource: Resources.SPORT_TYPES,
      params,
    });

  updateSportType = async ({ params, id }: { params: SportType; id: string }) =>
    await this.patch({
      resource: Resources.SPORT_TYPES,
      params,
      id,
    });

  deleteSportType = async ({ id }: { id: string }) => {
    return this.delete({
      resource: Resources.SPORT_TYPES,
      id,
    });
  };

  getOrganizationBasis = async ({ query, page }) =>
    await this.getList({
      query,
      page,
      fields: ['id', 'name'],
      resource: Resources.ORGANIZATION_BASIS,
    });

  getSportTypes = async ({ query, page, sort }: TableList) =>
    await this.getList({
      query,
      page,
      resource: Resources.SPORT_TYPES,
      sort,
    });

  getNationalTeamGenders = async ({ query, page, sort }: TableList) =>
    await this.getList({
      query,
      page,
      resource: Resources.GENDERS,
      sort,
    });

  getNationalTeamAgeGroups = async ({ query, page, sort }: TableList) =>
    await this.getList({
      query,
      page,
      resource: Resources.AGE_GROUPS,
      sort,
    });

  getWorkRelations = async ({ query, page, sort }: TableList) =>
    await this.getList({
      query,
      page,
      resource: Resources.WORK_RELATIONS,
      sort,
    });

  getCoaches = async ({ query, page }: TableList) =>
    await this.getList({
      query,
      page,
      resource: Resources.COACHES,
      populate: [Populations.SPORTS_PERSON],
    });

  getCompetitionTypes = async ({ query, page, sort }: TableList) =>
    await this.getList({
      query,
      page,
      resource: Resources.COMPETITION_TYPES,
      sort,
    });

  getMatchTypes = async ({ query, page, sort }: TableList) =>
    await this.getList({
      query,
      page,
      resource: Resources.MATCH_TYPES,
      sort,
    });

  getAllMatchTypes = async ({ query, page, sort }: TableList) =>
    await this.getAll({
      query,
      page,
      resource: Resources.MATCH_TYPES,
      sort,
    });

  getAllResultTypes = async ({ query, page, sort }: TableList): Promise<ResultType[]> =>
    await this.getAll({
      query,
      page,
      resource: Resources.RESULT_TYPES,
      sort,
    });

  getResultTypes = async ({ query, page, sort }: TableList): Promise<ResultType[]> =>
    await this.getList({
      query,
      page,
      resource: Resources.RESULT_TYPES,
      sort,
    });

  createMatchType = async ({ params }: { params: SportType }) =>
    await this.post({
      resource: Resources.MATCH_TYPES,
      params,
    });

  updateMatchType = async ({ params, id }: { params: SportType; id: string }) =>
    await this.patch({
      resource: Resources.MATCH_TYPES,
      params,
      id,
    });

  deleteMatchType = async ({ id }: { id: string }) => {
    return this.delete({
      resource: Resources.MATCH_TYPES,
      id,
    });
  };

  getTenantSportOrganizationTypes = async ({ query, page, sort }: TableList) =>
    await this.getList({
      query,
      page,
      fields: ['id', 'name'],
      resource: Resources.SPORT_ORGANIZATION_TYPES,
      sort,
    });

  getDisqualificationReasons = async ({ query, page, sort }: TableList) =>
    await this.getList({
      query,
      page,
      fields: ['id', 'name'],
      resource: Resources.VIOLATIONS_DISQUALIFICATION_REASONS,
      sort,
    });

  getTenantLegalForms = async ({ query, page, sort }: TableList) =>
    await this.getList({
      query,
      page,
      fields: ['id', 'name'],
      resource: Resources.LEGAL_FORMS,
      sort,
    });

  getViolationsAntiDopingTypes = async ({ page, query, sort }: TableList) =>
    await this.getList({
      page,
      fields: ['id', 'name'],
      query,
      resource: Resources.VIOLATIONS_ANTI_DOPING_TYPES,
      sort,
    });

  getSportsBaseSpaceTypes = async ({ page, query }: TableList) =>
    await this.getList({
      page,
      fields: ['id', 'name', 'needSportType'],
      query,
      resource: Resources.SPACE_TYPES,
      sort: [SortDescFields.CREATED_AT],
    });

  getSportsBaseSpaceType = async ({ id }: { id: string }) =>
    await this.getOne({
      resource: Resources.SPACE_TYPES,
      id,
    });

  createSportBaseSpaceType = async ({ params }: { params: SportBaseSpaceType }) =>
    await this.post({
      resource: Resources.SPACE_TYPES,
      params,
    });

  updateSportBaseSpaceType = async ({ params, id }: { params: SportBaseSpaceType; id: string }) =>
    await this.patch({
      resource: Resources.SPACE_TYPES,
      params,
      id,
    });

  deleteSportBaseSpaceType = async ({ id }: { id: string }) => {
    return this.delete({
      resource: Resources.SPACE_TYPES,
      id,
    });
  };

  getSportBaseSpaceGroups = async ({ page, query, sort }: TableList) =>
    await this.getList({
      page,
      fields: ['id', 'name'],
      query,
      resource: Resources.SPACE_GROUPS,
      sort,
    });

  getSportBaseSpaceGroup = async ({ id }: { id: string }) =>
    await this.getOne({
      resource: Resources.SPACE_GROUPS,
      id,
    });

  createSportBaseSpaceGroup = async ({ params }: { params: SportsBaseSpaceGroup }) =>
    await this.post({
      resource: Resources.SPACE_GROUPS,
      params,
    });

  updateSportBaseSpaceGroup = async ({
    params,
    id,
  }: {
    params: SportsBaseSpaceGroup;
    id: string;
  }) =>
    await this.patch({
      resource: Resources.SPACE_GROUPS,
      params,
      id,
    });

  deleteSportBaseSpaceGroup = async ({ id }: { id: string }) => {
    return this.delete({
      resource: Resources.SPACE_GROUPS,
      id,
    });
  };

  getRcPlotByAddress = async (
    streetCode: string | number,
    plotOrBuildingNumber: string | number,
    roomNumber?: string | number,
  ) =>
    await this.customGet({
      resource: `${Resources.RC}/plot`,
      streetCode,
      plotOrBuildingNumber,
      roomNumber,
    });

  getRcObjects = async (query: any) =>
    await this.customGet({
      resource: `${Resources.RC}/objects`,
      ...query,
    });

  getRcObjectInfo = async (
    registrationNumber: string,
    registrationServiceNumber: string,
    uniqueNumber: string,
  ) =>
    await this.customGet({
      resource: `${Resources.RC}/objects/${registrationNumber}/${registrationServiceNumber}/${uniqueNumber}`,
    });

  getFields = async ({ query }): Promise<TypesAndFields[]> =>
    await this.getAll({
      query,
      resource: Resources.FIELDS,
      populate: [Populations.FIELD],
    });

  getRequestHistory = async ({ page, pageSize, id }: TableList) =>
    await this.getList({
      resource: `${Resources.REQUESTS}/${id}/${Resources.HISTORY}`,
      page,
      pageSize,
    });

  getStudyCompanies = async ({ query, page }) =>
    await this.getList({
      query,
      page,
      resource: Resources.STUDIES_COMPANIES,
    });

  getStudyPrograms = async ({ query, page }) =>
    await this.getList({
      query,
      page,
      resource: Resources.STUDIES_PROGRAMS,
    });

  getBonuses = async ({ page, query }: TableList): Promise<GetAllResponse<Bonus>> =>
    await this.getList({
      resource: Resources.BONUSES,
      page,
      query,
      populate: [Populations.SPORTS_PERSON, Populations.RESULT],
      sort: [SortDescFields.ID],
    });

  getBonus = async ({ id }: { id: string }): Promise<Bonus> => {
    return await this.getOne({
      resource: Resources.BONUSES,
      populate: [Populations.SPORTS_PERSON, Populations.RESULT],
      id,
    });
  };

  createBonus = async ({ params }: { params: any }): Promise<Bonus> =>
    await this.post({
      resource: Resources.BONUSES,
      params,
    });

  updateBonus = async ({ params, id }: { params: any; id: string }): Promise<Bonus> =>
    await this.patch({
      resource: Resources.BONUSES,
      params,
      id,
    });
  deleteBonus = async ({ id }) =>
    await this.getOne({
      id,
      resource: Resources.BONUSES,
    });

  getViolations = async ({ page, query }: TableList): Promise<GetAllResponse<Violation>> =>
    await this.getList({
      resource: Resources.VIOLATIONS,
      page,
      query,
      populate: [Populations.SPORTS_PERSON, Populations.SPORT_TYPE],
      sort: [SortDescFields.ID],
    });

  getViolation = async ({ id }: { id: string }): Promise<Violation> => {
    return await this.getOne({
      resource: Resources.VIOLATIONS,
      populate: [
        Populations.SPORTS_PERSON,
        Populations.SPORT_TYPE,
        Populations.DISQUALIFICATION_REASON,
        Populations.COMPETITION_RESULT,
      ],
      id,
    });
  };

  createViolation = async ({ params }: { params: any }): Promise<Violation> =>
    await this.post({
      resource: Resources.VIOLATIONS,
      params,
    });

  updateViolation = async ({ params, id }: { params: any; id: string }): Promise<Violation> =>
    await this.patch({
      resource: Resources.VIOLATIONS,
      params,
      id,
    });
  deleteViolation = async ({ id }) =>
    await this.getOne({
      id,
      resource: Resources.VIOLATIONS,
    });

  getScholarships = async ({ page, query }: TableList): Promise<GetAllResponse<ScholarShip>> =>
    await this.getList({
      resource: Resources.SCHOLARSHIPS,
      page,
      query,
      populate: [Populations.SPORTS_PERSON, Populations.RESULT],
      sort: [SortDescFields.ID],
    });

  getScholarship = async ({ id }: { id: string }): Promise<ScholarShip> => {
    return await this.getOne({
      resource: Resources.SCHOLARSHIPS,
      populate: [Populations.SPORTS_PERSON, Populations.RESULT, Populations.DATA],
      id,
    });
  };

  createScholarship = async ({ params }: { params: any }): Promise<ScholarShip> =>
    await this.post({
      resource: Resources.SCHOLARSHIPS,
      params,
    });

  updateScholarship = async ({ params, id }: { params: any; id: string }): Promise<ScholarShip> =>
    await this.patch({
      resource: Resources.SCHOLARSHIPS,
      params,
      id,
    });
  deleteScholarship = async ({ id }) =>
    await this.getOne({
      id,
      resource: Resources.SCHOLARSHIPS,
    });

  getRents = async ({ page, query }: TableList): Promise<GetAllResponse<Rent>> =>
    await this.getList({
      resource: Resources.RENTS,
      page,
      query,
      populate: [Populations.SPORTS_PERSON, Populations.RESULT],
      sort: [SortDescFields.ID],
    });

  getRent = async ({ id }: { id: string }): Promise<Rent> => {
    return await this.getOne({
      resource: Resources.RENTS,
      populate: [Populations.SPORTS_PERSON, Populations.RESULT, Populations.UNIT],
      id,
    });
  };

  createRent = async ({ params }: { params: any }): Promise<Rent> =>
    await this.post({
      resource: Resources.RENTS,
      params,
    });

  updateRent = async ({ params, id }: { params: any; id: string }): Promise<Rent> =>
    await this.patch({
      resource: Resources.RENTS,
      params,
      id,
    });
  deleteRent = async ({ id }) =>
    await this.getOne({
      id,
      resource: Resources.RENTS,
    });

  getResults = async ({ page, query }: TableList) =>
    await this.getAll({
      resource: Resources.RESULTS,
      populate: [Populations.COMPETITION, Populations.RESULT_TYPE],
      sort: [SortDescFields.ID],
      page,
      query,
    });

  getRentsUnits = async ({ page, query }: TableList) =>
    await this.getList({
      resource: Resources.RENTS_UNITS,
      sort: [SortDescFields.ID],
      page,
      query,
    });

  getPermissions = async ({ page }): Promise<GetAllResponse<Permission<Group>>> =>
    await this.getList({
      resource: Resources.PERMISSIONS,
      populate: ['group'],
      page,
    });

  getPermission = async ({ id }): Promise<Permission<Group>> =>
    await this.getOne({
      resource: Resources.PERMISSIONS,
      populate: ['group'],
      id,
    });

  createPermission = async ({ params }: { params: Permission }): Promise<Permission> =>
    await this.post({
      resource: Resources.PERMISSIONS,
      params,
    });

  updatePermission = async ({
    id,
    params,
  }: {
    id: string;
    params: Permission;
  }): Promise<Permission> =>
    await this.patch({
      resource: Resources.PERMISSIONS,
      params,
      id,
    });

  getPermissionGroups = async (): Promise<GetAllResponse<Group<App>>> =>
    await this.getList({
      resource: Resources.GROUPS,
      populate: [Populations.CHILDREN, 'apps'],
    });

  deletePermission = async ({ id }): Promise<Permission> =>
    await this.delete({
      resource: Resources.PERMISSIONS,
      id,
    });
}

export default new Api();
