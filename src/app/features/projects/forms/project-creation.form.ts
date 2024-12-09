import { Injectable } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Injectable({
    providedIn: 'root',
})
export class ProjectCreationForm {
    constructor(private fb: FormBuilder) {}

    createForm(): FormGroup {
        return this.fb.group({
            name: ['', [Validators.required]],
            organismeId: [[Validators.required]],
            chargerDeProjetId: [[Validators.required]],
            montantBudget: [0,[Validators.required, Validators.min(0)]],
            dateDebutProjet: [[Validators.required]],
            dateFinProjet: [[Validators.required]],
            isActive: [true, [Validators.required]],
            color: [[Validators.required]],
        });
    }
}
