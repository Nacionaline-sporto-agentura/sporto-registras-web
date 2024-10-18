import { ClassifierTypes } from './constants';

export const groupColumns = {
  name: { label: 'Grupės pavadinimas', show: true },
};

export const groupUserLabels = {
  name: { label: 'Naudotojas', show: true },
  role: { label: 'Rolė', show: true },
  phone: { label: 'Telefonas', show: true },
  email: { label: 'El. paštas', show: true },
};

export const organizationColumns = {
  name: { label: 'Sporto organizacijos pavadinimas', show: true },
  code: { label: 'Kodas', show: true },
  email: { label: 'El. paštas', show: true },
  phone: { label: 'Telefonas', show: true },
  parentName: { label: 'Tėvinė organizacija', show: true },
  status: { label: 'Būsena', show: true },
};

export const institutionColumns = {
  name: { label: 'Įstaigos pavadinimas', show: true },
  code: { label: 'Kodas', show: true },
  email: { label: 'El. paštas', show: true },
  phone: { label: 'Telefonas', show: true },
  type: { label: 'Tipas', show: true },
};

export const classifierColumns = {
  [ClassifierTypes.LEVEL]: { name: { label: 'Sporto bazės lygio pavadinimas', show: true } },
  [ClassifierTypes.TECHNICAL_CONDITION]: {
    name: { label: 'Techninės būklės pavadinimas', show: true },
  },
  [ClassifierTypes.SOURCE]: { name: { label: 'Investicijos šaltinio pavadinimas', show: true } },
  [ClassifierTypes.SPORTS_BASE_TYPE]: {
    name: { label: 'Sporto bazės rūšies pavadinimas', show: true },
  },
  [ClassifierTypes.SPORT_TYPE]: { name: { label: 'Sporto šakos pavadinimas', show: true } },
  [ClassifierTypes.SPORT_ORGANIZATION_TYPE]: {
    name: { label: 'Sporto organizacijos tipo pavadinimas', show: true },
  },
  [ClassifierTypes.LEGAL_FORMS]: { name: { label: 'Teisinės formos pavadinimas', show: true } },
  [ClassifierTypes.NATIONAL_TEAM_AGE_GROUP]: {
    name: { label: 'Amžiaus grupės pavadinimas', show: true },
  },
  [ClassifierTypes.WORK_RELATIONS]: { name: { label: 'Darbo santykių pavadinimas', show: true } },
  [ClassifierTypes.NATIONAL_TEAM_GENDER]: { name: { label: 'Lyties pavadinimas', show: true } },
  [ClassifierTypes.COMPETITION_TYPE]: { name: { label: 'Varžybų tipo pavadinimas', show: true } },
  [ClassifierTypes.VIOLATIONS_ANTI_DOPING]: {
    name: { label: 'Antidopingo taisyklių pažeidimo pavadinimas', show: true },
  },
  [ClassifierTypes.ORGANIZATION_BASIS]: {
    name: { label: 'Organizacijos veiklos sporto bazėje pavadinimas', show: true },
  },
  [ClassifierTypes.RESULT_TYPE]: { name: { label: 'Varžybų rezultato pavadinimas', show: true } },
  [ClassifierTypes.SPORTS_BASE_SPACE_GROUP]: {
    name: { label: 'Sporto bazės erdvės rūšies pavadinimas', show: true },
  },
};

export const permissionColumns = {
  group: { label: 'Grupė', show: true },
  role: { label: 'Rolė', show: true },
  features: { label: 'Meniu prieiga', show: true },
};
