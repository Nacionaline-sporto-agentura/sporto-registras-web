import { ServerErrorMessages } from './constants';

export const validationTexts = {
  requireText: 'Privalote įvesti',
  photoNotUploaded: 'Nuotrauka neįkelta',
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
