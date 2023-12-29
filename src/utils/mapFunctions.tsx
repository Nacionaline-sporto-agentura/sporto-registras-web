import { isEmpty } from 'lodash';
import { Group, TableRow, User } from '../types';
import { roleLabels } from './texts';

export const mapGroupList = (groups: Group[]): TableRow[] => {
  return groups.map((group: Group) => {
    return {
      id: group.id,
      name: group.name,
      ...(!isEmpty(group.children) && {
        children: mapGroupList(group.children!),
      }),
    };
  });
};

export const mapGroupUsersList = (users: User[]): TableRow[] =>
  users.map((user: User) => {
    return {
      id: user.id,
      name: user.fullName,
      role: user?.role ? roleLabels[user?.role] : '-',
      phone: user.phone,
      email: user.email,
    };
  });
