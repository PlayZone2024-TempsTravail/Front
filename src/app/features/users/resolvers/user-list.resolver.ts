import { ResolveFn } from '@angular/router';
import {UserService} from "../services/user.service";
import {inject} from "@angular/core";
import {Observable} from "rxjs";
import {User} from "../models/user.model";

export const userListResolver: ResolveFn<Observable<User[]>> = (route, state) => {
    const userService: UserService = inject(UserService);
    return userService.getUsers();
};
