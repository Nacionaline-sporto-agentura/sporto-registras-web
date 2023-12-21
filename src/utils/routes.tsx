export const slugs = {
  login: '/login',
  forgotPassword: '/pamirsau',
  resetPassword: '/atstatyti',
  invite: '/pakvietimas',
  users: '/naudotojai',
  profile: '/profilis',
};

export const routes = [
  {
    name: 'Naudotojai',
    slug: slugs.users,
    sidebar: true,
    component: <div>Naudotojai</div>,
  },
];
