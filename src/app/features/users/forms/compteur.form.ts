import {Validators} from '@angular/forms';

export const CompteurCreateUpdateForm = {
    worktimeCategoryId: [null, Validators.required],
    quantity: [0, [Validators.required, Validators.min(0)]]
}
