import AdminUserForm from '../pages/AdminUserForm';
import GroupPage from '../pages/Group';
import GroupsFormPage from '../pages/GroupForm';
import GroupsList from '../pages/GroupList';
import InstitutionPage from '../pages/Institution';
import { default as InstitutionForm, default as UserForm } from '../pages/InstitutionForm';
import InstitutionList from '../pages/InstitutionList';
import Organization from '../pages/Organization';
import OrganizationForm from '../pages/OrganizationForm';
import OrganizationList from '../pages/OrganizationList';
import OrganizationUser from '../pages/OrganizationUser';
import Profile from '../pages/Profile';
import UpdateInstitutionForm from '../pages/UpdateInstitutionForm';
import UpdateOrganizationForm from '../pages/UpdateOrganizationForm';
import UserList from '../pages/UserList';
import Users from '../pages/Users';
import { useAppSelector } from '../state/hooks';
import { AdminRoleType, Apps } from './constants';
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
  institutionUsers: (id: string) => `/istaigos/${id}/nariai`,
  institutionUser: (tenantId: string, id: string) => `/organizacijos/${tenantId}/nariai/${id}`,
  updateInstitution: (id: string) => `/istaigos/${id}/atnaujinti`,
  newInstitutions: `/istaigos/naujas`,
  organizations: `/organizacijos`,
  organization: (id: string) => `/organizacijos/${id}`,
  updateOrganization: (id: string) => `/organizacijos/${id}/atnaujinti`,
  organizationUsers: (id: string) => `/organizacijos/${id}/nariai`,
  newOrganization: `/organizacijos/naujas`,
  users: '/naudotojai',
  newUser: (tenantId: string) => `/organizacijos/${tenantId}/nariai/naujas`,
  organizationUser: (tenantId: string, id: string) => `/organizacijos/${tenantId}/nariai/${id}`,
  user: (id: string) => `/naudotojai/${id}`,
};

export const routes = [
  {
    name: 'Vidiniai naudotojai',
    slug: slugs.groups,
    sidebar: true,
    component: <GroupsList />,
    role: AdminRoleType.ADMIN,
    appType: Apps.USERS,
  },
  {
    name: pageTitles.institutions,
    slug: slugs.institutions,
    sidebar: true,
    component: <InstitutionList />,
    role: AdminRoleType.ADMIN,
  },
  {
    slug: slugs.newInstitutions,
    component: <InstitutionForm />,
    role: AdminRoleType.ADMIN,
  },
  {
    slug: slugs.organizationUser(':tenantId', ':id'),
    component: <OrganizationUser />,
  },

  {
    slug: slugs.organizationUsers(':id'),
    component: <Organization />,
  },
  {
    slug: slugs.institutionUsers(':id'),
    component: <InstitutionPage />,
    role: AdminRoleType.ADMIN,
  },
  {
    slug: slugs.institutionUser(':tenantId', ':id'),
    component: <OrganizationUser />,
    role: AdminRoleType.ADMIN,
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
    role: AdminRoleType.ADMIN,
  },

  {
    slug: slugs.editGroup(':id'),
    component: <GroupsFormPage />,
    role: AdminRoleType.ADMIN,
    appType: Apps.USERS,
  },
  {
    slug: slugs.newGroup,
    component: <GroupsFormPage />,
    role: AdminRoleType.ADMIN,
    appType: Apps.USERS,
  },
  {
    slug: slugs.groupGroups(':id'),
    component: <GroupPage />,
    role: AdminRoleType.ADMIN,
    appType: Apps.USERS,
  },
  {
    slug: slugs.groupUsers(':id'),
    component: <GroupPage />,
    role: AdminRoleType.ADMIN,
    appType: Apps.USERS,
  },
  {
    slug: slugs.adminUser(':id'),
    component: <AdminUserForm />,
    role: AdminRoleType.ADMIN,
    appType: Apps.USERS,
  },
  {
    slug: slugs.profile,
    component: <Profile />,
  },
  {
    name: pageTitles.users,
    role: AdminRoleType.USER,
    sidebar: true,
    slug: slugs.users,
    component: <Users />,
  },

  {
    role: AdminRoleType.USER,
    slug: slugs.user(':id'),
    component: <UserForm />,
  },
  {
    slug: slugs.updateInstitution(':id'),
    role: AdminRoleType.ADMIN,
    component: <UpdateInstitutionForm />,
  },
  {
    slug: slugs.updateOrganization(':id'),
    component: <UpdateOrganizationForm />,
  },
];

export const useFilteredRoutes = () => {
  const user = useAppSelector((state) => state.user.userData);

  return routes.filter((route) => {
    let select = true;

    if (route.role) {
      select = user.type === route.role;
    }
    if (route.appType) {
      select = !!user?.permissions?.[route.appType];
    }

    return select;
  });
};
