import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import Cookies from 'universal-cookie';
import type { AppDispatch, RootState } from '../state/store';

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
const cookies = new Cookies();
