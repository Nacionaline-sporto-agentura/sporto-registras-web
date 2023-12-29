import { slugs } from './routes';

export const getInternalTabs = () => [
  {
    label: 'Grupės',
    slug: slugs.groups,
  },
  {
    label: 'Naudotojai',
    slug: slugs.adminUsers,
  },
];
