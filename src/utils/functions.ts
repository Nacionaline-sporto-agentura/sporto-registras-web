import { format } from 'date-fns';
import { toast } from 'react-toastify';
import wkx from 'wkx';
import { ActionTypes } from '../components/other/HistoryContainer';
import { Address, Result, User } from '../types';
import api, { SortAscFields } from './api';
import { AdminRoleType, ResultTypeTypes } from './constants';
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
  page: any;
  pageSize: number;
}

export const getErrorMessage = (error: string) => validationTexts[error] || validationTexts.error;

export const getReactQueryErrorMessage = (error: any) => error?.response?.data?.type;

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
  const query = {
    query: { name: getIlike(input), ...additionalQuery },
    page,
  };
  return query;
};

export const getSportsPersonQuery = (filter: any = {}) => {
  const query: any = {};

  if (filter.sportsPerson) {
    query.sportsPerson = filter.sportsPerson.id;
  }

  return query;
};

const getInputSimpleFilter = (input, page, additionalQuery?: any) => {
  return { ...getSimpleFilter(input, page, additionalQuery), sort: [SortAscFields.NAME] };
};

export const getSportBaseTypeList = async (name: string, page: number) => {
  return await api.getSportBaseTypes(getInputSimpleFilter(name, page));
};

export const getSportBaseSourcesList = async (input: string, page: any, query: any) => {
  return await api.getSportBaseSources(getInputSimpleFilter(input, page, query));
};

export const getTenantSourcesList = async (input: string, page: any) => {
  return await api.getTenantSources(getInputSimpleFilter(input, page));
};

export const getSportBaseLevelsList = async (input: string, page: any) => {
  return await api.getSportBaseLevels(getInputSimpleFilter(input, page));
};

export const getSportBaseTechnicalConditionList = async (input: string, page: any) => {
  return await api.getSportBaseTechnicalConditions(getInputSimpleFilter(input, page));
};

export const getSportBaseTypesList = async (input: string, page: any) => {
  return await api.getSportBaseTypes(getInputSimpleFilter(input, page));
};

export const getOrganizationBasisList = async (input: string, page: any) => {
  return await api.getOrganizationBasis(getInputSimpleFilter(input, page));
};

export const getWorkRelationsList = async (input: string, page: any) => {
  return await api.getWorkRelations(getInputSimpleFilter(input, page));
};

export const getOrganizationsList = async (input: string, page: any) => {
  return await api.getOrganizations(getInputSimpleFilter(input, page));
};

export const getEducationalCompaniesList = async (input: string, page: any) => {
  return await api.getEducationalCompanies(getInputSimpleFilter(input, page));
};

export const getQualificationCategoriesList = async (input: string, page: any) => {
  return await api.getQualificationCategories(getInputSimpleFilter(input, page));
};

export const getStudyProgramList = async (input: string, page: any, query: any) => {
  return await api.getStudyPrograms(getInputSimpleFilter(input, page, query));
};

export const getStudyCompanyList = async (input: string, page: any) => {
  return await api.getStudyCompanies(getInputSimpleFilter(input, page));
};

export const getSportBasesList = async (input: string, page: any, query: any) => {
  return await api.getSportsBases(getInputSimpleFilter(input, page, query));
};

export const getSportBaseSpaceTypesList = async (input: string, page: any, query) => {
  return await api.getSportsBaseSpaceTypes(getInputSimpleFilter(input, page, query));
};

export const getSportBaseSpaceGroupsList = async (input: string, page: any) => {
  return await api.getSportBaseSpaceGroups(getInputSimpleFilter(input, page));
};

export const getTenantSportOrganizationTypeList = async (input: string, page: any) => {
  return await api.getTenantSportOrganizationTypes(getInputSimpleFilter(input, page));
};

export const getTenantLegalFormList = async (input: string, page: any) => {
  return await api.getTenantLegalForms(getInputSimpleFilter(input, page));
};

export const getSportTypesList = async (input: string, page: any) => {
  return await api.getSportTypes(getInputSimpleFilter(input, page));
};

export const getDisqualificationReasons = async (input: string, page: any) => {
  return await api.getDisqualificationReasons(getInputSimpleFilter(input, page));
};

export const getSportsPersonList = async (input: string, page: any, query?: any) => {
  return await api.getListSportsPersons(getInputSimpleFilter(input, page, query));
};
export const getRcObjects = async (
  input: string,
  page: any,
  query?: {
    streetCode: string | number;
    plotOrBuildingNumber: string | number;
    roomNumber?: string | number;
  },
) => {
  return await api.getRcObjects({
    search: input,
    page,
    ...query,
  });
};

export const getRentsUnitList = async (input: string, page: any) => {
  return await api.getRentsUnits(getInputSimpleFilter(input, page));
};

export const getScholarshipReasonList = async (input: string, page: any) => {
  return await api.getScholarshipReasons(getInputSimpleFilter(input, page));
};

export const getCompetitionTypesList = async (input: string, page: any) => {
  return await api.getCompetitionTypes(getInputSimpleFilter(input, page));
};

export const getNationalTeamAgeGroups = async (input: string, page: any) => {
  return await api.getNationalTeamAgeGroups(getInputSimpleFilter(input, page));
};

export const getNationalTeamGenders = async (input: string, page: any) => {
  return await api.getNationalTeamGenders(getInputSimpleFilter(input, page));
};

export const formatDate = (date?: string | Date) =>
  date ? format(new Date(date), 'yyyy-MM-dd') : '-';
export const formatDateAndTime = (datetime: Date | string) =>
  datetime ? format(new Date(datetime), 'yyyy-MM-dd HH:mm') : '-';

const env = import.meta.env;

export const getPublicUrl = (url: string) => `${env.VITE_BASE_URL}/${url}`;

export const generateUniqueString = () => {
  const timestamp = new Date().getTime().toString(36);
  const randomString = Math.random().toString(36).substr(2, 5);
  return timestamp + randomString;
};

export const processDiffs = (diffs, idKeys, index, obj) => {
  for (const key of diffs) {
    const pathArr = key.path.split('/');
    const prop = pathArr.pop() || '';
    const parentPath = pathArr.join('/');
    const item = key;

    const actionType = item.op === ActionTypes.TEST ? 'oldValue' : 'value';
    const currentOperation = item.op !== ActionTypes.TEST ? item.op : undefined;
    const isParentPath = !!idKeys[parentPath];
    const path = isParentPath ? parentPath : item.path;
    const curr = obj[path]?.[index];
    const entry = {
      path,
      op: curr?.op || currentOperation,
      oldValue: isParentPath ? { ...(curr?.oldValue || {}) } : curr?.oldValue,
      value: isParentPath ? { ...(curr?.value || {}) } : curr?.value,
    };

    if (idKeys[parentPath]) {
      entry[actionType][prop] = item.value;
    } else {
      entry[actionType] = item.value;
    }

    if (index !== 0 && (!obj[path] || !obj[path][0])) {
      // If the 0 index element doesn't exist, don't create the 1 index element
      continue;
    }

    if (idKeys[parentPath]) {
      obj[parentPath] = obj[parentPath] || [];
      obj[parentPath][index] = entry;
    } else {
      obj[item.path] = obj[item.path] || [];
      obj[item.path][index] = entry;
    }
  }
};

export const extractIdKeys = (diff, idKeys) => {
  for (const key of diff) {
    if (key.path.endsWith('/id')) {
      const parentPath = key.path.replace('/id', '');
      idKeys[parentPath] = 1;
    }
  }
};

export const flattenArrays = (data: any): any => {
  if (Array.isArray(data)) {
    const obj: any = {};
    data.forEach((item, index) => {
      obj[index] = flattenArrays(item);
    });
    return obj;
  } else if (typeof data === 'object' && data !== null) {
    for (let key in data) {
      data[key] = flattenArrays(data[key]);
    }
  }
  return data;
};

export const filterAndUpdateTypes = (existingTypes, newTypes, currentValues, updateCallback) => {
  const filteredTypes = {};

  // Filter existing types based on new types
  Object.entries(existingTypes).forEach(([key, type]: any) => {
    const found = newTypes.find((c) => c.id === type.id);
    if (found) {
      filteredTypes[key] = type;
    }
  });

  // Add new types that are not already in current values
  newTypes.forEach((type) => {
    if (currentValues.every((value) => value.id !== type.id)) {
      filteredTypes[generateUniqueString()] = type;
    }
  });

  // Invoke the update callback with the filtered types
  updateCallback(filteredTypes);
};

export const getFullName = (user) => `${user?.firstName || '-'} ${user?.lastName || '-'}`;

export const getResultLabel = (competitionResult?: Result) => {
  const resultType = competitionResult?.resultType?.type;

  const label =
    resultType === ResultTypeTypes.RANGE
      ? `${competitionResult?.result?.value?.from} - ${competitionResult?.result?.value?.to}`
      : resultType === ResultTypeTypes.NUMBER
      ? competitionResult?.result?.value
      : '-';

  return label;
};

export const getBonusResultLabel = (competitionResult?: Result) => {
  const resultType = competitionResult?.resultType?.type;
  const competition = competitionResult?.competition;

  const resultLabel =
    resultType === ResultTypeTypes.RANGE
      ? `${competitionResult?.result?.value?.from} - ${competitionResult?.result?.value?.to} vt.`
      : resultType === ResultTypeTypes.NUMBER
      ? `${competitionResult?.result?.value} vt.`
      : '-';

  return `${competition?.name}, ${competition?.year}, ${resultLabel}`;
};

export const getFormattedAddress = (address: Address): string => {
  if (
    address?.street?.name &&
    address?.house?.plot_or_building_number &&
    address?.city?.name &&
    address?.municipality?.name
  ) {
    const apartment = address?.apartment?.room_number ? ` ${address.apartment.room_number}` : '';
    return `${address.street.name} ${address.house.plot_or_building_number} ${apartment}, ${address.city.name} ${address.municipality.name}`;
  }

  return '-';
};

export const wkbToGeoJSON = (wkbString: string) => {
  const geometry = wkx.Geometry.parse(wkbString).toGeoJSON();
  return {
    type: 'FeatureCollection',
    features: [
      {
        type: 'Feature',
        geometry: geometry,
      },
    ],
  };
};

export const getResult = (result) => {
  return result.resultType === ResultTypeTypes.RANGE
    ? `${result?.value?.from} - ${result?.value?.to}`
    : result.resultType === ResultTypeTypes.NUMBER
    ? result?.value
    : '-';
};
