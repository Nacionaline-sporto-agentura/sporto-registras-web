import { isEmpty } from 'lodash';
import TableItem from '../components/tables/TableItem';
import { Group, SportBase, TableRow, Tenant, User } from '../types';
import { TenantTypes } from './constants';
import { slugs } from './routes';
import { roleLabels, tenantTypeLabels } from './texts';

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

export const mapOrganizationList = (tenants: Tenant[]): TableRow[] => {
  return tenants.map((tenant: Tenant) => {
    return {
      id: tenant.id,
      name: tenant.name,
      code: tenant.code,
      phone: tenant.phone,
      email: tenant.email,
      parentName: tenant?.parent && (
        <TableItem
          label={`${tenant?.parent?.name}${
            tenant?.parent?.tenantType === TenantTypes.MUNICIPALITY
              ? ` (${tenantTypeLabels.MUNICIPALITY})`
              : ''
          }`}
          url={
            tenant?.parent?.tenantType === TenantTypes.ORGANIZATION
              ? slugs.organizationUsers(tenant?.parent?.id || '')
              : slugs.institutionUsers(tenant?.parent?.id || '')
          }
        />
      ),
    };
  });
};

export const mapInstitutionList = (tenants: Tenant[]): TableRow[] => {
  return tenants.map((tenant: Tenant) => {
    return {
      id: tenant.id,
      name: tenant.name,
      code: tenant.code,
      phone: tenant.phone,
      email: tenant.email,

      type: tenantTypeLabels[tenant?.tenantType],
    };
  });
};
