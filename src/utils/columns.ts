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
  [ClassifierTypes.SPACE_TYPE]: {
    name: { label: 'Sporto erdvės tipo pavadinimas', show: true },
  },
  [ClassifierTypes.SOURCE]: { name: { label: 'Investicijos šaltinio pavadinimas', show: true } },
  [ClassifierTypes.SPORTS_BASE_TYPE]: {
    name: { label: 'Sporto bazės tipo pavadinimas', show: true },
  },
  [ClassifierTypes.BUILDING_TYPE]: { name: { label: 'Pastato tipo pavadinimas', show: true } },
  [ClassifierTypes.SPORT_TYPE]: { name: { label: 'Sporto šakos pavadinimas', show: true } },
};
