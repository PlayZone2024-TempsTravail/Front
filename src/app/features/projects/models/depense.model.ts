// Modèle DepenseDTO
export interface DepenseDTO {
    idDepense: number;
    libeleId: number;
    projectId: number;
    organismeId: number;
    montant: number;
    dateIntervention?: Date;
    dateFacturation: Date;
    motif?: string;
}

// Modèle CreateDepenseDTO pour la création d'une nouvelle dépense
export interface CreateDepenseDTO {
    libeleId: number;
    projectId: number;
    organismeId: number;
    montant: number;
    dateIntervention?: Date;
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
    idLibele: number;
    idCategory: number;
    name?: string;
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
