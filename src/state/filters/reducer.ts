import { createSlice } from '@reduxjs/toolkit';
import { SimpleFilters, UnconfirmedRequestFilters, UserFilters } from '../../types';

interface UsersFiltersState {
  userFilters: UserFilters;
  groupFilters: SimpleFilters;
  institutionFilters: SimpleFilters;
  organizationFilters: SimpleFilters;
  sportBaseFilters: SimpleFilters;
  unconfirmedOrganizationFilters: UnconfirmedRequestFilters;
  unconfirmedSportBaseFilters: UnconfirmedRequestFilters;
}

const initialState: UsersFiltersState = {
  userFilters: {},
  groupFilters: {},
  institutionFilters: {},
  organizationFilters: {},
  unconfirmedOrganizationFilters: {},
  unconfirmedSportBaseFilters: {},
  sportBaseFilters: {},
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
  },
});

export default filtersReducer.reducer;

export const actions = filtersReducer.actions;
