import { createSlice } from '@reduxjs/toolkit';
import { GroupFilters, UserFilters } from '../../types';

interface UsersFiltersState {
  userFilters: UserFilters;
  groupFilters: GroupFilters;
  institutionFilters: GroupFilters;
}

const initialState: UsersFiltersState = {
  userFilters: {},
  groupFilters: {},
  institutionFilters: {},
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
  },
});

export default filtersReducer.reducer;

export const actions = filtersReducer.actions;
