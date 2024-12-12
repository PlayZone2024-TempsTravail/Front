// Modèle RentreeDTO
export interface RentreeDTO {
    idRentree: number;
    idLibele: number;
    idProject: number;
    idOrganisme: number;
    montant: number;
    dateFacturation: Date;
    motif?: string;
}

// Modèle RentreeCreateFormDTO pour la création d'une nouvelle rentrée
export interface RentreeCreateFormDTO {
    idLibele: number;
    categoryId: number;
    idProject: number;
    idOrganisme: number;
    montant: number;
    dateFacturation: Date;
    motif?: string;
}

// Modèle RentreeUpdateFormDTO pour la mise à jour d'une rentrée existante
export interface RentreeUpdateFormDTO {
    idLibele: number;
    categoryId: number;
    idProject: number;
    idOrganisme: number;
    montant: number;
    dateFacturation: Date;
    motif?: string;
}


// Modèle OrganismeDTO
export interface OrganismeDTO {
    idOrganisme: number;
    name: string;
}

// Modèle LibeleDTO
export interface LibeleDTO {
    isIncome: boolean;
    idCategory: number;
    categoryName?: string;
    idLibele: number;
    libeleName?: string;
}

// Modèle ProjectDTO
export interface ProjectDTO {
    idProject: number;
    isActive: boolean;
    name?: string;
    organismeId: number;
    organismeName?: string;
    color?: string;
    montantBudget: number;
    dateDebutProjet: Date;
    dateFinProjet: Date;
    chargeDeProjetId: number;
    chargeDeProjetName?: string;
    previsionDepenseActuelle: number;
    depenseReelActuelle: number;
}
