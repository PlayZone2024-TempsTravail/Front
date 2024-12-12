export interface RolePermission {
    roleId: number
    permissionId: string
}

export class RolePermissionUpdate {
    add: RolePermission[] = []
    remove: RolePermission[] = []
}
