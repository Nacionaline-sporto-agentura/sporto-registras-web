import GroupPage from '../pages/Group';
import GroupsFormPage from '../pages/GroupForm';
import GroupsList from '../pages/GroupList';
import InstitutionForm from '../pages/InstitutionForm';
import InstitutionList from '../pages/InstitutionList';
import Organization from '../pages/Organization';
import OrganizationForm from '../pages/OrganizationForm';
import OrganizationList from '../pages/OrganizationList';
import OrganizationUser from '../pages/OrganizationUser';
import Profile from '../pages/Profile';
import UserForm from '../pages/UserForm';
import UserList from '../pages/UserList';
import { useAppSelector } from '../state/hooks';
import { RoleType } from './constants';
import { pageTitles } from './texts';

export const slugs = {
  login: '/login',
  forgotPassword: '/pamirsau',
  resetPassword: '/atstatyti',
  invite: '/pakvietimas',
  profile: '/profilis',
  profiles: '/profiliai',
  adminUsers: '/vidiniai-naudotojai/naudotojai',
  newAdminUser: '/vidiniai-naudotojai/naudotojai/naujas',
  adminUser: (id: string) => `/vidiniai-naudotojai/naudotojai/${id}`,
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
  organizationUsers: (id: string) => `/organizacijos/${id}/nariai`,
  newOrganization: `/organizacijos/naujas`,
  users: '/organizacijos/naudotojai',
  newUser: (tenantId: string) => `/organizacijos/${tenantId}/nariai/naujas`,
  user: (tenantId: string, id: string) => `/organizacijos/${tenantId}/nariai/${id}`,
};

export const routes = [
  {
    name: 'Vidiniai naudotojai',
    slug: slugs.groups,
    sidebar: true,
    component: <GroupsList />,
    admin: true,
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
    slug: slugs.user(':tenantId', ':id'),
    component: <OrganizationUser />,
  },

  {
    slug: slugs.organizationUsers(':id'),
    component: <Organization />,
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
    slug: slugs.adminUsers,
    component: <UserList />,
    admin: true,
  },

  {
    slug: slugs.editGroup(':id'),
    component: <GroupsFormPage />,
    admin: true,
  },
  {
    slug: slugs.newGroup,
    component: <GroupsFormPage />,
    admin: true,
  },
  {
    slug: slugs.groupGroups(':id'),
    component: <GroupPage />,
    admin: true,
  },
  {
    slug: slugs.groupUsers(':id'),
    component: <GroupPage />,
    admin: true,
  },
  {
    slug: slugs.adminUser(':id'),
    component: <UserForm />,
    admin: true,
  },
  {
    slug: slugs.profile,
    component: <Profile />,
  },
];

export const useFilteredRoutes = () => {
  const user = useAppSelector((state) => state.user.userData);

  return routes.filter((route) => {
    if (route.admin) {
      return user.type === RoleType.ADMIN;
    }

    return true;
  });
};
