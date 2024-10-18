import { slugs } from './routes';
import { AdminRoleType } from './constants';

export const getInternalTabs = (role) => {
  const allTabs = [
    {
      label: 'Grupės',
      slug: slugs.groups,
      condition: [AdminRoleType.ADMIN, AdminRoleType.SUPER_ADMIN],
    },
    {
      label: 'Naudotojai',
      slug: slugs.adminUsers,
      condition: [AdminRoleType.ADMIN, AdminRoleType.SUPER_ADMIN],
    },
    {
      label: 'Teisės',
      slug: slugs.permissions,
      condition: [AdminRoleType.SUPER_ADMIN],
    },
  ];

  return allTabs.filter((tab) => tab.condition?.some((adminRole) => adminRole === role));
};
