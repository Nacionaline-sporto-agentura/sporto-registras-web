import GroupPage from '../pages/Group';
import GroupsFormPage from '../pages/GroupForm';
import GroupsList from '../pages/GroupList';
import Profile from '../pages/Profile';
import UserForm from '../pages/UserForm';
import UserList from '../pages/UserList';

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
};
export const routes = [
  {
    name: 'Vidiniai naudotojai',
    slug: slugs.groups,
    sidebar: true,
    component: <GroupsList />,
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
