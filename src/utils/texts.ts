import { RoleType, ServerErrorMessages } from './constants';

export const validationTexts = {
  requireText: 'Privalote įvesti',
  validFirstName: 'Įveskite taisyklingą vardą',
  validLastName: 'Įveskite taisyklingą pavardę',
  doesNotMeetRequirements: 'Slaptažodis neatitinka reikalavimų',
  photoNotUploaded: 'Nuotrauka neįkelta',
  profileUpdated: 'Profilis atnaujintas',
  badPhoneFormat: 'Blogai įvestas telefono numeris',
  badFormat: 'Blogas formatas',
  notFound: 'Nėra pasirinkimų',
  requireSelect: 'Privalote pasirinkti',
  error: 'Ivyko klaida, prašome pabandyti vėliau',
  badEmailFormat: 'Blogas el. pašto formatas',
  tooFrequentRequest: 'Nepavyko, per dažna užklausa prašome pabandyti veliau ',
  [ServerErrorMessages.WRONG_PASSWORD]: 'Blogas elektroninis paštas arba slaptažodis',
  [ServerErrorMessages.USER_NOT_FOUND]: 'Naudotojo su tokiu el. paštu nėra',

  [ServerErrorMessages.NOT_FOUND]: 'Blogas elektroninis paštas arba slaptažodis',
  [ServerErrorMessages.USER_NOT_FOUND]: 'Sistemoje nėra tokio elektroninio pašto',
};

export const descriptions = {
  tableNotFound: 'Atsiprašome nieko neradome pagal pasirinktus filtrus',
  deleteUsersWithGroup: 'Ką reikėtų daryti su šiai grupei priskirtais naudotojais?',
};

export const formLabels = {
  groupInfo: 'Informacija apie grupę',
  userInfo: 'Informacija apie naudotoją',
  profileInfo: 'Profilio informacija',
  roles: 'Rolės',
  moduleAccess: 'Prieiga prie modulių',
  permissions: 'Teisės',
  changePassword: 'Pakeisti slaptažodį',
  groupUsers: 'Grupės naudotojai',
};

export const deleteTitles = {
  group: 'Ištrinti grupę',
  user: 'Ištrinti naudotoją',
};

export const deleteDescriptionFirstPart = {
  group: 'Ar esate tikri, kad norite ištrinti ',
  user: 'Ar esate tikri, kad norite ištrinti ',
};

export const deleteDescriptionSecondPart = {
  group: 'grupę?',
  user: ' paskyrą?',
};

export const inputLabels = {
  name: 'Pavadinimas',
  firstName: 'Vardas',
  lastName: 'Pavardė',
  oldPassword: 'Senas slaptažodis',
  newPassword: 'Naujas slaptažodis',
  repeatNewPassword: 'Pakartokite naują slaptažodį',
  phone: 'Telefonas',
  email: 'El. pašto adresas',
  group: 'Grupė',
  role: 'Rolė',
  choose: 'Pasirinkite',
  noOptions: 'Nėra pasirinkimų',
};
export const pageTitles = {
  users: 'Naudotojai',
  groups: 'Grupės',
  newUser: 'Naujas naudotojas',
  updateUser: 'Redaguoti naudotoją',
  newGroup: 'Nauja grupė',
  updateGroup: 'Redaguoti grupę',
  updateProfile: 'Atnaujinti profilį',
  changePassword: 'Pakeisti slaptažodį',
};

export const buttonsTitles = {
  back: 'Grįžti atgal',
  clearAll: 'Išvalyti visus',
  filter: 'Filtruoti',
  save: 'Išsaugoti',
  newUser: 'Naujas naudotojas',
  deleteUser: 'Ištrinti naudotoją',
  delete: 'Pašalinti',
  cancel: 'Atšaukti',
  newGroups: 'Nauja grupė',
};

export const emptyState = {
  users: 'Jūs neturite Naudotojų. Sukurkite',
  groupUsers: 'Grupė neturi Naudotojų. Sukurkite',
  groups: 'Jūs neturite jokių grupių. Sukurkite',
  groupGroups: 'Grupė neturi grupių. Sukurkite',
};

export const emptyStateUrl = {
  user: 'naują naudotoją.',
  groupUser: 'grupei naują naudotoją.',
  group: 'naują grupę.',
};

export const url = {
  new: 'naujas',
};
export const roleLabels = {
  [RoleType.USER]: 'Naudotojas',
  [RoleType.ADMIN]: 'Administratorius',
};