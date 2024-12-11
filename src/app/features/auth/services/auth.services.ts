import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { LoginFormModel } from "../models/login.form.model";
import { UserTokenDtoModel } from "../models/user.token.dto.model";
import { BehaviorSubject, Observable, of, tap, map } from "rxjs";
import { Router } from "@angular/router";
import { jwtDecode } from 'jwt-decode';
import { JwtPayload } from '../models/token.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private _currentUser$: BehaviorSubject<UserTokenDtoModel | undefined>;

  constructor(
    private readonly _http: HttpClient,
    private readonly _router: Router
  ) {
    const jsonUser = localStorage.getItem('currentUser');
    if (jsonUser) {
      const userToken: UserTokenDtoModel = JSON.parse(jsonUser);
      this._currentUser$ = new BehaviorSubject<UserTokenDtoModel | undefined>(userToken);
    } else {
      this._currentUser$ = new BehaviorSubject<UserTokenDtoModel | undefined>(undefined);
    }
  }

  private authURL = 'http://api.technobel.pro:444/api/Auth';

  // Nouvelle méthode pour récupérer le JWT depuis le localStorage
  getJwtToken(): string | null {
    const currentUser = localStorage.getItem('currentUser');
    if (currentUser) {
      const userToken: UserTokenDtoModel = JSON.parse(currentUser);
      return userToken.token; // Assurez-vous que le modèle UserTokenDtoModel possède une propriété 'token'
    }
    return null;
  }

  decodeToken(): JwtPayload | null {
    const token = this.getJwtToken();
    if (!token) return null;

    try {
      return jwtDecode<JwtPayload>(token);
    } catch (error) {
      console.error('Erreur lors du décodage du token JWT:', error);
      return null;
    }
  }

  getUserId(): number | null {
    const decoded = this.decodeToken();
    return decoded ? decoded["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"] : null;
  }

  login(form: LoginFormModel): Observable<UserTokenDtoModel> {
    return this._http.post<UserTokenDtoModel>(`${this.authURL}`, form).pipe(
      tap(userToken => {
        this._currentUser$.next(userToken);
        localStorage.setItem('currentUser', JSON.stringify(userToken));
        this._router.navigate(['/']);
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
