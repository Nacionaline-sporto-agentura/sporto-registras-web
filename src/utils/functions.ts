import { format } from 'date-fns';
import { toast } from 'react-toastify';
import { User } from '../types';
import api, { SortAscFields } from './api';
import { AdminRoleType } from './constants';
import { url, validationTexts } from './texts';

export interface Path {
  id: string;
  name: string;
}

export interface PathProps {
  item: any;
  path?: Path[];
}

interface HandlePaginationProps {
  data: any[];
  page: string;
  pageSize: number;
}

export const getErrorMessage = (error: string) => validationTexts[error] || validationTexts.error;

export const getReactQueryErrorMessage = (response: any) => response?.data?.message;

export const handleErrorToast = (message: string) => {
  toast.error(message, {
    position: 'top-center',
    autoClose: 5000,
    hideProgressBar: true,
    closeOnClick: true,
  });
};

export const handleErrorToastFromServer = (responseError: string = 'error') => {
  handleErrorToast(getErrorMessage(getReactQueryErrorMessage(responseError)));
};

export const handleSuccessToast = (message = 'Atnaujinta') => {
  toast.success(message, {
    position: 'top-center',
    autoClose: 5000,
    hideProgressBar: true,
    closeOnClick: true,
    pauseOnHover: true,
  });
};

export const hasPermission = (user: User, roles: AdminRoleType[]) => {
  return user.type && roles.includes(user.type);
};

export const isCurrentUser = (userId?: string, currentUserId?: string) => {
  return userId === currentUserId?.toString();
};

export const isNew = (id: string | undefined) => {
  return !id || id === url.new;
};

export const canManageGroup = (parent?: string, currentUserRole?: string) => {
  return !!parent || isSuperAdmin(currentUserRole);
};

export const isSuperAdmin = (currentUserRole?: string) =>
  currentUserRole === AdminRoleType.SUPER_ADMIN;
export const handleGenerateBreadcrumbsPath = ({
  item,
  path = [],
}: PathProps): { id: string; name: string }[] | undefined => {
  if (!item?.id || !item?.name) return;

  if (!item.parent) {
    path.push({ id: item.id, name: item.name });
    return path;
  } else {
    handleGenerateBreadcrumbsPath({ item: item.parent, path });
    path.push({ id: item.id, name: item.name });
    return path;
  }
};

export const handlePagination = ({ data, page = '1', pageSize }: HandlePaginationProps) => {
  const start = (parseInt(page) - 1) * pageSize;
  const end = parseInt(page) * pageSize;
  const totalPages = Math.ceil(data.length / pageSize);
  const slicedData = data.slice(start, end);

  return { totalPages, slicedData };
};

export const filterOutGroup = (items?: any[], id?: string): any => {
  if (isNew(id)) return items;

  if (!items) return [];

  items.forEach((group: { id: string; children: any[]; [key: string]: any }, index: number) => {
    if (group.id == id) {
      items.splice(index, 1);
    }
    if (group.children) {
      filterOutGroup(group.children, id);
    }
  });

  return items;
};

export const getIlike = (input?: string) => (!!input ? { $ilike: `%${input}%` } : undefined);

export const getSimpleFilter = (input, page, additionalQuery?: any) => {
  return {
    query: { name: getIlike(input), ...additionalQuery },
    page,
  };
};

const getInputSimpleFilter = (input, page, additionalQuery?: any) => {
  return { ...getSimpleFilter(input, page, additionalQuery), sort: [SortAscFields.NAME] };
};

export const getSportBaseTypeList = async (name: string, page: number) => {
  return await api.getSportBaseTypes(getInputSimpleFilter(name, page));
};

export const getSportBaseSourcesList = async (input: string, page: string, query: any) => {
  return await api.getSportBaseSources(getInputSimpleFilter(input, page, query));
};

export const getTenantSourcesList = async (input: string, page: string) => {
  return await api.getTenantSources(getInputSimpleFilter(input, page));
};

export const getSportBaseLevelsList = async (input: string, page: string) => {
  return await api.getSportBaseLevels(getInputSimpleFilter(input, page));
};

export const getSportBaseTechnicalConditionList = async (input: string, page: string) => {
  return await api.getSportBaseTechnicalConditions(getInputSimpleFilter(input, page));
};

export const getSportBaseTypesList = async (input: string, page: string) => {
  return await api.getSportBaseTypes(getInputSimpleFilter(input, page));
};

export const getOrganizationBasisList = async (input: string, page: string) => {
  return await api.getOrganizationBasis(getInputSimpleFilter(input, page));
};

export const getSportBaseSpaceTypesList = async (input: string, page: string) => {
  return await api.getSportBaseSpaceTypes(getInputSimpleFilter(input, page));
};

export const getSportBaseSpaceEnergyClassList = async (input: string, page: string) => {
  return await api.getSportBaseSpaceEnergyClasses(getInputSimpleFilter(input, page));
};

export const getTenantSportOrganizationTypeList = async (input: string, page: string) => {
  return await api.getTenantSportOrganizationTypes(getInputSimpleFilter(input, page));
};

export const getTenantLegalFormList = async (input: string, page: string) => {
  return await api.getTenantLegalForms(getInputSimpleFilter(input, page));
};

export const getSportBaseSpaceSportTypesList = async (input: string, page: string) => {
  return await api.getSportBaseSpaceSportTypes(getInputSimpleFilter(input, page));
};

export const formatDate = (date: string | Date) => format(new Date(date), 'yyyy-MM-dd');
export const formatDateAndTime = (datetime: Date | string) =>
  datetime ? format(new Date(datetime), 'yyyy-MM-dd HH:mm') : '-';

const env = import.meta.env;

export const getPublicUrl = (url: string) => `${env.VITE_BASE_URL}/${url}`;
