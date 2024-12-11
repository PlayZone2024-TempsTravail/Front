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

// PAS TOUCHE

export interface InOut {
    date: string; // e.g., "12-2024"
    montant: number;
}

export interface LibelleExpenses {
    name: string; // e.g., "Experts/Intervenants externes"
    inOuts: InOut[];
}

export interface Category {
    name: string; // e.g., "Renumeration"
    isIncome: boolean;
    libelles: LibelleExpenses[]; // Updated to reference LibelleExpenses
    totals?: { [month: string]: number }; // Optional for transformed totals
    data?: { libelle: string; data: { [month: string]: number } }[]; // Transformed data
}

export interface Organisme {
    idOrganisme: number,
    name: string,
}
export interface LibeleWithName {
    isIncome: boolean,
    idLibele: number,
    idCategory: number,
    libeleName: string,
    categoryName: string,
}

export interface Category {
    idCategory: number,
    name: string,
    isIncome: boolean,
    estimationParCategorie: boolean,
}

