export interface Project {
    id_project: number;
    organismes: Organisme[] ;
    isActive: boolean;
    name: string;
    montant_budget: number;
    color: string;
    date_debut_projet: string;
    date_fin_projet: string;
    charges_de_projet: Charge_de_projet[];
}

export interface Organisme {
    id_organisme: number;
    name: string;
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


