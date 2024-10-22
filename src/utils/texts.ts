import { ButtonColors } from '../components/buttons/Button';
import {
  AdminRoleType,
  AreaUnits,
  BonusType,
  ClassifierTypes,
  Features,
  HistoryTypes,
  LegalForms,
  MatchTypes,
  MembershipTypes,
  ScholarshipType,
  ServerErrorTypes,
  SportTypeButtonKeys,
  StatusTypes,
  StudiesType,
  TableItemWidth,
  TenantTypes,
} from './constants';

export const validationTexts = {
  yearFormat: 'Blogas metų formatas',
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
  personalCode: 'Blogas asmens kodas',
  colorCode: 'Blogas spalvos kodas',
  companyCode: 'Blogas įmonės kodas',
  minCharacters: 'Privalote įvesti bent 3 simbolius',
};

export const descriptions = {
  rents: 'Duomenys apie skirtą rentą buvusiems sportininkams',
  scholarships: 'Duomenys apie skirtą valstybės stipendiją',
  nationalTeams: 'Duomenys apie priklausymą nacionalinei rinktinei',
  bonuses: 'Informacija apie sporto asmens gautas premijas',
  nationalTeamCoaches: 'Treneriai treniruojantys rinktinę',
  athletes: 'Sportininkai priklausantys rinktinei',
  amsCoaches: 'Trenerio duomenys, kuriam talkina',
  faSpecialist: 'FA specialisto duomenys, kuriam talkina',
  categories: 'Kategoriją patvirtinančio dokumento duomenys',
  careerEnd: 'Sporto asmens karjeros pabaigos fiksavimas',
  sportBase: 'Sporto bazės, kurioje reguliariai sportuoja arba dirba sporto asmuo',
  studies: 'Duomenys apie mokymąsi ar studijas',
  protocolDocument: 'Protokolo dokumentas',
  resultInfo: 'Sporto varžybose pasiekti rezultatai',
  sportMatches: 'Sporto šakoje esančios sporto rungtys',
  sportsBaseSpaceTypes: 'Sporto bazės erdvės grupė esantys tipai',
  competitionInfo: 'Sporto varžybų informacija',
  results: 'Rezultatai aukšto meistriškumo sporto varžybose',
  fundingSources: 'Pridėkite visas gautas investicijas skirtas pagerinimui',
  cantLogin: 'Norint prisijungti turi būti suteikta prieiga',
  tableNotFound: 'Atsiprašome nieko neradome pagal pasirinktus filtrus',
  deleteUsersWithGroup: 'Ką reikėtų daryti su šiai grupei priskirtais naudotojais?',
  publicWifi: 'Yra Public WiFi internetas',
  plans: 'Pridėti sporto bazės planus geoerdviniais formatais (2D ir 3D)',
  sportBaseGeneral: 'Sporto bazės pagrindinė informacija',
  sportsPersonGeneral: 'Sporto asmens asmeninė informacija',
  sportBaseSpecification: 'Nurodykite sporto bazės parametrus',
  sportBaseSpaces: 'Nurodykite sporto bazės erdves',
  organizations: 'Pridėkite organizacijas, kurios veikia šioje sporto bazėje',
  investments: 'Pridėkite visas gautas investicijas skirtas pagerinimui',
  photos: 'Pateikite nuotraukas',
  owners: 'Pridėkite sporto bazės savininkus',
  governingBodies: 'Pridėkite sporto bazės savininkus',
  memberships: 'Pridėkite narystes',
  workRelations: 'Duomenys apie vykdomą sportininko veiklą, darbo santykius sporto organizacijoje',
  coaches: 'Duomenys apie sportininko trenerį (-ius)',
  qualificationCategory: 'Duomenys apie treneriui suteiktas kvalifikacines kategorijas',
  teamInfo: 'Sporto rinktinės informacija',
  membershipInfo:
    'Dokumento, patvirtinančio sportininko narystę ir (ar) registraciją Sporto organizacijoje, duomenys',
};

export const formLabels = {
  notGrantedAccess: 'Nesuteikta prieiga',
  addFaSpecialist: 'Pridėti fizinio aktyvumo specialistas',
  addCoach: 'Pridėti trenerį',
  teamResult: 'Komandos rezultatai ir sportininkai',
  addMatch: 'Pridėti rungtį',
  history: 'Istorija',
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
  addOwner: 'Pridėti savininką',
  investments: 'Investicijos',
  addInvestment: 'Pridėti investicijas',
  addSportOrganization: 'Pridėti sporto organizaciją',
  sportOrganizations: 'Sporto organizacijos',
  addGoverningBody: 'Pridėti valdymo organo asmenį',
  addMembership: 'Pridėti narystę',
  addFundingSource: 'Pridėti finansavimo šaltinį',
  sportBaseInfo: 'Sporto bazės informacija',
  technicalSportBaseParameters: 'Techniniai sporto bazės parametrai',
  addStudies: 'Pridėti mokymąsi ar studijas',
  addWorkRelations: 'Pridėti darbo santykius',
  addCategory: 'Pridėti kategoriją',
};

export const deleteTitles = {
  group: 'Ištrinti grupę',
  sportsBase: 'Ištrinti sporto bazę',
  request: 'Ištrinti prašymą',
  user: 'Ištrinti naudotoją',
  classifier: 'Ištrinti klasifikatorių',
  permission: 'Ištrinti teisę',
};

export const deleteDescriptionFirstPart = {
  delete: 'Ar esate tikri, kad norite ištrinti',
  user: 'Ar esate tikri, kad norite ištrinti',
  classifier: 'Ar esate tikri, kad norite ištrinti',
  permission: 'Ar esate tikri, kad norite ištrinti',
};

export const deleteDescriptionSecondPart = {
  sportsBase: 'sporto bazę?',
  request: 'prašymą?',
  group: 'grupę?',
  user: 'paskyrą?',
  classifier: {
    [ClassifierTypes.LEVEL]: 'sporto bazės lygio klasifikatorių?',
    [ClassifierTypes.TECHNICAL_CONDITION]: 'techninės būklės klasifikatorių?',
    [ClassifierTypes.SOURCE]: 'investicijos šaltinio klasifikatorių?',
    [ClassifierTypes.SPORTS_BASE_TYPE]: 'sporto bazės rūšies klasifikatorių?',
    [ClassifierTypes.SPORT_TYPE]: 'sporto šakos klasifikatorių?',
    [ClassifierTypes.SPORTS_BASE_SPACE_GROUP]: 'sporto bazės erdvės rūšies klasifikatorių?',
  },
  permission: 'šią teisę?',
};

export const inputLabels = {
  hexColor: 'Spalvos kodas(HEX)',
  technicalConditionName: 'Techninės būklės pavadinimas',
  needSportType: 'Rodyti sporto erdvėse sporto šakas',
  issuedAt: 'Galioja nuo',
  sportsCompetitionType: 'Sporto varžybų rūšis',
  athletes: 'Sportininkai',
  coaches: 'Treneriai',
  suspendedFrom: 'Sustabdyta nuo',
  suspendedReason: 'Sustabdymo priežastis',
  updated: 'Atnaujinta',
  terminatedFrom: 'Nutraukta nuo',
  terminatedReason: 'Nutraukimo priežastis',
  appointmentDate: 'Skyrimo data',
  appointmentDateFrom: 'Skiriama nuo',
  appointmentDateTo: 'Skiriama iki',
  bonusAmount: 'Premijos dydis, EUR',
  scholarshipAmount: 'Stipendijos dydis, bazinių socialinių išmokų dydžiais',
  scholarshipAmountShort: 'Stipendijos dydis, BSI',
  rentAmount: 'Rentos dydis',
  rentUnit: 'Rentos mato vienetas',
  document: 'Dokumento (įsakymo) Nr.',
  bonusType: 'Premijos tipas',
  sportsPerson: 'Sporto asmuo',
  amsInstructorCoach: 'Trenerio vardas, vardas, pavardė, kodas',
  grantedQualificationCategory: 'Suteikta kvalifikacinė kategorija',
  careerEndDate: 'Karjeros pabaigos data',
  coach: 'Treneris',
  qualificationCategory: 'Kvalifikacijos kategorija',
  sportsCoach: 'Sporto treneris',
  companyNameCode: 'Įstaigos pavadinimas, juridinio asmens kodas',
  companyName: 'Įstaigos pavadinimas',
  learningProgram: 'Mokymosi programa',
  sportsOrganization: 'Sporto organizacija',
  statesCount: 'Valstybių skaičius tarptautinėse aukšto mesitriškumo sporto varžybose',
  stagesCount: 'Etapų skaičius',
  athlete: 'Sportininkas',
  matchMemberCount: 'Dalyvių skaičius rungtyje',
  teamCount: 'Dalyvavusių komandų skaičius',
  result: 'Rezultatas',
  competitionType: 'Varžybų tipas',
  year: 'Metai',
  type: 'Tipas',
  isOlympic: 'Ar olimpinė sporto šaka?',
  isParalympic: 'Ar paralimpinė sporto šaka?',
  isStrategic: 'Ar strateginė sporto šaka?',
  isTechnical: 'Ar techninė sporto šaka?',
  isDeafs: 'Ar tai kurčiųjų sporto šaka?',
  isSpecialOlympic: 'Ar specialioji olimpiada?',
  sportTypeName: 'Sporto šakos pavadinimas',
  competitionName: 'Varžybų pavadinimas',
  matchName: 'Rungties pavadinimas',
  olympicMatch: 'Olimpinė rungtis',
  sportType: 'Sporto šaka',
  sportMatchType: 'Sporto šakos rungtis',
  placeFrom: 'Užimta vieta nuo',
  placeTo: 'Užimta vieta iki',
  place: 'Užimta  vieta',
  membersNo: 'Dalyvių/Komandų sk.',
  isInternationalSelection:
    'Ar vykdoma atranka į tarptautines aukšto meistriškumo sporto varžybas?',
  matchType: 'Rungties tipas',
  granted: 'Suteikta',
  expiresAt: 'Galioja iki',
  date: 'Data',
  users: 'naudotojai',
  basis: 'Pagrindas',
  spaces: 'Erdvės',
  status: 'Būsena',
  improvements: 'Atlikti pagerinimai',
  owners: 'Savininkai',
  photos: 'Nuotraukos',
  comment: 'Komentaras',
  buildingNumber: 'Unikalus daikto numeris',
  buildingArea: 'Bendrasis pastato plotas',
  energyClass: 'Energetinė klasė',
  buildingType: 'Pastato ar inžinerinio statinio rūšis',
  buildingPurpose: 'Statinio paskirtis',
  constructionDate: 'Pastatymo metai',
  latestRenovationDate: 'Paskutinės renovacijos metai',
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
  saunas: 'Pirties patalpų skaičius',
  parkingPlaces: 'Automobilių aikštelės vietų skaičius',
  plotNumber: 'Unikalus žemės sklypo numeris',
  plotArea: 'Žemės sklypo plotas',
  areaUnits: 'Ploto vienetai',
  builtPlotArea: 'Žemės sklypo užstatytos teritorijos plotas',
  level: 'Sporto bazės lygmuo',
  technicalBaseCondition: 'Techninė bazės būklė',
  technicalSpaceCondition: 'Techninė erdvės būklė',
  sportBaseType: 'Sporto bazės rūšis',
  sportPersonSportType: 'Sporto šaka/-os',
  sportPersonType: 'Asmens tipas',
  sportBaseSpaceType: 'Sporto erdvės tipas',
  sportBaseSpaceGroup: 'Sporto erdvės rūšis',
  sportTypes: 'Kultivuojamos sporto šakos',
  address: 'Adresas',
  jarName: 'JAR Pavadinimas',
  jarCode: 'JAR Kodas',
  owner: 'Savininkas',
  code: 'JAR/Asmens Kodas',
  website: 'Svetainės adresas',
  websiteToProtocols: 'Nuoroda į interneto svetainę, kurioje pateikiami protokolai',
  investmentSources: 'Investicijų šaltinis',
  sources: 'Šaltiniai',
  fundingSource: 'Finansavimo šaltinis',
  governingBodyName: 'Valdymo organo pavadinimas',
  organizationName: 'Organizacijos pavadinimas',
  startAt: 'Pradžia',
  membershipType: 'Narystės tipas',
  endAt: 'Pabaiga',
  membershipStart: 'Narystės pradžia',
  membershipEnd: 'Narystės pabaiga',
  fundsAmount: 'Lėšų dydis',
  totalFundsAmount: 'Bendras lėšų dydis, Eur',
  membersCount: 'Narių skaičius',
  personalCode: 'Asmens kodas',
  appointedAt: 'Skyrimo data',
  parentOrganization: 'Tėvinė organizacija',
  name: 'Pavadinimas',
  companyCode: 'Juridinio asmens kodas',
  firstName: 'Vardas',
  nationalTeamName: 'Rinktinės pavadinimas',
  lastName: 'Pavardė',
  oldPassword: 'Senas slaptažodis',
  newPassword: 'Naujas slaptažodis',
  repeatNewPassword: 'Pakartokite naują slaptažodį',
  phone: 'Telefonas',
  email: 'El. pašto adresas',
  position: 'Pareigos',
  group: 'Grupė',
  organizationBasis: 'Kokiu pagrindu veikia organizacija',
  activityBasis: 'Veiklos pagrindas',
  programNameCode: 'Mokymosi programos pavadinimas, valstybinis kodas',
  organizationType: 'Sporto organizacijos tipas',
  locationAddress: 'Buveinės adresas',
  companyPhone: 'Kontaktinis telefonas',
  companyEmail: 'Kontaktinis el.paštas',
  foundedAt: 'Steigimo dokumentų sudarymo data',
  url: 'Internetinės svetainės adresas',
  role: 'Rolė',
  features: 'Meniu prieiga',
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
  municipality: 'Savivaldybė',
  town: 'Miestas',
  street: 'Gatvės pavadinimas',
  houseNo: 'Namo Nr.',
  apartmentNo: 'Buto Nr.',
  citizenship: 'Pilietybė (-ės)',
  ownerType: 'Asmens tipas',
  fullName: 'Vardas, Pavardė',
  documentNo: 'Dokumento Nr.',
  formCode: 'Blanko kodas',
  issued: 'Išduota',
  issuedDate: 'Išdavimo data',
  series: 'Serija',
  faSpecialist: 'FA specialistas',
  ageGroup: 'Amžiaus grupė',
  nationalTeamGender: 'Rinktinės narių lytis',
  gender: 'Lytis',
  notes: 'Papildoma informacija / Pastabos',
  addOwner: 'Pridėti informaciją apie savininką',
};
export const pageTitles = {
  newTechnicalCondition: 'Nauja techninė būklė',
  technicalCondition: 'Techninė būklė',
  nationalTeams: 'Nacionalinės rinktinės',
  rents: 'Rentos',
  scholarships: 'Stipendijos',
  bonuses: 'Premijos',
  coaches: 'Treneriai',
  faSpecialist: 'FA specialistas',
  careerEnd: 'Karjeros pabaiga',
  resultInfo: 'Rezultatų informacija',
  competitionInfo: 'Varžybų informacija',
  results: 'Rezultatai',
  qualificationCategory: 'Kvalifikacinė kategorija',
  categories: 'Kategorija',
  users: 'Naudotojai',
  sportMatches: 'Sporto rungtys',
  sportsBaseSpaceTypes: 'Sporto bazės erdvės tipai',
  groups: 'Grupės',
  newUser: 'Naujas naudotojas',
  updateUser: 'Redaguoti naudotoją',
  newGroup: 'Nauja grupė',
  updateGroup: 'Redaguoti grupę',
  updateProfile: 'Atnaujinti profilį',
  changePassword: 'Pakeisti slaptažodį',
  institutions: 'Įstaigos',
  organizations: 'Sporto organizacijos',
  permissions: 'Teisės',
  newOrganization: 'Nauja organizacija',
  newInstitution: 'Nauja įstaiga',
  updateOrganization: 'Atnaujinti organizaciją',
  updateInstitution: 'Atnaujinti instituciją',
  myOrganization: 'Mano organizacija',
  sportBases: 'Sporto infrastruktūra',
  sportsPersons: 'Sporto asmenys',
  info: 'Informacija',
  personalInfo: 'Asmeninė informacija',
  sportBasePhotos: 'Sporto bazės nuotraukos',
  sportBaseSpecification: 'Techniniai sporto bazės parametrai',
  sportBaseSpaces: 'Sporto bazių erdvės',
  owners: 'Savininkai',
  investments: 'Investicijos',
  governingBodies: 'Valdymo organai ir asmenys',
  fundingSources: 'Finasavimo šaltiniai',
  memberships: 'Narystės',
  newSportType: 'Nauja sporto šaka',
  updateSportType: 'Atnaujinti sporto šaką',
  newSportsSpaceBaseGroup: 'Nauja Sporto bazės erdvės rūšis',
  updateSportsSpaceBaseGroup: 'Nauja Sporto bazės erdvės rūšį',
  workRelations: 'Darbo santykiai',
  studies: 'Mokymasis ir studijos',
  sportBase: 'Sporto bazė',
  bonusInfo: 'Premijos informacija',
  scholarshipInfo: 'Stipendijos informacija',
  rentInfo: 'Rentos informacija',
  teamInfo: 'Rinktinės informacija',
  athletes: 'Sportininkai',
  newPermission: 'Nauja teisė',
  updatePermission: 'Redaguoti teisę',
};

export const buttonsTitles = {
  addAthlete: 'Pridėti sportininką',
  newBonus: 'Nauja premija',
  newRent: 'Nauja renta',
  newScholarship: 'Nauja stipendija',
  addFaSpecialist: 'Pridėti FA specialistą',
  addCategory: 'Pridėti kategorijos dokumentą',
  addCoach: 'Pridėti trenerį',
  addResult: 'Pridėti rezultatą',
  addMatch: 'Pridėti rungtį',
  addSportsBaseSpaceTypes: 'Prideti tipą',
  edit: 'Redaguoti',
  view: 'Peržiūrėti',
  approve: 'Tvirtinti',
  returnToCorrect: 'Grąžinti taisymui',
  reject: 'Atmesti',
  addInvestment: 'Pridėti investiciją',
  addFundingSource: 'Pridėti finansavimo šaltinį',
  addGoverningBody: 'Pridėti valdymo organą',
  addMembership: 'Pridėti narystę',
  addInvestmentSource: '+ Pridėti investicijų šaltinį',
  addBodyMember: '+ Pridėti organo narį',
  addOrganization: 'Pridėti organizaciją',
  addSportBaseSpace: '+ Pridėti erdvę',
  addSportBase: 'Pridėti sporto bazę',
  addOwner: 'Pridėti savininką',
  goToBack: 'Grįžti atgal',
  deleteSportsBase: 'Ištrinti sporto bazę',
  deleteRequest: 'Ištrinti prašymą',
  deleteGroup: 'Ištrinti grupę',
  clearAll: 'Išvalyti visus',
  profile: 'Profilis',
  logout: 'Atsijungti',
  profiles: 'Profiliai',
  filter: 'Filtruoti',
  save: 'Išsaugoti',
  submit: 'Pateikti',
  saveAsDraft: 'Išsaugoti kaip juodraštį',
  newUser: 'Naujas naudotojas',
  deleteUser: 'Ištrinti naudotoją',
  delete: 'Ištrinti',
  cancel: 'Atšaukti',
  newGroups: 'Nauja grupė',
  newInstitution: 'Nauja įstaiga',
  newOrganization: 'Nauja organizacija',
  registerSportBase: 'Įregistruoti sporto bazę',
  registerNationalTeam: 'Įregistruoti nacionalinę rinktinę',
  registerSportsPerson: 'Įregistruoti sporto asmenį',
  registerResult: 'Naujas prašymas įvesti rezultatą',
  back: 'Atgal',
  next: 'Kitas',
  addWorkRelations: 'Pridėti darbo santykius',
  addData: 'Pridėti duomenis',
  newPermission: 'Nauja teisė',
};

export const emptyState = {
  sportBases: 'Nėra sukurtų sporto infrastruktūrų',
  nationalTeams: 'Nėra sukurtų nacionalinių rinktinių',
  sportsPersons: 'Nėra sukurtų sporto asmenų',
  results: 'Nėra sukurtų rezultatų',
  unConfirmedSportBases: 'Nėra sukurtų nepatvirtintų sporto infrastruktūrų',
  users: 'Jūs neturite Naudotojų. Sukurkite',
  groupUsers: 'Grupė neturi Naudotojų. Sukurkite',
  groups: 'Jūs neturite jokių grupių. Sukurkite',
  institutions: 'Jūs neturite jokių įstaigų. Sukurkite',
  organizations: 'Jūs neturite jokių sporto organizacijų. Sukurkite',
  groupGroups: 'Grupė neturi grupių. Sukurkite',
  bonuses: 'Nėra sukurtų premijų',
  scholarship: 'Nėra sukurtų stipendijų',
  rents: 'Nėra sukurtų rentų',
  permissions: 'Jūs neturite jokių teisių. Sukurkite ',
};

export const emptyStateUrl = {
  user: 'naują naudotoją.',
  groupUser: 'grupei naują naudotoją.',
  group: 'naują grupę.',
  institution: 'naują įstaigą.',
  organization: 'naują sporto organizaciją',
  permission: 'naują teisę',
};

export const url = {
  new: 'naujas',
  privacyPolicy: 'https://registras.ltusportas.lt/privatumo-politika/',
  registrySecuritySettings: 'https://registras.ltusportas.lt/registro-saugos-nuostatai/',
  readInstruction: 'https://registras.ltusportas.lt/vartotojo-vadovai/gauti-prieiga',
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
export const buttonColors = {
  [StatusTypes.SUBMITTED]: ButtonColors.PRIMARY,
  [StatusTypes.APPROVED]: ButtonColors.SUCCESS,
  [StatusTypes.RETURNED]: ButtonColors.PRIMARY,
  [StatusTypes.REJECTED]: ButtonColors.DANGER,
};
export const formActionLabels = {
  [StatusTypes.APPROVED]: 'Tvirtinamas prašymas',
  [StatusTypes.RETURNED]: 'Grąžinti prašymą taisymui',
  [StatusTypes.REJECTED]: 'Atmesti prašymą',
  [StatusTypes.SUBMITTED]: 'Pateikti prašymą',
};

export const actionButtonLabels = {
  [StatusTypes.APPROVED]: 'Patvirtinti',
  [StatusTypes.RETURNED]: 'Grąžinti taisyti',
  [StatusTypes.REJECTED]: 'Atmesti',
  [StatusTypes.SUBMITTED]: 'Pateikti',
};
export const requestFormHistoryLabels = {
  [HistoryTypes.CREATED]: 'Pateiktas',
  [HistoryTypes.SUBMITTED]: 'Pateiktas pakartotinai',
  [HistoryTypes.REJECTED]: 'Atmestas',
  [HistoryTypes.RETURNED]: 'Grąžintas taisyti',
  [HistoryTypes.APPROVED]: 'Priimtas',
};

export const requestFormHistoryDescriptions = {
  [HistoryTypes.CREATED]: 'pateikė prašymą įregistruoti sporto bazę',
  [HistoryTypes.SUBMITTED]: 'pateikė pakartotinai prašymą įregistruoti sporto bazę',
  [HistoryTypes.RETURNED]: 'grąžino taisyti pateiktą prašymą įregistruoti sporto bazę',
  [HistoryTypes.REJECTED]: 'atmetė pateiktą prašymą įregistruoti sporto bazę',
  [HistoryTypes.APPROVED]: 'patvirtino prašymą įregistruoti sporto bazę',
};

export const membershipTypeLabels = {
  [MembershipTypes.LITHUANIAN]: 'Narystė Lietuvos sporto organizacijose',
  [MembershipTypes.INTERNATIONAL]: 'Narystė tarptautinėse nevyriausybinėse sporto organizacijose',
};

export const membershipTypeTableLabels = {
  [MembershipTypes.LITHUANIAN]: 'LT narystė',
  [MembershipTypes.INTERNATIONAL]: 'Tarptautinė narystė',
};

export const newClassifierLabels = {
  [ClassifierTypes.LEVEL]: 'Naujas sporto bazės lygis',
  [ClassifierTypes.TECHNICAL_CONDITION]: 'Nauja techninė būklė',
  [ClassifierTypes.SOURCE]: 'Naujas investicijos šaltinis',
  [ClassifierTypes.SPORTS_BASE_TYPE]: 'Naujas sporto bazės rūšis',
  [ClassifierTypes.SPORT_TYPE]: 'Nauja sporto šaka',
  [ClassifierTypes.SPORT_ORGANIZATION_TYPE]: 'Naujas sporto organizacijos tipas',
  [ClassifierTypes.LEGAL_FORMS]: 'Nauja teisinė forma',
  [ClassifierTypes.NATIONAL_TEAM_AGE_GROUP]: 'Nauja amžiaus grupė',
  [ClassifierTypes.NATIONAL_TEAM_GENDER]: 'Nauja lytis',
  [ClassifierTypes.WORK_RELATIONS]: 'Nauji darbo santykiai',
  [ClassifierTypes.COMPETITION_TYPE]: 'Naujas varžybų tipas',
  [ClassifierTypes.VIOLATIONS_ANTI_DOPING]: 'Naujas antidopingo taisyklių pažeidimas',
  [ClassifierTypes.ORGANIZATION_BASIS]: 'Nauja organizacijos veikla sporto bazėje',
  [ClassifierTypes.RESULT_TYPE]: 'Naujas varžybų rezultatas',
  [ClassifierTypes.SPORTS_BASE_SPACE_GROUP]: 'Nauja sporto bazės rūšis',
};

export const classifierLabels = {
  [ClassifierTypes.LEVEL]: 'Sporto bazės lygis',
  [ClassifierTypes.TECHNICAL_CONDITION]: 'Techninė būklė',
  [ClassifierTypes.SOURCE]: 'Investicijos šaltinis',
  [ClassifierTypes.SPORTS_BASE_TYPE]: 'Sporto bazės rūšis',
  [ClassifierTypes.SPORT_TYPE]: 'Sporto šaka',
  [ClassifierTypes.SPORT_ORGANIZATION_TYPE]: 'Sporto organizacijos tipas',
  [ClassifierTypes.LEGAL_FORMS]: 'Teisinė forma',
  [ClassifierTypes.NATIONAL_TEAM_AGE_GROUP]: 'Nacionalinės rinktinės amžiaus grupė',
  [ClassifierTypes.NATIONAL_TEAM_GENDER]: 'Nacionalinės rinktinės lytis',
  [ClassifierTypes.WORK_RELATIONS]: 'Darbo santykiai',
  [ClassifierTypes.COMPETITION_TYPE]: 'Varžybų tipas',
  [ClassifierTypes.VIOLATIONS_ANTI_DOPING]: 'Antidopingo taisyklių pažeidimas',
  [ClassifierTypes.ORGANIZATION_BASIS]: 'Organizacijos veikla sporto bazėje',
  [ClassifierTypes.RESULT_TYPE]: 'Varžybų rezultatas',
  [ClassifierTypes.SPORTS_BASE_SPACE_GROUP]: 'Sporto bazės erdvės rūšis',
};

export const trueLabels = {
  [SportTypeButtonKeys.olympic]: 'Olimpinė',
  [SportTypeButtonKeys.paralympic]: 'Paralimpinė',
  [SportTypeButtonKeys.strategic]: 'Strateginė',
  [SportTypeButtonKeys.technical]: 'Techninė',
  [SportTypeButtonKeys.deaf]: 'Kurčiųjų',
  [SportTypeButtonKeys.specialOlympics]: 'Specialioji olimpiada',
};

export const falseLabels = {
  [SportTypeButtonKeys.olympic]: 'Neolimpinė',
  [SportTypeButtonKeys.paralympic]: 'Ne',
  [SportTypeButtonKeys.strategic]: 'Nestrateginė',
  [SportTypeButtonKeys.technical]: 'Ne',
  [SportTypeButtonKeys.deaf]: 'Ne',
  [SportTypeButtonKeys.specialOlympics]: 'Ne',
};

export const matchTypeLabels = {
  [MatchTypes.INDIVIDUAL]: 'Individuali',
  [MatchTypes.TEAM]: 'Komandinė',
};

export const bonusTypeLabels = {
  [BonusType.NATIONAL]: 'Valstybinė',
  [BonusType.MUNICIPAL]: 'Savivaldybės',
};

export const scholarshipTypeLabel = {
  [ScholarshipType.ACTIVE]: 'Aktyvi',
  [ScholarshipType.SUSPENDED]: 'Sustabdyta',
  [ScholarshipType.TERMINATED]: 'Nutraukta',
};

export const legalFormLabels = {
  [LegalForms.COMPANY]: 'Juridinis',
  [LegalForms.PERSON]: 'Fizinis',
};

export const studiesTypeLabels = {
  [StudiesType.LEARNING]: 'Mokymasis',
  [StudiesType.STUDIES]: 'Studijos',
};

export const areUnitLabels = {
  [AreaUnits.HA]: 'ha',
  [AreaUnits.A]: 'a',
  [AreaUnits.M2]: 'm2',
};

export const featureLabels = {
  [Features.INSTITUTIONS]: 'Įstaigos',
  [Features.SPORTS_PERSONS]: 'Sporto asmenys',
  [Features.TEAMS]: 'Rinktinės',
  [Features.RESULTS]: 'Rezultatai',
  [Features.BONUSES]: 'Premijos',
  [Features.SCHOLARSHIPS]: 'Stipendijos',
  [Features.RENTS]: 'Rentos',
  [Features.VIOLATIONS]: 'Pažeidimai',
  [Features.SPORTS_BASES]: 'Sporto infrastruktųra',
};
