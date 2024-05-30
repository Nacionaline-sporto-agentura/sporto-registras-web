import { createSlice } from '@reduxjs/toolkit';
import {
  ClassifierFilters,
  SimpleFilters,
  UnconfirmedRequestFilters,
  UserFilters,
} from '../../types';
import { ClassifierTypes } from '../../utils/constants';

interface UsersFiltersState {
  userFilters: UserFilters;
  groupFilters: SimpleFilters;
  institutionFilters: SimpleFilters;
  organizationFilters: SimpleFilters;
  sportBaseFilters: SimpleFilters;
  unconfirmedOrganizationFilters: UnconfirmedRequestFilters;
  unconfirmedSportBaseFilters: UnconfirmedRequestFilters;
  classifierFilters: ClassifierFilters;
}

const initialState: UsersFiltersState = {
  userFilters: {},
  groupFilters: {},
  institutionFilters: {},
  organizationFilters: {},
  unconfirmedOrganizationFilters: {},
  unconfirmedSportBaseFilters: {},
  sportBaseFilters: {},
  classifierFilters: {
    [ClassifierTypes.LEVEL]: {},
    [ClassifierTypes.TECHNICAL_CONDITION]: {},
    [ClassifierTypes.SPACE_TYPE]: {},
    [ClassifierTypes.SOURCE]: {},
    [ClassifierTypes.SPORTS_BASE_TYPE]: {},
    [ClassifierTypes.BUILDING_TYPE]: {},
    [ClassifierTypes.SPORT_TYPE]: {},
    [ClassifierTypes.SPORT_ORGANIZATION_TYPE]: {},
    [ClassifierTypes.LEGAL_FORMS]: {},
  },
};

export const filtersReducer = createSlice({
  name: 'userFilters',
  initialState,
  reducers: {
    setUserFilters: (state, action) => {
      return { ...state, userFilters: action.payload };
    },
    setGroupFilters: (state, action) => {
      return { ...state, groupFilters: action.payload };
    },
    setInstitutionFilters: (state, action) => {
      return { ...state, institutionFilters: action.payload };
    },
    setOrganizationFilters: (state, action) => {
      return { ...state, organizationFilters: action.payload };
    },
    setSportBaseFilters: (state, action) => {
      return { ...state, sportBaseFilters: action.payload };
    },
    setUnconfirmedOrganizationFilters: (state, action) => {
      return { ...state, unconfirmedOrganizationFilters: action.payload };
    },
    setUnconfirmedSportBaseFilters: (state, action) => {
      return { ...state, unconfirmedSportBaseFilters: action.payload };
    },
    seClassifierFilters: (state, action) => {
      return {
        ...state,
        classifierFilters: {
          ...state.classifierFilters,
          ...action.payload,
        },
      };
    },
  },
});

export default filtersReducer.reducer;

export const actions = filtersReducer.actions;
