import { Injectable } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Injectable({
    providedIn: 'root',
})
export class ProjectModificationForm {
    constructor(private fb: FormBuilder) {}

    createIncomeForm(): FormGroup {
        return this.fb.group({
            date: ['', Validators.required],
            motif: ['', Validators.required],
            libeleId: ['', Validators.required],
            montant: [0, [Validators.required, Validators.min(1)]],
        });
    }
}
