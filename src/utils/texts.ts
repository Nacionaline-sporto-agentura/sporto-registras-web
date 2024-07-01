import { ButtonColors } from '../components/buttons/Button';
import {
  AdminRoleType,
  ClassifierTypes,
  HistoryTypes,
  LegalForms,
  MatchTypes,
  MembershipTypes,
  ServerErrorTypes,
  SportTypeButtonKeys,
  StatusTypes,
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
  [ServerErrorTypes.EMAIL_NOT_FOUND]: 'Sistemoje nėra tokio elektroninio pašto',
  personalCode: 'Blogas asmens kodas',
  companyCode: 'Blogas įmonės kodas',
  minCharacters: 'Privalote įvesti bent 3 simbolius',
};

export const descriptions = {
  protocolDocument: 'Protokolo dokumentas',
  resultInfo: 'Sporto varžybose pasiekti rezultatai',
  sportMatches: 'Sporto šakoje esančios sporto rungtys',
  competitionInfo: 'Sporto varžybų informacija',
  results: 'Rezultatai aukšto meistriškumo sporto varžybose',
  fundingSources: 'Pridėkite visas gautas investicijas skirtas pagerinimui',
  cantLogin: 'Norint prisijungti turi būti suteikta prieiga',
  tableNotFound: 'Atsiprašome nieko neradome pagal pasirinktus filtrus',
  deleteUsersWithGroup: 'Ką reikėtų daryti su šiai grupei priskirtais naudotojais?',
  disabledAccessible: 'Sporto bazė pritaikyta žmonėms su judėjimo negalia',
  blindAccessible: 'Sporto bazė pritaikyta žmonėms su regėjimo negalia',
  publicWifi: 'Yra Public WiFi internetas',
  plans: 'Pridėti sporto bazės planus geoerdviniais formatais (2D ir 3D)',
  energyClassCertificate: 'Energetinės klasės pažymėjimas',
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
};

export const formLabels = {
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
};

export const deleteTitles = {
  group: 'Ištrinti grupę',
  user: 'Ištrinti naudotoją',
  classifier: 'Ištrinti klasifikatorių',
};

export const deleteDescriptionFirstPart = {
  group: 'Ar esate tikri, kad norite ištrinti',
  user: 'Ar esate tikri, kad norite ištrinti',
  classifier: 'Ar esate tikri, kad norite ištrinti',
};

export const deleteDescriptionSecondPart = {
  group: 'grupę?',
  user: ' paskyrą?',
  classifier: {
    [ClassifierTypes.LEVEL]: ' sporto bazės lygio klasifikatorių?',
    [ClassifierTypes.TECHNICAL_CONDITION]: ' techninės būklės klasifikatorių?',
    [ClassifierTypes.SPACE_TYPE]: ' sporto erdvės tipo klasifikatorių?',
    [ClassifierTypes.SOURCE]: ' investicijos šaltinio klasifikatorių?',
    [ClassifierTypes.SPORTS_BASE_TYPE]: ' sporto bazės rūšies klasifikatorių?',
    [ClassifierTypes.SPORT_TYPE]: ' sporto šakos klasifikatorių?',
  },
};

export const inputLabels = {
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
  date: 'Data',
  users: 'naudotojai',
  basis: 'Pagrindas',
  spaces: 'Erdvės',
  status: 'Būsena',
  improvements: 'Atlikti pagerinimai',
  owners: 'Savininkai',
  photos: 'Nuotraukos',
  comment: 'Komentaras',
  buildingNumber: 'Unikalus statinio numeris',
  buildingArea: 'Bendrasis pastato plotas',
  energyClass: 'Energetinė klasė',
  buildingType: 'Pastato ar inžinerinio statinio rūšis',
  buildingPurpose: 'Statinio paskirtis',
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
  saunas: 'Pirties patalpų skaičius',
  parkingPlaces: 'Automobilių aikštelės vietų skaičius',
  dressingRooms: 'Persirengimo patalpų skaičius',
  plotNumber: 'Unikalus žemės sklypo numeris',
  plotArea: 'Žemės sklypo plotas',
  builtPlotArea: 'Žemės sklypo užstatytos teritorijos plotas',
  level: 'Sporto bazės lygmuo',
  technicalBaseCondition: 'Techninė bazės būklė',
  technicalSpaceCondition: 'Techninė erdvės būklė',
  sportBaseType: 'Sporto bazės rūšis',
  sportPersonSportType: 'Sporto šaka/-os',
  sportPersonType: 'Asmens tipas',
  sportBaseSpaceType: 'Sporto erdvės tipas',
  sportTypes: 'Kultivuojamos sporto šakos',
  address: 'Adresas',
  jarName: 'JAR Pavadinimas',
  jarCode: 'JAR Kodas',
  owner: 'Savininkas',
  code: 'JAR/Asmens Kodas',
  website: 'Svetainės adresas',
  websiteToProtocols: 'Nuoroda į interneto svetainę, kurioje pateikiami protokolai',
  source: 'Investicijų šaltinis',
  fundingSource: 'Finansavimo šaltinis',
  governingBodyName: 'Valdymo organo pavadinimas',
  organizationName: 'Organizacijos pavadinimas',
  startAt: 'Pradžia',
  membershipType: 'Narystės tipas',
  endAt: 'Pabaiga',
  membershipStart: 'Narystės pradžia',
  membershipEnd: 'Narystės pradžia',
  fundsAmount: 'Lėšų dydis',
  totalFundsAmount: 'Bendras lėšų dydis, Eur',
  membersCount: 'Narių skaičius',
  personalCode: 'Asmens kodas',
  appointedAt: 'Skyrimo data',
  parentOrganization: 'Tėvinė organizacija',
  name: 'Pavadinimas',
  companyCode: 'Juridinio asmens kodas',
  firstName: 'Vardas',
  lastName: 'Pavardė',
  oldPassword: 'Senas slaptažodis',
  newPassword: 'Naujas slaptažodis',
  repeatNewPassword: 'Pakartokite naują slaptažodį',
  phone: 'Telefonas',
  email: 'El. pašto adresas',
  duties: 'Pareigos',
  group: 'Grupė',
  organizationBasis: 'Kokiu pagrindu veikia organizacija',
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
  municipality: 'Savivaldybė',
  town: 'Miestas',
  street: 'Gatvės pavadinimas',
  houseNo: 'Namo Nr.',
  apartmentNo: 'Buto Nr.',
  citizenship: 'Pilietybė (-ės)',
  ownerType: 'Asmens tipas',
  fullName: 'Vardas, Pavardė',
};
export const pageTitles = {
  resultInfo: 'Rezultatų informacija',
  competitionInfo: 'Varžybų informacija',
  results: 'Rezultatai',
  users: 'Naudotojai',
  sportMatches: 'Sporto rungtys',
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
};

export const buttonsTitles = {
  addResult: 'Pridėti rezultatą',
  addMatch: 'Pridėti rungtį',
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
  addOwner: 'Pridėti savininką',
  goToBack: 'Grįžti atgal',
  group: 'Ištrinti grupę',
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
  registerSportsPerson: 'Įregistruoti sporto asmenį',
  registerResult: 'Naujas prašymas įvesti rezultatą',
  back: 'Atgal',
  next: 'Kitas',
};

export const emptyState = {
  sportBases: 'Nėra sukurtų sporto infrastruktūrų',
  sportsPersons: 'Nėra sukurtų sporto asmenų',
  results: 'Nėra sukurtų rezultatų',
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
  [ClassifierTypes.SPACE_TYPE]: 'Naujas sporto erdvės tipas',
  [ClassifierTypes.SOURCE]: 'Naujas investicijos šaltinis',
  [ClassifierTypes.SPORTS_BASE_TYPE]: 'Naujas sporto bazės rūšis',
  [ClassifierTypes.SPORT_TYPE]: 'Nauja sporto šaka',
  [ClassifierTypes.SPORT_ORGANIZATION_TYPE]: 'Naujas sporto organizacijos tipas',
  [ClassifierTypes.LEGAL_FORMS]: 'Nauja teisinė forma',
};

export const classifierLabels = {
  [ClassifierTypes.LEVEL]: 'Sporto bazės lygis',
  [ClassifierTypes.TECHNICAL_CONDITION]: 'Techninė būklė',
  [ClassifierTypes.SPACE_TYPE]: 'Sporto erdvės tipas',
  [ClassifierTypes.SOURCE]: 'Investicijos šaltinis',
  [ClassifierTypes.SPORTS_BASE_TYPE]: 'Sporto bazės rūšis',
  [ClassifierTypes.SPORT_TYPE]: 'Sporto šaka',
  [ClassifierTypes.SPORT_ORGANIZATION_TYPE]: 'Sporto organizacijos tipas',
  [ClassifierTypes.LEGAL_FORMS]: 'Teisinė forma',
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

export const legalFormLabels = {
  [LegalForms.COMPANY]: 'Juridinis',
  [LegalForms.PERSON]: 'Fizinis',
};
