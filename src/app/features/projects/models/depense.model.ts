export interface DepenseDTO {
    idDepense: number;
    libeleId: number;
    projectId: number;
    organismeId: number;
    montant: number;
    dateIntervention?: string; // date-time format
    dateFacturation: string;  // date-time format
    motif: string;           // nullable
}

export interface  CreateDepenseDTO {

}

export interface OrganismeDTO {
    idOrganisme: number;
    name: string;
}

export interface LibeleDTO {
    idLibele: number;
    idCategory: number;
    name?: string;
}

export interface CategoryDTO {
    idCategory: number;
    name: string;
    isIncome: boolean;
    estimationParCategorie: boolean;
}

export interface ProjectDTO {
    idProject: number;
    isActive: boolean;
    name?: string;
    organismeId: number;
    organismeName?: string;
    color?: string;
    montantBudget: number;
    dateDebutProjet: string;
    dateFinProjet: string;
    chargeDeProjetId: number;
    chargeDeProjetName?: string;
    previsionDepenseActuelle: number;
    depenseReelActuelle: number;
}

