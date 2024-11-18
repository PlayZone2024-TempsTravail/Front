import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { LoginFormModel } from "../models/login.form.model";
import { UserTokenDtoModel } from "../models/user.token.dto.model";
import { BehaviorSubject, Observable, tap, map } from "rxjs";
import { Router } from "@angular/router";

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private _currentUser$: BehaviorSubject<UserTokenDtoModel | undefined>;

  constructor(
    private readonly _http: HttpClient,
    private readonly _router: Router
  ) {
    let jsonUser = localStorage.getItem('currentUser');
    if (jsonUser) {
      this._currentUser$ = new BehaviorSubject<UserTokenDtoModel | undefined>(JSON.parse(jsonUser));
    } else {
      this._currentUser$ = new BehaviorSubject<UserTokenDtoModel | undefined>(undefined);
    }
  }

  login(form: LoginFormModel): Observable<UserTokenDtoModel> {
    // Appel l'API JSON Server 
    return this._http.get<any[]>(`http://localhost:3000/admin`).pipe(
      map(users => {
        const user = users.find(u => u.email === form.email && u.password === form.password);
        if (!user) {
          throw new Error("Identifiants invalides");
        }
        return {
            token: 'fake-jwt-token',
            email: user.email,
            roles: ['Admin']
          } as unknown as UserTokenDtoModel;
      }),
      tap(user => {
        this._currentUser$.next(user);
        localStorage.setItem("currentUser", JSON.stringify(user));
      })
    );
  }

  logout() {
    this._currentUser$.next(undefined);
    localStorage.removeItem("currentUser");
    this._router.navigate(["/auth/login"]);
  }

  get currentUser(): UserTokenDtoModel | undefined {
    return this._currentUser$.value;
  }

  get currentUser$(): Observable<UserTokenDtoModel | undefined> {
    return this._currentUser$.asObservable();
  }
}
