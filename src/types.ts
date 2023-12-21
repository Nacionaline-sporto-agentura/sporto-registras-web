import { RoleType } from './utils/constants';

export interface User {
  id?: string;
  firstName?: string;
  role?: RoleType;
  fullName?: string;
  lastName?: string;
  email?: string;
  type?: RoleType;
  phone?: string;
  profiles?: Profile[];
}

export type ProfileId = 'freelancer' | string;

export interface Profile {
  id: ProfileId;
  name: string;
  freelancer: boolean;
  email?: string;
  code?: string;
  role: RoleType;
}
