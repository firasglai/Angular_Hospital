import { SpecialtyModel } from "./specialty.model";
export interface Doctor {
    id?: number;
    fullName: string;
    dateOfBirth: string; //Date
    email: string;
    phone: string;
    address: string;
    specialty: SpecialtyModel;
}
