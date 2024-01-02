import { AdminRoleType, ServerErrorMessages } from './constants';

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
  personalCode: 'Blogas asmens kodas',
  companyCode: 'Blogas įmonės kodas',
};

export const descriptions = {
  tableNotFound: 'Atsiprašome nieko neradome pagal pasirinktus filtrus',
  deleteUsersWithGroup: 'Ką reikėtų daryti su šiai grupei priskirtais naudotojais?',
};

export const formLabels = {
  groupInfo: 'Informacija apie grupę',
  userInfo: 'Informacija apie naudotoją',
  selectProfile: 'Pasirinkite paskyrą',
  profileInfo: 'Profilio informacija',
  roles: 'Rolės',
  moduleAccess: 'Prieiga prie modulių',
  permissions: 'Teisės',
  changePassword: 'Pakeisti slaptažodį',
  groupUsers: 'Grupės naudotojai',
  infoAboutInstitution: 'Informacija apie įstaigą',
  infoAboutOrganization: 'Informacija apie organizaciją',
  infoAboutOwner: 'Atstovo duomenys',
};

export const deleteTitles = {
  group: 'Ištrinti grupę',
  user: 'Ištrinti naudotoją',
};

export const deleteDescriptionFirstPart = {
  group: 'Ar esate tikri, kad norite ištrinti',
  user: 'Ar esate tikri, kad norite ištrinti',
};

export const deleteDescriptionSecondPart = {
  group: 'grupę?',
  user: ' paskyrą?',
};

export const inputLabels = {
  personalCode: 'Asmens kodas',
  name: 'Pavadinimas',
  firstName: 'Vardas',
  lastName: 'Pavardė',
  oldPassword: 'Senas slaptažodis',
  newPassword: 'Naujas slaptažodis',
  repeatNewPassword: 'Pakartokite naują slaptažodį',
  phone: 'Telefonas',
  email: 'El. pašto adresas',
  group: 'Grupė',
  companyCode: 'Juridinio asmens kodas',
  organizationType: 'Sporto organizacijos tipas',
  locationAddress: 'Buveinės adresas',
  companyPhone: 'Kontaktinis telefonas',
  companyEmail: 'Kontaktinis el.paštas',
  foundedAt: 'Steigimo dokumentų sudarymo data',
  url: 'Internetinės svetainės adresas',
  role: 'Rolė',
  choose: 'Pasirinkite',
  noOptions: 'Nėra pasirinkimų',
  hasBeneficiaryStatus: 'Turi paramos gavėjo statusą',
  nonGovernmentalOrganization: 'Atitinka nevyriausybinėms organizacijoms keliamus reikalavimus',
  nonFormalEducation: 'Gali vykdyti akredituotas neformaliojo vaikų švietimo programas',
  canHaveChildren: 'Įstaiga yra sporto organizacija, kuriai leidžiama kurti vaikines organizacijas',
  ownerWithPassword: 'Pakviesti vadovą su slaptažodžiu',
  userWithPassword: 'Pakviesti naudotoją su slaptažodžiu',
  legalForm: 'Teisinė forma',
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
  institutions: 'Įstaigos',
  organizations: 'Sporto organizacijos',
  newOrganization: 'Nauja organizacija',
  newInstitution: 'Nauja įstaiga',
  updateOrganization: 'Atnaujinti organizaciją',
  updateInstitution: 'Atnaujinti instituciją',
  myOrganization: 'Mano organizacija',
};

export const buttonsTitles = {
  back: 'Grįžti atgal',
  group: 'Ištrinti grupę',
  clearAll: 'Išvalyti visus',
  profile: 'Profilis',
  logout: 'Atsijungti',
  profiles: 'Profiliai',
  filter: 'Filtruoti',
  save: 'Išsaugoti',
  newUser: 'Naujas naudotojas',
  deleteUser: 'Ištrinti naudotoją',
  delete: 'Pašalinti',
  cancel: 'Atšaukti',
  newGroups: 'Nauja grupė',
  newInstitution: 'Nauja įstaiga',
  newOrganization: 'Nauja organizacija',
};

export const emptyState = {
  users: 'Jūs neturite Naudotojų. Sukurkite',
  groupUsers: 'Grupė neturi Naudotojų. Sukurkite',
  groups: 'Jūs neturite jokių grupių. Sukurkite',
  institutions: 'Jūs neturite jokių įstaigų. Sukurkite',
  organizations: 'Jūs neturite jokių sporto organizacijų. Sukurkite',
  groupGroups: 'Grupė neturi grupių. Sukurkite',
};

export const emptyStateUrl = {
  user: 'naują naudotoją.',
  groupUser: 'grupei naują naudotoją.',
  group: 'naują grupę.',
  institution: 'naują įstaigą.',
  organization: 'naują sporto organizaciją',
};

export const url = {
  new: 'naujas',
};
export const roleLabels = {
  [AdminRoleType.USER]: 'Naudotojas',
  [AdminRoleType.ADMIN]: 'Administratorius',
};
