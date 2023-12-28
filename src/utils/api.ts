import Axios, { AxiosInstance, AxiosResponse } from 'axios';
import Cookies from 'universal-cookie';
import { GroupProps } from '../pages/GroupForm';
import { Group } from '../types';
const cookies = new Cookies();

export enum Resources {
  LOGIN = '/auth/login',
  REFRESH_TOKEN = '/auth/refresh',
  E_GATES_LOGIN = 'auth/evartai/login',
  E_GATES_SIGN = 'auth/evartai/sign',
  VERIFY_USER = '/auth/change/verify',
  SET_PASSWORD = '/auth/change/accept',
  REMIND_PASSWORD = '/auth/remind',
  ADMINS = 'api/admins',
  GROUPS = 'api/groups',
}

export enum Populations {
  CHILDREN = 'children',
  PARENT = 'parent',
  GROUPS = 'groups',
}

export enum SortFields {
  NAME = `name`,
}

interface TableList<T = any> {
  filter?: T;
  page?: string;
  id?: string;
  pageSize?: string;
  isMy?: boolean;
  scope?: string;
  fields?: string[];
  resource?: Resources;
  search?: string;
}

interface GetAllProps {
  resource?: string;
  page?: string;
  populate?: string[];
  filter?: string;
  query?: string;
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
        if (token) {
          config.headers!.Authorization = 'Bearer ' + token;
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

    return this.errorWrapper(() => this.axios.get(`/${resource}/${id}`, config));
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
  authApi = async ({ resource, params }: AuthApiProps) => {
    return this.errorWrapper(() => this.axios.post(resource, params || {}));
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

  getUser = async ({ id }: { id: string }) => {
    return this.getOne({
      resource: Resources.ADMINS,
      populate: [Populations.GROUPS],
      id,
    });
  };

  deleteUser = async ({ id }: { id: string }) => {
    return this.delete({
      resource: Resources.ADMINS,
      id,
    });
  };

  getAdminUsers = async ({ filter, page }: TableList) => {
    return this.getList({
      resource: Resources.ADMINS,
      populate: [Populations.GROUPS],
      page,
      filter,
    });
  };

  createAdminUser = async ({ params }: { params: any }) => {
    return this.post({
      resource: Resources.ADMINS,
      params,
    });
  };

  getGroupsOptions = async () =>
    await this.getList({
      resource: Resources.GROUPS,
      populate: [Populations.CHILDREN],
      pageSize: '9999',
      sort: [SortFields.NAME],
    });

  getGroups = async ({ page, filter, id }: TableList) =>
    await this.getList({
      resource: Resources.GROUPS,
      page,
      filter,
      query: JSON.stringify({ parent: id }),
      populate: [Populations.CHILDREN],
      sort: [SortFields.NAME],
    });

  createGroup = async ({ params }: { params: GroupProps }): Promise<Group> =>
    await this.post({
      resource: Resources.GROUPS,
      params,
    });

  getGroup = async ({ id }: { id: string }): Promise<Group> => {
    return await this.getOne({
      resource: Resources.GROUPS,
      populate: [Populations.CHILDREN],
      id,
    });
  };

  updateGroup = async ({ params, id }: { params: GroupProps; id: string }): Promise<Group> =>
    await this.patch({
      resource: Resources.GROUPS,
      params,
      id,
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
      resource: `${Resources.GROUPS}/${id}/users`,
    });

  deleteGroup = async ({ id }) =>
    await this.getOne({
      id,
      resource: Resources.GROUPS,
    });
}

export default new Api();