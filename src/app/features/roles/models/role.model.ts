export interface Role {
    idRole: number
    name: string
}

export interface RoleAddForm {
    name: string
}

export interface RoleDeleteForm {
    role: Role
}
