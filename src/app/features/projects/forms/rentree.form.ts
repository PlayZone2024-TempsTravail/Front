import { Validators } from '@angular/forms';

/**
 * Formulaire pour la création d'une nouvelle rentrée.
 */
export const RentreeCreateForm = {
    libeleId: [null, Validators.required], // Libellé requis
    organismeId: [null, Validators.required], // Organisme requis
    montant: [null, [Validators.required, Validators.min(0)]], // Montant requis et doit être >= 0
    dateFacturation: [null, Validators.required], // Date de facturation requise
    motif: [null], // Motif facultatif
};
