import {Validators} from '@angular/forms';

export const DepenseCreateForm = {
    categoryId: [null, Validators.required],
    libeleId: [null, Validators.required],
    organismeId: [null],
    motif: [null],
    montant: [null, [Validators.required, Validators.min(0)]],
    dateIntervention: [null],
    dateFacturation: [null, Validators.required],
}
