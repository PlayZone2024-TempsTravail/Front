import {Timestamp} from 'rxjs';

export interface Project {
    idProject: number;
    isActive: boolean;
    name: string;
    organismeId: number;
    organismeName: string;
    color: string;
    montantBudget: number;
    dateDebutProjet: Date;
    dateFinProjet: Date;
    chargeDeProjetId: number;
    chargeDeProjetName: string;
    previsionDepenseActuelle : number;
    depenseReelActuelle : number;
}

export interface Charge_de_projet {
    idUser: number;
    nom: string;
    prenom: string;
}

// models encodage-couts
export interface Depense {
    id_depense: number,
    libelle: Libelle[],
    organisme_intervenant_ext: string,
    motif: string,
    montant: number,
    date_prestation? : string,
    date_facturation: string,
}

export interface Libelle {
    id_libelle: number,
    libelle: string,
}

export interface LibeleWithName {
    idLibele: number,
    idCategory: number,
    name: string,
}


