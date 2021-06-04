import { ISkills } from './iskills';

export interface IEmployee {
  id: number;
  fullName: string;
  email: string;
  phone?: number;
  contactPreference: string;
  skills: ISkills[];
}
