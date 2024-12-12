import { ResolveFn } from '@angular/router'
import {RolesService} from '../services/roles.service'
import {Observable, forkJoin} from 'rxjs'
import {Permission} from '../models/permission.model'
import {inject} from '@angular/core'

export const rolesResolver: ResolveFn<Observable<any>> = (route, state) => {
    const _rolesService: RolesService = inject(RolesService)
    return forkJoin({
        permissions: _rolesService.getListOfPermissions(),
        roles: _rolesService.getListOfRoles(),
        rolePermission: _rolesService.getListOfRolesPermissions()
    })
}
