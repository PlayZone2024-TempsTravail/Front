export interface User {
    idUser: number;
    roleId: number;
    isActive: boolean;
    nom: string;
    prenom: string;
    email: string;
    password: string;
    heuresAnnuellesPrestables: number;
    VA: number;
    VAEX: number;
    RC: number;
}
