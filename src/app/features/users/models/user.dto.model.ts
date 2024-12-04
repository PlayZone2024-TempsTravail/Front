// modèle des infos à récupérer d'un utilisateur
export interface UserDTO {
    idUser: number;
    nom: string;
    prenom: string;
    email: string;
    isActive: boolean;
    userRoles: UserRole[];
    userSalaires: UserSalaire[];
}

export interface UserRole {
    roleId: number;
    roleName: string;
}

export interface Role {
    idRole: number;
    name: string;
}


export interface UserSalaire {
    idUserSalaire: number;
    date: string;
    regime: number;
    montant: number;
}


export interface UserForm {
    nom: string;
    prenom: string;
    email: string;
    password?: string; // Optionnel pour la modification
    roles: number[]; // Liste des roleId sélectionnés
    montant: number;
    regime: number;
    date: string;
    isActive?: boolean;
}

