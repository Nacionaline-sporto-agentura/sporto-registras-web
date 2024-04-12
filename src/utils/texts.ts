import { AdminRoleType, ServerErrorTypes, StatusTypes, TenantTypes } from './constants';

export const validationTexts = {
  badFileTypes: 'Blogi failų tipai',
  fileSizesExceeded: 'Viršyti failų dydžiai',
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
  [ServerErrorTypes.WRONG_PASSWORD]: 'Blogas elektroninis paštas arba slaptažodis',
  [ServerErrorTypes.EMAIL_NOT_FOUND]: 'Naudotojo su tokiu el. paštu nėra',
  [ServerErrorTypes.NOT_FOUND]: 'Blogas elektroninis paštas arba slaptažodis',
  [ServerErrorTypes.EMAIL_NOT_FOUND]: 'Sistemoje nėra tokio elektroninio pašto',
  personalCode: 'Blogas asmens kodas',
  companyCode: 'Blogas įmonės kodas',
};

export const descriptions = {
  cantLogin: 'Norint prisijungti turi būti suteikta prieiga',
  tableNotFound: 'Atsiprašome nieko neradome pagal pasirinktus filtrus',
  deleteUsersWithGroup: 'Ką reikėtų daryti su šiai grupei priskirtais naudotojais?',
  disabledAccessible: 'Sporto bazė pritaikyta žmonėms su judėjimo negalia',
  blindAccessible: 'Sporto bazė pritaikyta žmonėms su regėjimo negalia',
  publicWifi: 'Yra Public WiFi internetas',
  plans: 'Pridėti sporto bazės planus geoerdviniais formatais (2D ir 3D)',
  energyClassCertificate: 'Energetinės klasės pažymėjimas',
};

export const formLabels = {
  inActiveProfile: 'Anketa neaktyvi',
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
  investments: 'Investicijos',
  sportOrganizations: 'Sporto organizacjos',
  sportBaseInfo: 'Sporto bazės informacija',
  technicalSportBaseParameters: 'Techniniai sporto bazės parametrai',
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
  spaces: 'Erdvės',
  owners: 'Savininkai',
  photos: 'Nuotraukos',
  buildingNumber: 'Unikalus statinio numeris',
  buildingArea: 'Bendrasis pastato plotas',
  energyClass: 'Energetinė klasė',
  buildingType: 'Pastato ar inžinerinio statinio rūšis',
  buildingPurpose: 'Statinio pagrindinė tikslinė naudojimo paskirtis',
  constructionDate: 'Pastatymo data',
  latestRenovationDate: 'Paskutinė renovacijos data',
  isPublic: 'Skelbiama viešai',
  makePublic: 'Padaryti skelbiama viešai',
  description: 'Aprašymas',
  isRepresentative: 'Reprezentuojanti nuotrauka',
  makeRepresentative: 'Padaryti reprezentuojančia nuotrauka',
  public: 'Vieša',
  representative: 'Reprezentuojanti',
  pressToWant: 'Paspauskite norėdami',
  uploadPhotos: 'Pridėti nuotrauką / -as',
  uploadOrDragFilesHere: 'įkelti arba įtempkite failus čia',
  fileTypesAndMaxSize: 'PDF, PNG, JPEG, JPG (maks. 2MB)',
  methodicalClasses: 'Metodinių klasių skaičius',
  diningPlaces: 'Maitinimo vietų skaičius',
  accommodationPlaces: 'Apgyvendinimo vietų skaičius',
  audienceSeats: 'Žiūrovų vietų skaičius',
  saunas: 'Pirties patalpų skaičius',
  parkingPlaces: 'Automobilių aikštelės vietų skaičius',
  dressingRooms: 'Persirengimo patalpų skaičius',
  plotNumber: 'Unikalus žemės sklypo numeris',
  plotArea: 'Žemės sklypo plotas',
  builtPlotArea: 'Žemės sklypo užstatytos teritorijos plotas',
  level: 'Sporto bazės lygmuo',
  technicalCondition: 'Techninė bazės būklė',
  type: 'Sporto bazės rūšis',
  sportTypes: 'Kultivuojamos sporto šakos',
  address: 'Adresas',
  jarName: 'JAR Pavadinimas',
  code: 'JAR Kodas',
  website: 'Svetainės adresas',
  source: 'Investicijų šaltinis',
  startAt: 'Pradžia',
  endAt: 'Pabaiga',
  fundsAmount: 'Lėšų dydis',
  personalCode: 'Asmens kodas',
  appointedAt: 'Skyrimo data',
  parentOrganization: 'Tėvinė organizacija',
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
  sportBaseName: 'Sporto bazės pavadinimas',
  coordinates: 'Koordinatės',
  coordinateX: 'Koordinatė x',
  coordinateY: 'Koordinatė y',
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
  sportBases: 'Sporto infrastruktūra',
};

export const buttonsTitles = {
  edit: 'Redaguoti',
  view: 'Peržiūrėti',
  approve: 'Tvirtinti',
  returnToCorrect: 'Grąžinti taisymui',
  reject: 'Atmesti',
  addInvestment: 'Pridėti investiciją',
  addOrganization: 'Pridėti organizaciją',
  addSportBaseSpace: '+ Pridėti erdvę',
  addOwner: 'Pridėti savininką',
  goToBack: 'Grįžti atgal',
  group: 'Ištrinti grupę',
  clearAll: 'Išvalyti visus',
  profile: 'Profilis',
  logout: 'Atsijungti',
  profiles: 'Profiliai',
  filter: 'Filtruoti',
  save: 'Išsaugoti',
  saveAsDraft: 'Išsaugoti kaip juodraštį',
  newUser: 'Naujas naudotojas',
  deleteUser: 'Ištrinti naudotoją',
  delete: 'Ištrinti',
  cancel: 'Atšaukti',
  newGroups: 'Nauja grupė',
  newInstitution: 'Nauja įstaiga',
  newOrganization: 'Nauja organizacija',
  registerSportBase: 'Įregistruoti sporto bazę',
  back: 'Atgal',
  next: 'Kitas',
};

export const emptyState = {
  sportBases: 'Nėra sukurtų sporto infrastruktūrų',
  unConfirmedSportBases: 'Nėra sukurtų nepatvirtintų sporto infrastruktūrų',
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

export const tenantTypeLabels = {
  [TenantTypes.MUNICIPALITY]: 'Savivaldybė',
  [TenantTypes.ORGANIZATION]: 'Organizacija',
};

export const requestStatusLabels = {
  [StatusTypes.CREATED]: 'Pateiktas',
  [StatusTypes.SUBMITTED]: 'Pateiktas pakartotinai ',
  [StatusTypes.RETURNED]: 'Grąžintas taisymui',
  [StatusTypes.REJECTED]: 'Atmestas',
  [StatusTypes.APPROVED]: 'Patvirtintas',
  [StatusTypes.DRAFT]: 'Juodraštis',
};
