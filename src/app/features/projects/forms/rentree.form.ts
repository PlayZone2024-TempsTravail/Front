import { Validators } from '@angular/forms';

/**
 * Formulaire pour la création d'une nouvelle rentrée.
 */
export const RentreeCreateForm = {
    idLibele: [null, Validators.required], // Libellé requis
    idOrganisme: [null], // Organisme requis
    montant: [null, [Validators.required, Validators.min(0)]], // Montant requis et doit être >= 0
    dateFacturation: [null, Validators.required], // Date de facturation requise
    motif: [null], // Motif facultatif
};
