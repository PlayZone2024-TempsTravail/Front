import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { UserDTO, UserForm, Role, UserRole, UserSalaire } from '../../models/user.dto.model';
import { UserService } from '../../services/user.service';
import { UserCreateUpdateForm } from '../../forms/user.form';

@Component({
    selector: 'app-user-form',
    templateUrl: './user-form.component.html',
    styleUrls: ['./user-form.component.scss']
})
export class UserFormComponent implements OnInit, OnChanges {
    @Input() userData: UserDTO | null = null;
    @Output() formSubmit = new EventEmitter<UserForm>();

    userForm: FormGroup;
    roles: Role[] = [];
    statusOptions = [
        { label: 'Actif', value: true },
        { label: 'Inactif', value: false },
    ];
    displayHistoryDialog: boolean = false;
    historique: UserSalaire[] = [];

    constructor(private _fb: FormBuilder, private userService: UserService) {
        this.userForm = this._fb.group({...UserCreateUpdateForm});
    }

    ngOnInit(): void {
        this.userService.getRoles().subscribe({
            next: (roles) => { this.roles = roles; },
            error: (err) => { console.error("Erreur getRoles:", err); }
        });
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes['userData']) {
            if (this.userData) {
                // Mode modification
                this.preloadFormData();
            } else {
                // Mode ajout
                this.userForm.reset();
            }
        }
    }

    private preloadFormData() {
        if (this.userData) {
            this.userForm.patchValue({
                nom: this.userData.nom,
                prenom: this.userData.prenom,
                email: this.userData.email,
                roles: this.userData.userRoles.map((role: UserRole) => role.roleId),
                montant: this.userData.userSalaires[0]?.montant || null,
                regime: this.userData.userSalaires[0]?.regime || null,
                date: this.userData.userSalaires[0]?.date || null,
                isActive: this.userData.isActive,
                password: null
            });
            this.historique = this.userData.userSalaires;
        }
    }

    openHistory() {
        this.displayHistoryDialog = true;
    }

    closeHistory() {
        this.displayHistoryDialog = false;
    }

    submit() {
        if (this.userForm.invalid) {
            this.userForm.markAllAsTouched();
            return;
        }

        const formValue = this.userForm.value;

        const userForm: UserForm = {
            nom: formValue.nom ?? this.userData?.nom,
            prenom: formValue.prenom ?? this.userData?.prenom,
            email: formValue.email ?? this.userData?.email,
            password: formValue.password,
            roles: formValue.roles ?? this.userData?.userRoles.map(r => r.roleId) ?? [],
            montant: formValue.montant ?? this.userData?.userSalaires[0]?.montant,
            regime: formValue.regime ?? this.userData?.userSalaires[0]?.regime,
            date: formValue.date ?? this.userData?.userSalaires[0]?.date,
            isActive: formValue.isActive ?? this.userData?.isActive,
        };

        console.log('Données du formulaire soumises :', userForm);
        this.formSubmit.emit(userForm);
    }
}
