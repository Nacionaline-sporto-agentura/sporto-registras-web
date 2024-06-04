import { isEmpty, map } from 'lodash';
import { UnconfirmedRequestFilters, UnconfirmedRequestFiltersProps } from '../../../types';
import api from '../../../utils/api';
import { StatusTypes } from '../../../utils/constants';
import { requestStatusLabels } from '../../../utils/texts';
import { ActionTypes } from '../../other/HistoryContainer';

export const getRequestStatusTypes = () =>
  map(StatusTypes, (Status) => ({
    id: Status,
    label: requestStatusLabels[Status],
  }));

export const getFilteredOptions = (
  options: any[],
  input: string,
  getOptionLabel: (option: any) => string,
) =>
  options?.filter((option) => {
    const label = getOptionLabel(option)?.toString().toLowerCase();
    return label?.includes(input.toLowerCase());
  });

export const filterSelectedOptions = (suggestions: any[], values: any[], getOptionValue) =>
  suggestions.filter(
    (opt) => !values?.some((value) => getOptionValue(value) === getOptionValue(opt)),
  );

export const handleRemove = (index: number, onChange, values: any[]) => {
  if (isEmpty(values)) return;

  onChange([...values.slice(0, index), ...values.slice(index + 1)]);
};

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

export const mapRequestFormFilters = (
  filters: UnconfirmedRequestFilters,
): UnconfirmedRequestFiltersProps => {
  let params: UnconfirmedRequestFiltersProps = {};

  !!filters?.status &&
    !isEmpty(filters.status) &&
    (params.status = { $in: filters.status.map((state) => state.id) });

  return params;
};
