import Axios, { AxiosInstance, AxiosResponse } from 'axios';
import { isEmpty, isFinite } from 'lodash';
import Cookies from 'universal-cookie';
import { GroupProps } from '../pages/GroupForm';
import { Group, Request, SportBase, Tenant, TypesAndFields } from '../types';
const cookies = new Cookies();

export enum Resources {
  LOGIN = 'auth/login',
  HISTORY = 'history',

  FILES_UPLOAD = 'api/files/upload',
  REFRESH_TOKEN = 'auth/refresh',
  E_GATES_LOGIN = 'auth/evartai/login',
  E_GATES_SIGN = 'auth/evartai/sign',
  VERIFY_USER = 'auth/verify',
  SET_PASSWORD = 'auth/accept',
  REMIND_PASSWORD = 'auth/remind',
  REQUESTS = 'api/requests',
  SPORT_BASES = 'api/sportsBases',
  SPORT_BASE_INVESTMENTS_SOURCES = 'api/sportsBases/investments/sources',
  TENANT_INVESTMENTS_SOURCES = 'api/tenants/fundingSources/types',
  LEVELS = 'api/sportsBases/levels',
  TECHNICAL_CONDITIONS = 'api/sportsBases/technicalConditions',
  TYPES = 'api/sportsBases/types',
  SPORT_TYPES = 'api/sportsBases/spaces/sportTypes',
  SPACE_TYPES = 'api/sportsBases/spaces/types',
  ENERGY_CLASSES = 'api/sportsBases/spaces/energyClasses',
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
  BUILDING_PURPOSES = '/api/sportsBases/spaces/buildingPurposes',
}

export enum Populations {
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

  getList = async ({ resource, page, pageSize, ...rest }: GetAllProps): Promise<any> => {
    const config = {
      params: {
        pageSize: pageSize || 10,
        page: page || 1,
        ...rest,
      },
    };

    return this.errorWrapper(() => this.axios.get(`/${resource}`, config));
  };

  getAll = async ({ resource, ...rest }: GetAllProps): Promise<any> => {
    const config = {
      params: {
        ...rest,
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

    return this.errorWrapper(() => this.axios.get(`/${resource}/${id ? `/${id}` : ''}`, config));
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

  getSportBases = async ({ page, query }: TableList) =>
    await this.getList({
      resource: Resources.SPORT_BASES,
      populate: [Populations.TYPE, Populations.LAST_REQUEST],
      sort: [SortDescFields.ID],
      page,
      query,
    });

  getNewRequests = async ({ page, query }: TableList) =>
    await this.getList({
      resource: Resources.REQUESTS + '/new',
      populate: [Populations.ENTITY],
      sort: [SortDescFields.ID],
      page,
      query,
    });

  getSportBase = async (id: string): Promise<SportBase> =>
    await this.getOne({
      resource: `${Resources.SPORT_BASES}/${id}/base`,
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
  getSportBaseTechnicalConditions = async ({ query, page, sort }: TableList) =>
    await this.getList({
      query,
      page,
      fields: ['id', 'name'],
      resource: Resources.TECHNICAL_CONDITIONS,
      sort,
    });

  getSportBaseTypes = async ({ query, page, sort }: TableList) =>
    await this.getList({
      query,
      page,
      fields: ['id', 'name'],
      resource: Resources.TYPES,
      sort,
    });

  getOrganizationBasis = async ({ query, page }) =>
    await this.getList({
      query,
      page,
      fields: ['id', 'name'],
      resource: Resources.ORGANIZATION_BASIS,
    });

  getSportBaseSpaceSportTypes = async ({ query, page, sort }: TableList) =>
    await this.getList({
      query,
      page,
      fields: ['id', 'name'],
      resource: Resources.SPORT_TYPES,
      sort,
    });

  getTenantSportOrganizationTypes = async ({ query, page, sort }: TableList) =>
    await this.getList({
      query,
      page,
      fields: ['id', 'name'],
      resource: Resources.SPORT_ORGANIZATION_TYPES,
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

  getSportBaseSpaceTypes = async ({ page, query, sort }: TableList) =>
    await this.getList({
      page,
      fields: ['id', 'name', 'type'],
      query,
      resource: Resources.SPACE_TYPES,
      sort,
    });

  getSportBaseSpaceEnergyClasses = async ({ page, query }: TableList) =>
    await this.getList({
      page,
      fields: ['id', 'name'],
      query,
      resource: Resources.ENERGY_CLASSES,
      sort: [SortAscFields.NAME],
    });

  getSportBaseSpaceBuildingPurposesTree = async () =>
    await this.getAll({
      fields: ['id', 'name', 'children'],
      populate: [Populations.CHILDREN],
      resource: Resources.BUILDING_PURPOSES,
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
}

export default new Api();
