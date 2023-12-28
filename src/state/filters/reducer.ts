import { createSlice } from '@reduxjs/toolkit';
import { GroupFilters, UserFilters } from '../../types';

interface UsersFiltersState {
  userFilters: UserFilters;
  groupFilters: GroupFilters;
}

const initialState: UsersFiltersState = {
  userFilters: {},
  groupFilters: {},
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
  },
});

export default filtersReducer.reducer;

export const actions = filtersReducer.actions;
