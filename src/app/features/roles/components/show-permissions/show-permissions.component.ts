import {Component, OnInit} from '@angular/core'
import {Permission} from '../../models/permission.model'
import {RolesService} from '../../services/roles.service'
import {Role, RoleAddForm, RoleDeleteForm} from '../../models/role.model'
import {RolePermission, RolePermissionUpdate} from '../../models/rolepermission.model';
import {CheckboxChangeEvent} from 'primeng/checkbox';
import {MessageService} from 'primeng/api';
import {ActivatedRoute} from '@angular/router';

@Component({
  selector: 'app-show-permissions',
  templateUrl: './show-permissions.component.html',
  styleUrl: './show-permissions.component.scss'
})
export class ShowPermissionsComponent implements OnInit{
    permissions: Permission[] = []
    filteredPermissions: Permission[] = []
    rolesLabel: Role[] = []
    rolePermissionAssoc: RolePermission[] = []

    checkboxStates: {[key: string]: boolean} = {}
    searchQuery: string = ''
    modification: RolePermissionUpdate = new RolePermissionUpdate()

    dialogNewVisible: boolean = false
    dialogDeleteVisible: boolean = false

    constructor(
        private _rolesService: RolesService,
        private _messageService: MessageService,
        private _ar: ActivatedRoute
    ) {}

    ngOnInit() {
        this._ar.data.subscribe((data: any) => {
            this.permissions = data.rolesData.permissions
            this.filteredPermissions = [...this.permissions];

            this.rolesLabel = data.rolesData.roles

            this.rolePermissionAssoc = data.rolesData.rolePermission
            this.initializeCheckboxStates()
        })
    }

    initializeCheckboxStates() {
        this.permissions.forEach(permission => {
            this.rolesLabel.forEach(role => {
                const key = `${role.idRole}-${permission.id}`
                this.checkboxStates[key] = this.getAssoc(role.idRole, permission.id)
            });
        });
    }

    getAssoc(role: number, permission: string): boolean {
        for (let rp of this.rolePermissionAssoc) {
            if (rp.roleId === role && rp.permissionId === permission) {
                return true
            }
        }
        return false
    }

    trackRole(index: number, role: any): number {
        return role.idRole;
    }

    searchPermissions() {
        this.filteredPermissions = this.permissions.filter(permission => {
            return `${permission.description}`.toLowerCase().includes(this.searchQuery.toLowerCase())
        })
    }

    onCheckBoxClick($event: CheckboxChangeEvent, idRole: number, idPermission: string) {
        if ($event.checked) {
            let found = false
            for (let rp of this.rolePermissionAssoc) {
                if (rp.roleId === idRole && rp.permissionId === idPermission) {
                    found = true
                    break
                }
            }
            if (!found) {
                this.modification.add.push({roleId: idRole, permissionId: idPermission})
            }

            for (let i = 0; i < this.modification.remove.length; i++) {
                if (this.modification.remove[i].roleId === idRole && this.modification.remove[i].permissionId === idPermission) {
                    this.modification.remove.splice(i, 1)
                    break
                }
            }
        }
        else if (!$event.checked) {
            let found = false
            for (let rp of this.rolePermissionAssoc) {
                if (rp.roleId === idRole && rp.permissionId === idPermission) {
                    found = true
                    break
                }
            }
            if (found) {
                this.modification.remove.push({roleId: idRole, permissionId: idPermission})
            }

            for (let i = 0; i < this.modification.add.length; i++) {
                if (this.modification.add[i].roleId === idRole && this.modification.add[i].permissionId === idPermission) {
                    this.modification.add.splice(i, 1)
                    break
                }
            }
        }
    }

    saveModification() {
        if (this.modification.add.length !== 0 || this.modification.remove.length !== 0) {
            this._rolesService.updatePermissionRole(this.modification).subscribe((e) => {
                this._messageService.add({
                    severity: 'success',
                    summary: 'Permission',
                    detail: 'Mise à jour effectuée avec succès',
                    key: 'update'
                })
            })
        }
        else {
            this._messageService.add({
                severity: 'info',
                summary: 'Permission',
                detail: 'Pas de mise à jour à effectuer',
                key: 'update'
            })
        }
    }

    openAddDialog() {
        this.dialogNewVisible = true
    }

    openDeleteDialog() {
        this.dialogDeleteVisible = true
    }

    onAddFormSubmit(rad: RoleAddForm) {
        if (rad.name !== '') {
            this._rolesService.newRole(rad).subscribe((role) => {
                this.rolesLabel.push(role)
                this.dialogNewVisible = false
            })
        }
    }

    onDeleteFormSubmit(rrf: RoleDeleteForm) {
        if (rrf.role.idRole > 0) {
            this._rolesService.deleteRole(rrf.role.idRole).subscribe(_ => {
                this.rolesLabel = this.rolesLabel.filter(role => role.idRole !== rrf.role.idRole)
                this.dialogDeleteVisible = false
            })
        }
    }
}
