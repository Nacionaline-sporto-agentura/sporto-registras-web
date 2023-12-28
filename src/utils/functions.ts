import { toast } from 'react-toastify';
import { User } from '../types';
import { RoleType } from './constants';
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

export const handleSuccessToast = (message: string) => {
  toast.success(message, {
    position: 'top-center',
    autoClose: 5000,
    hideProgressBar: true,
    closeOnClick: true,
    pauseOnHover: true,
  });
};

export const hasPermission = (user: User, roles: RoleType[]) => {
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

export const isSuperAdmin = (currentUserRole?: string) => currentUserRole === RoleType.SUPER_ADMIN;
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
