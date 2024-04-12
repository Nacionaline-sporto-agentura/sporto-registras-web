import AdminUserForm from '../pages/AdminUserForm';
import AdminUserList from '../pages/AdminUserList';
import GroupPage from '../pages/Group';
import GroupsFormPage from '../pages/GroupForm';
import GroupsList from '../pages/GroupList';
import InstitutionPage from '../pages/Institution';
import { default as InstitutionForm } from '../pages/InstitutionForm';
import InstitutionList from '../pages/InstitutionList';
import MyOrganization from '../pages/MyOrganization';
import Organization from '../pages/Organization';
import OrganizationForm from '../pages/OrganizationForm';
import OrganizationList from '../pages/OrganizationList';
import OrganizationUser from '../pages/OrganizationUser';
import Profile from '../pages/Profile';
import SportBase from '../pages/SportBase';
import SportBaseList from '../pages/SportBaseList';
import UpdateInstitutionForm from '../pages/UpdateInstitutionForm';
import UpdateOrganizationForm from '../pages/UpdateOrganizationForm';
import UserFormPage from '../pages/UserForm';
import UserList from '../pages/UserList';
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
  institutionUser: (tenantId: string, id: string) => `/istaigos/${tenantId}/nariai/${id}`,
  updateInstitution: (id: string) => `/istaigos/${id}/atnaujinti`,
  newInstitutions: `/istaigos/naujas`,
  organizations: `/organizacijos`,
  organization: (id: string) => `/organizacijos/${id}`,
  updateOrganization: (id: string) => `/organizacijos/${id}/atnaujinti`,
  organizationUsers: (id: string) => `/organizacijos/${id}/nariai`,
  newOrganization: `/organizacijos/naujas`,
  myOrganization: `/mano-organizacija`,
  users: '/naudotojai',
  newUser: `/naudotojai/naujas`,
  newOrganizationUser: (tenantId: string) => `/organizacijos/${tenantId}/nariai/naujas`,
  organizationUser: (tenantId: string, id: string) => `/organizacijos/${tenantId}/nariai/${id}`,
  user: (id: string) => `/naudotojai/${id}`,
  sportBases: '/sporto-infrastruktura',
  unConfirmedSportBases: '/nepatvirtinta-sporto-infrastruktura',
  newSportBase: '/sporto-bazes/naujas',
  sportBase: (id: string) => `/sporto-bazes/${id}`,
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
    name: pageTitles.organizations,
    slug: slugs.organizations,
    sidebar: true,
    component: <OrganizationList />,
  },

  {
    name: pageTitles.myOrganization,
    slug: slugs.myOrganization,
    sidebar: true,
    role: AdminRoleType.USER,
    component: <MyOrganization />,
  },

  {
    name: pageTitles.users,
    role: AdminRoleType.USER,
    sidebar: true,
    slug: slugs.users,
    component: <UserList />,
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
    slug: slugs.newOrganization,
    component: <OrganizationForm />,
  },
  {
    slug: slugs.adminUsers,
    component: <AdminUserList />,
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
    slug: slugs.sportBase(':id'),
    component: <SportBase />,
  },
  {
    name: pageTitles.sportBases,
    sidebar: true,
    slug: slugs.sportBases,
    component: <SportBaseList />,
  },
  {
    slug: slugs.unConfirmedSportBases,
    component: <SportBaseList />,
  },
  {
    role: AdminRoleType.USER,
    slug: slugs.user(':id'),
    component: <UserFormPage />,
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
      select = !!user?.type && user?.type === route?.role;
    }

    if (select && route.appType) {
      select = !!user?.permissions?.[route.appType];
    }

    return select;
  });
};
