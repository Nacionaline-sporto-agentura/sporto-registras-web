import Axios, { AxiosInstance, AxiosResponse } from 'axios';
import Cookies from 'universal-cookie';
const cookies = new Cookies();

export enum Resources {
  LOGIN = '/auth/login',
  REFRESH_TOKEN = '/auth/refresh',
  VERIFY_USER = '/auth/change/verify',
  SET_PASSWORD = '/auth/change/accept',
  REMIND_PASSWORD = '/auth/remind',
}

interface GetAllProps {
  resource: string;
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

  update = async ({ resource, id, params }: Update) => {
    return this.errorWrapper(() => this.axios.patch(`/${resource}/${id}`, params));
  };

  delete = async ({ resource, id, params }: Delete) => {
    return this.errorWrapper(() =>
      this.axios.delete(`/${resource}/${id}`, {
        data: params,
      }),
    );
  };

  create = async ({ resource, params }: Create) => {
    return this.errorWrapper(() => this.axios.post(`/${resource}`, params));
  };
  authApi = async ({ resource, params }: AuthApiProps) => {
    return this.errorWrapper(() => this.axios.post(resource, params || {}));
  };

  checkAuth = async () => {
    return this.errorWrapper(() => this.axios.get('/users/me'));
  };

  logout = async () => {
    return this.errorWrapper(() => this.axios.post('/users/logout'));
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

  setPassword = async (params: { h: string; s: string; password: string }): Promise<any> => {
    return this.authApi({
      resource: Resources.SET_PASSWORD,
      params,
    });
  };
}

export default new Api();
