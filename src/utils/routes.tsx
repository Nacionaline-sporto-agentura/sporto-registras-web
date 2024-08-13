import AdminUserForm from '../pages/AdminUserForm';
import AdminUserList from '../pages/AdminUserList';
import BonusesList from '../pages/BonusesList';
import BonusForm from '../pages/BonusForm';
import Classifier from '../pages/Classifier';
import ClassifierList from '../pages/ClassifierList';
import CompetitionPage from '../pages/Competition';
import CompetitionList from '../pages/CompetitionList';
import GroupPage from '../pages/Group';
import GroupsFormPage from '../pages/GroupForm';
import GroupsList from '../pages/GroupList';
import InstitutionPage from '../pages/Institution';
import { default as InstitutionForm } from '../pages/InstitutionForm';
import InstitutionList from '../pages/InstitutionList';
import MyOrganization from '../pages/MyOrganization';
import NationalTeamPage from '../pages/NationalTeam';
import NationalTeamsList from '../pages/NationalTeamsList';
import Organization from '../pages/Organization';
import OrganizationForm from '../pages/OrganizationForm';
import OrganizationList from '../pages/OrganizationList';
import OrganizationUser from '../pages/OrganizationUser';
import Profile from '../pages/Profile';
import RentForm from '../pages/RentForm';
import RentsList from '../pages/RentsList';
import ScholarshipForm from '../pages/ScholarshipForm';
import ScholarshipsList from '../pages/ScholarshipsList';
import SportBaseList from '../pages/SportBaseList';
import SportBaseSpaceGroup from '../pages/SportBaseSpaceGroup';
import SportBaseSpaceGroupForm from '../pages/SportBaseSpaceGroupForm';
import SportBase from '../pages/SportsBase';
import SportsPersonPage from '../pages/SportsPerson';
import SportsPersonsList from '../pages/SportsPersonsList';
import SportTypePage from '../pages/SportType';
import SportTypeForm from '../pages/SportTypeForm';
import UpdateInstitutionForm from '../pages/UpdateInstitutionForm';
import UserFormPage from '../pages/UserForm';
import UserList from '../pages/UserList';
import { useAppSelector } from '../state/hooks';
import { AdminRoleType, Apps } from './constants';
import { useGetCurrentProfile } from './hooks';
import { pageTitles, url } from './texts';

const env = import.meta.env;

export const slugs = {
  cantLogin: '/negalima_jungtis',
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
  unConfirmedOrganization: (id: string) => `/organizaciju-prasymai/${id}`,
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
  sportsBases: '/sporto-infrastruktura',
  unConfirmedSportBases: '/nepatvirtinta-sporto-infrastruktura',
  newSportBase: '/sporto-bazes/naujas',
  sportsBase: (id: string) => `/sporto-bazes/${id}`,
  sportsPersons: '/sporto-asmenys',
  unConfirmedSportsPersons: '/nepatvirtinti-sporto-asmenys',
  newSportsPerson: '/sporto-asmenys/naujas',
  sportsPerson: (id: string) => `/sporto-asmenys/${id}`,
  classifiers: (classifier: string) => `/klasifikatoriai/${classifier}`,
  newClassifier: (classifier: string) => `/klasifikatoriai/${classifier}/${url.new}`,
  classifier: (classifier: string, id: string) => `/klasifikatoriai/${classifier}/${id}`,
  newSportType: `/klasifikatoriai/sporto_saka/${url.new}`,
  sportType: (id: string) => `/klasifikatoriai/sporto_saka/${id}`,
  updateSportType: (id: string) => `/klasifikatoriai/sporto_saka/${id}/atnaujinti`,
  result: (id: string) => `/rezultatai/${id}`,
  results: '/rezultatai',
  newResult: `/rezultatai/${url.new}`,
  sportPerson: '/sporto-asmenys/naujas',
  unconfirmedResults: '/nepatvirtinti-rezultatai',
  bonuses: '/premijos',
  newBonus: `/premijos/naujas`,
  bonus: (id: string) => `/premijos/${id}`,
  scholarships: '/stipendijos',
  newScholarships: `/stipendijos/naujas`,
  scholarship: (id: string) => `/stipendijos/${id}`,
  rents: '/rentos',
  newRent: `/rentos/naujas`,
  rent: (id: string) => `/rentos/${id}`,
  nationalTeams: '/nacionalines-rinktines',
  unConfirmedNationalTeams: '/nepatvirtintos-nacionalines-rinktines',
  newNationalTeam: '/nacionalines-rinktines/naujas',
  nationalTeam: (id: string) => `/nacionalines-rinktines/${id}`,
  newSportsBaseSpaceGroup: `/klasifikatoriai/sporto_bazes_erdves_rusis/${url.new}`,
  sportsBaseSpaceGroup: (id: string) => `/klasifikatoriai/sporto_bazes_erdves_rusis/${id}`,
  updateSportsBaseSpaceGroup: (id: string) =>
    `/klasifikatoriai/sporto_bazes_erdves_rusis/${id}/atnaujinti`,
};

//Sporto bazės erdvės rūšių klasifikatorius

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
    canHaveChildren: true,
  },
  {
    slug: slugs.organizationUser(':tenantId', ':id'),
    component: <OrganizationUser />,
    canHaveChildren: true,
  },

  {
    slug: slugs.organizationUsers(':id'),
    component: <Organization />,
    canHaveChildren: true,
  },
  {
    slug: slugs.newOrganization,
    component: <OrganizationForm />,
    canHaveChildren: true,
  },
  // {
  //   slug: slugs.updateOrganization(':id'),
  //   component: <UpdateOrganizationForm />,
  //   canHaveChildren: true,
  // },

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
    slug: slugs.sportsBase(':id'),
    component: <SportBase />,
  },
  {
    name: pageTitles.sportBases,
    sidebar: true,
    slug: slugs.sportsBases,
    component: <SportBaseList />,
  },
  {
    slug: slugs.unConfirmedSportBases,
    component: <SportBaseList />,
  },
  {
    name: pageTitles.sportsPersons,
    sidebar: true,
    slug: slugs.sportsPersons,
    component: <SportsPersonsList />,
    environment: 'development',
  },
  {
    slug: slugs.unConfirmedSportsPersons,
    component: <SportsPersonsList />,
    environment: 'development',
  },
  {
    slug: slugs.newSportsPerson,
    component: <SportsPersonPage />,
    environment: 'development',
  },
  {
    slug: slugs.sportsPerson(':id'),
    component: <SportsPersonPage />,
    environment: 'development',
  },
  {
    name: pageTitles.nationalTeams,
    sidebar: true,
    slug: slugs.nationalTeams,
    component: <NationalTeamsList />,
    environment: 'development',
  },
  {
    slug: slugs.unConfirmedNationalTeams,
    component: <NationalTeamsList />,
    environment: 'development',
  },
  {
    slug: slugs.nationalTeam(':id'),
    component: <NationalTeamPage />,
    environment: 'development',
  },

  {
    name: pageTitles.results,
    sidebar: true,
    slug: slugs.results,
    component: <CompetitionList />,
    environment: 'development',
  },
  {
    slug: slugs.unconfirmedResults,
    component: <CompetitionList />,
    role: AdminRoleType.ADMIN,
  },

  {
    slug: slugs.result(':id'),
    component: <CompetitionPage />,
    role: AdminRoleType.ADMIN,
  },

  {
    role: AdminRoleType.USER,
    slug: slugs.user(':id'),
    component: <UserFormPage />,
  },
  {
    slug: slugs.newSportType,
    component: <SportTypeForm />,
  },
  {
    slug: slugs.sportType(':id'),
    component: <SportTypePage />,
  },
  {
    slug: slugs.updateSportType(':id'),
    component: <SportTypeForm />,
  },
  {
    slug: slugs.sportsBaseSpaceGroup(':id'),
    component: <SportBaseSpaceGroup />,
  },

  {
    slug: slugs.newSportsBaseSpaceGroup,
    component: <SportBaseSpaceGroupForm />,
  },

  {
    slug: slugs.updateSportsBaseSpaceGroup(':id'),
    component: <SportBaseSpaceGroupForm />,
  },

  {
    slug: slugs.updateInstitution(':id'),
    role: AdminRoleType.ADMIN,
    component: <UpdateInstitutionForm />,
  },

  {
    name: pageTitles.bonuses,
    slug: slugs.bonuses,
    sidebar: true,
    component: <BonusesList />,
    role: AdminRoleType.ADMIN,
    environment: 'development',
  },

  {
    slug: slugs.bonus(':id'),
    component: <BonusForm />,
    role: AdminRoleType.ADMIN,
    environment: 'development',
  },
  {
    name: pageTitles.scholarships,
    sidebar: true,
    slug: slugs.scholarships,
    component: <ScholarshipsList />,
    role: AdminRoleType.ADMIN,
    environment: 'development',
  },
  {
    slug: slugs.scholarship(':id'),
    component: <ScholarshipForm />,
    role: AdminRoleType.ADMIN,
    environment: 'development',
  },

  {
    name: pageTitles.rents,
    sidebar: true,
    slug: slugs.rents,
    component: <RentsList />,
    role: AdminRoleType.ADMIN,
    environment: 'development',
  },
  {
    slug: slugs.rent(':id'),
    component: <RentForm />,
    role: AdminRoleType.ADMIN,
    environment: 'development',
  },

  {
    name: 'Klasifikatoriai',
    slug: slugs.classifiers(':dynamic'),
    sidebar: true,
    component: <ClassifierList />,
    role: AdminRoleType.ADMIN,
    default: 'sporto_saka',
  },
  {
    slug: slugs.newClassifier(':dynamic'),
    component: <Classifier />,
    role: AdminRoleType.ADMIN,
  },
  {
    slug: slugs.classifier(':dynamic', ':id'),
    component: <Classifier />,
    role: AdminRoleType.ADMIN,
  },
];

export const useFilteredRoutes = () => {
  const user = useAppSelector((state) => state.user.userData);
  const currentProfile = useGetCurrentProfile();
  const VITE_NODE_ENV = env?.VITE_NODE_ENV;

  const isAdmin =
    user?.type && [AdminRoleType.ADMIN, AdminRoleType.SUPER_ADMIN].includes(user?.type);

  return routes.filter((route) => {
    let select = true;
    if (route.role) {
      select = !!user?.type && user?.type === route?.role;
    }
    if (select && route.environment) {
      select = route.environment === VITE_NODE_ENV;
    }

    if (select && route.appType) {
      select = !!user?.permissions?.[route.appType];
    }

    if (select && !isAdmin && route.canHaveChildren) {
      select = !!currentProfile?.data?.canHaveChildren;
    }

    return select;
  });
};
