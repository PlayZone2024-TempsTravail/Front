import {Timestamp} from 'rxjs';

export interface Project {
    idProject: number;
    isActive: boolean;
    name: string;
    organismeId: number;
    organismeName: string;
    color: string;
    montantBudget: number;
    dateDebutProjet: Date;
    dateFinProjet: Date;
    chargeDeProjetId: number;
    chargeDeProjetName: string;
    previsionDepenseActuelle : number;
    depenseReelActuelle : number;
}
