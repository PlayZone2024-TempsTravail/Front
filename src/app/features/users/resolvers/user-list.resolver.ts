import { ResolveFn } from '@angular/router';
import {UserService} from "../services/user.service";
import {inject} from "@angular/core";
import {Observable} from "rxjs";
import {UserDTO} from "../models/user.dto.model";

export const userListResolver: ResolveFn<Observable<UserDTO[]>> = (route, state) => {
    const userService: UserService = inject(UserService);
    return userService.getUsers();
};
