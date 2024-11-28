// modèle des infos à récupérer d'un utilisateur
export interface UserDTO {
    id: number;
    nom: string;
    prenom: string;
    email: string;
    isActive: boolean;
    roles: Role[];
    historique: HistoriqueEntry[];
}


export interface Role {
    idRole: number;
    name: string;
}

export interface HistoriqueEntry {
    date: string;
    salaire: number;
    regime: number;
}

export interface UserForm {
    nom: string;
    prenom: string;
    email: string;
    password: string;
    roles: number[]; // Liste des idRole sélectionnés
    salaire: number;
    regime: number;
    date: string; // Date pour le salaire et le régime
    isActive?: boolean;
}

