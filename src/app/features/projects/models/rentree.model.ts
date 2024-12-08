// Modèle RentreeDTO
export interface RentreeDTO {
    idRentree: number;
    idLibele: number;
    idProject: number;
    idOrganisme: number;
    montant: number;
    dateFacturation: string;
    motif?: string;
}

// Modèle RentreeCreateFormDTO pour la création d'une nouvelle rentrée
export interface RentreeCreateFormDTO {
    idLibele: number;
    idProject: number;
    idOrganisme: number;
    montant: number;
    dateFacturation: string;
    motif?: string;
}

// Modèle RentreeUpdateFormDTO pour la mise à jour d'une rentrée existante
export interface RentreeUpdateFormDTO {
    idLibele: number;
    idProject: number;
    idOrganisme: number;
    montant: number;
    dateFacturation: string;
    motif?: string;
}
