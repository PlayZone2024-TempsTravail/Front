// MODIFICATION ICI (NOUVEAU FICHIER)
// Modèle pour représenter les compteurs d'un utilisateur sur une catégorie de Worktime.

// Représente un compteur par catégorie pour un utilisateur
export interface CompteurWorktimeCategoryDTO {
    userId: number;
    worktimeCategoryId: number;
    quantity: number;
}

// Pour la mise à jour d'un compteur existant
export interface CompteurWorktimeCategoryUpdateDTO {
    worktimeCategoryId: number;
    quantity: number;
}

// Pour la suppression d'un compteur
export interface CompteurWorktimeCategoryDeleteDTO {
    userId: number;
    worktimeCategoryId: number;
}

// Catégorie de Worktime, pour obtenir un nom à afficher
export interface WorktimeCategoryDTO {
    idWorktimeCategory: number;
    abreviation: string;
    name: string;
    displayLabel: string; // Propriété combinée
}
