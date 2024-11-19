import {Component, OnInit} from '@angular/core';
import {User} from '../../models/user.model';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrl: './user-list.component.scss'
})
export class UserListComponent implements OnInit{
    users: User[] = [];

    // Variable pour contrôler l'affichage du dialogue d'ajout d'utilisateur
    displayAddUserDialog: boolean = false;

    constructor() { }

    ngOnInit(): void {
        this.users = [
            {
                id_user: 1,
                role_Id: 1,
                isActive: true,
                nom: 'Dupont',
                prenom: 'Jean',
                email: 'jean.dupont@example.com',
                heures_annuelles_prestables: 1600,
                VA: 20,
                VAEX: 5,
                RC: 10
            },
            {
                id_user: 2,
                role_Id: 2,
                isActive: true,
                nom: 'Martin',
                prenom: 'Marie',
                email: 'marie.martin@example.com',
                heures_annuelles_prestables: 1600,
                VA: 25,
                VAEX: 4,
                RC: 12
            },
            {
                id_user: 3,
                role_Id: 3,
                isActive: false,
                nom: 'Bernard',
                prenom: 'Paul',
                email: 'paul.bernard@example.com',
                heures_annuelles_prestables: 1500,
                VA: 22,
                VAEX: 6,
                RC: 8
            },
            {
                id_user: 4,
                role_Id: 2,
                isActive: true,
                nom: 'Dubois',
                prenom: 'Anne',
                email: 'anne.dubois@example.com',
                heures_annuelles_prestables: 1600,
                VA: 18,
                VAEX: 5,
                RC: 11
            },
            {
                id_user: 5,
                role_Id: 1,
                isActive: true,
                nom: 'Thomas',
                prenom: 'Luc',
                email: 'luc.thomas@example.com',
                heures_annuelles_prestables: 1600,
                VA: 20,
                VAEX: 5,
                RC: 9
            },
            {
                id_user: 6,
                role_Id: 2,
                isActive: false,
                nom: 'Petit',
                prenom: 'Julie',
                email: 'julie.petit@example.com',
                heures_annuelles_prestables: 1550,
                VA: 23,
                VAEX: 4,
                RC: 10
            },
            {
                id_user: 7,
                role_Id: 3,
                isActive: true,
                nom: 'Robert',
                prenom: 'David',
                email: 'david.robert@example.com',
                heures_annuelles_prestables: 1600,
                VA: 21,
                VAEX: 6,
                RC: 12
            },
            {
                id_user: 8,
                role_Id: 2,
                isActive: true,
                nom: 'Richard',
                prenom: 'Emma',
                email: 'emma.richard@example.com',
                heures_annuelles_prestables: 1600,
                VA: 19,
                VAEX: 5,
                RC: 11
            },
            {
                id_user: 9,
                role_Id: 1,
                isActive: true,
                nom: 'Durand',
                prenom: 'Pierre',
                email: 'pierre.durand@example.com',
                heures_annuelles_prestables: 1600,
                VA: 20,
                VAEX: 5,
                RC: 10
            },
            {
                id_user: 10,
                role_Id: 2,
                isActive: true,
                nom: 'Leroy',
                prenom: 'Sophie',
                email: 'sophie.leroy@example.com',
                heures_annuelles_prestables: 1600,
                VA: 24,
                VAEX: 4,
                RC: 9
            },
            {
                id_user: 11,
                role_Id: 3,
                isActive: true,
                nom: 'Moreau',
                prenom: 'Thomas',
                email: 'thomas.moreau@example.com',
                heures_annuelles_prestables: 1600,
                VA: 22,
                VAEX: 5,
                RC: 12
            },
            {
                id_user: 12,
                role_Id: 2,
                isActive: false,
                nom: 'Simon',
                prenom: 'Isabelle',
                email: 'isabelle.simon@example.com',
                heures_annuelles_prestables: 1550,
                VA: 20,
                VAEX: 6,
                RC: 8
            },
            {
                id_user: 13,
                role_Id: 1,
                isActive: true,
                nom: 'Laurent',
                prenom: 'Michel',
                email: 'michel.laurent@example.com',
                heures_annuelles_prestables: 1600,
                VA: 21,
                VAEX: 5,
                RC: 10
            },
            {
                id_user: 14,
                role_Id: 2,
                isActive: true,
                nom: 'Lefebvre',
                prenom: 'Chloé',
                email: 'chloe.lefebvre@example.com',
                heures_annuelles_prestables: 1600,
                VA: 23,
                VAEX: 4,
                RC: 11
            },
            {
                id_user: 15,
                role_Id: 3,
                isActive: true,
                nom: 'Faure',
                prenom: 'Alexandre',
                email: 'alexandre.faure@example.com',
                heures_annuelles_prestables: 1600,
                VA: 19,
                VAEX: 5,
                RC: 9
            }
        ];
    }

    getRoleName(roleId: number): string {
        switch (roleId) {
            case 1:
                return 'Admin';
            case 2:
                return 'Employé';
            case 3:
                return 'Chargé de mission';
            default:
                return 'Inconnu';
        }
    }

    showAddUserDialog() {
        this.displayAddUserDialog = true;
    }
}
