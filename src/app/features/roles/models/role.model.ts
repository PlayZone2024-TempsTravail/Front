export interface Role {
    idRole: number
    name: string
    isRemovable: boolean
    isVisible: boolean
}

export interface RoleAddForm {
    name: string
}

export interface RoleDeleteForm {
    role: Role
}

export interface RoleEditForm {
    idRole: number
    name: string
}
