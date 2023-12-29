import GroupPage from '../pages/Group';
import GroupsFormPage from '../pages/GroupForm';
import GroupsList from '../pages/GroupList';
import InstitutionForm from '../pages/InstitutionForm';
import InstitutionList from '../pages/InstitutionList';
import OrganizationForm from '../pages/OrganizationForm';
import OrganizationList from '../pages/OrganizationList';
import Profile from '../pages/Profile';
import UserForm from '../pages/UserForm';
import UserList from '../pages/UserList';
import { pageTitles } from './texts';

export const slugs = {
  login: '/login',
  forgotPassword: '/pamirsau',
  resetPassword: '/atstatyti',
  invite: '/pakvietimas',
  profile: '/profilis',
  users: '/vidiniai-naudotojai/naudotojai',
  newUser: '/vidiniai-naudotojai/naudotojai/naujas',
  user: (id: string) => `/vidiniai-naudotojai/naudotojai/${id}`,
  groupGroups: (id: string) => `/vidiniai-naudotojai/grupes/${id}/grupes`,
  group: (id: string) => `/vidiniai-naudotojai/grupes/${id}`,
  groups: '/vidiniai-naudotojai/grupes',
  newGroup: `/vidiniai-naudotojai/grupes/naujas`,
  editGroup: (id: string) => `/vidiniai-naudotojai/grupes/${id}/redaguoti`,
  groupUsers: (id: string) => `/vidiniai-naudotojai/grupes/${id}/nariai`,
  institutions: `/istaigos`,
  institution: (id: string) => `/istaigos/${id}`,
  newInstitutions: `/istaigos/naujas`,
  organizations: `/organizacijos`,
  organization: (id: string) => `/organizacijos/${id}`,
  newOrganization: `/organizacijos/naujas`,
};

export const routes = [
  {
    name: 'Vidiniai naudotojai',
    slug: slugs.groups,
    sidebar: true,
    component: <GroupsList />,
  },
  {
    name: pageTitles.institutions,
    slug: slugs.institutions,
    sidebar: true,
    component: <InstitutionList />,
  },
  {
    slug: slugs.newInstitutions,
    component: <InstitutionForm />,
  },
  {
    name: pageTitles.organizations,
    slug: slugs.organizations,
    sidebar: true,
    component: <OrganizationList />,
  },
  {
    slug: slugs.newOrganization,
    component: <OrganizationForm />,
  },
  {
    slug: slugs.users,
    component: <UserList />,
  },

  {
    slug: slugs.editGroup(':id'),
    component: <GroupsFormPage />,
  },
  {
    slug: slugs.newGroup,
    component: <GroupsFormPage />,
  },
  {
    slug: slugs.groupGroups(':id'),
    component: <GroupPage />,
  },
  {
    slug: slugs.groupUsers(':id'),
    component: <GroupPage />,
  },
  {
    slug: slugs.user(':id'),
    component: <UserForm />,
  },
  {
    slug: slugs.profile,
    component: <Profile />,
  },
];
