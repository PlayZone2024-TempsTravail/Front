import {Validators} from '@angular/forms';

export const DepenseCreateForm = {
    libeleId: [null, Validators.required],
    organismeId: [null, Validators.required],
    motif: [null],
    montant: [null, [Validators.required, Validators.min(0)]],
    dateIntervention: [null],
    dateFacturation: [null, Validators.required],
}
