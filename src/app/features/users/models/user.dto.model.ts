// UserDTO représente un utilisateur avec ses rôles et ses salaires.
export interface UserDTO {
    idUser: number;
    nom: string;
    prenom: string;
    email: string;
    isActive: boolean;
    userRoles: UserRole[];
    userSalaires: UserSalaire[];
}

// UserRole représente un rôle d'utilisateur.
export interface UserRole {
    roleId: number;
    userId: number;
    roleName: string;
}

// Role représente un rôle.
export interface Role {
    idRole: number;
    name: string;
}

// UserSalaire représente un salaire d'utilisateur.
export interface UserSalaire {
    userId: number;
    date: Date; // Format ISO 8601
    regime: number;
    montant: number;
}

// UserForm représente un formulaire d'utilisateur : ajout ou modification.
export interface UserForm {
    nom: string;
    prenom: string;
    email: string;
    password?: string; // présent dans le form d'ajout mais pas dans le form de modification
    roles: number[]; // Liste des roleId sélectionnés
    montant: number;
    regime: number;
    date: Date;
    isActive?: boolean;
}
