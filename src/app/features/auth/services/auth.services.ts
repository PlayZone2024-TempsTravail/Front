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
    let jsonUser = localStorage.getItem('currentUser');
    if (jsonUser) {
      this._currentUser$ = new BehaviorSubject<UserTokenDtoModel | undefined>(JSON.parse(jsonUser));
    } else {
      this._currentUser$ = new BehaviorSubject<UserTokenDtoModel | undefined>(undefined);
    }
  }

  public jwtToken: string = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1laWRlbnRpZmllciI6IjIiLCJodHRwOi8vc2NoZW1hcy5taWNyb3NvZnQuY29tL3dzLzIwMDgvMDYvaWRlbnRpdHkvY2xhaW1zL2V4cGlyYXRpb24iOiIyMDI0LTEyLTEwVDExOjUyOjA0LjMzODM1MTBaIiwibm9tIjoiTG91aXMiLCJwcmVub20iOiJQYXRpZ255IiwiZW1haWwiOiJsb3Vpcy5ncmFuZEB0ZWNoLmJlIiwiUGVybWlzc2lvbnMiOlsiQUpPVVRFUl9ST0xFIiwiQUpPVVRFUl9VU0VSIiwiQUxMX0FKT1VURVJfUE9JTlRBR0UiLCJBTExfQ09OU1VMVEVSX1BPSU5UQUdFUyIsIkFMTF9NT0RJRklFUl9QT0lOVEFHRSIsIkFMTF9TVVBQUklNRVJfUE9JTlRBR0UiLCJERUJVR19QRVJNSVNTSU9OIiwiTU9ESUZJRVJfUEVSTUlTU0lPTlMiLCJNT0RJRklFUl9ST0xFIiwiTU9ESUZJRVJfVVNFUiIsIlBFUlNPX0FKT1VURVJfUE9JTlRBR0UiLCJQRVJTT19DT05TVUxURVJfUE9JTlRBR0UiLCJQRVJTT19NT0RJRklFUl9QT0lOVEFHRSIsIlBFUlNPX1NVUFBSSU1FUl9QT0lOVEFHRSIsIlNVUFBSSU1FUl9ST0xFIiwiU1VQUFJJTUVSX1VTRVIiLCJWT0lSX1JPTEVTIiwiVk9JUl9VU0VSUyJdLCJleHAiOjE3MzM4MzE1MjQsImlzcyI6IkFQSV9JRUMiLCJhdWQiOiJGUk9OVF9JRUMifQ.RyDGYomKFl6B5qGen7zkwOBqkPmsbPvZc4D8N4P1nSg";

  decodeToken(token: string): JwtPayload | null {
    try {
      return jwtDecode<JwtPayload>(token);
    } catch (error) {
      console.error('Erreur lors du décodage du token JWT:', error);
      return null;
    }
  }

  getUserId(token: string): number | null {
    const decoded = this.decodeToken(token);
    return decoded ? decoded["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"]: null;
  }

  private authURL = 'http://api.technobel.pro:444/api/Auth';

  login(form: LoginFormModel): Observable<UserTokenDtoModel> {
    // Décoder le token JWT
    const decodedToken = this.decodeToken(this.jwtToken);
    if (!decodedToken) {
      throw new Error("Token JWT invalide");
    }

    const userToken: UserTokenDtoModel = {
      token: this.jwtToken,
      email: decodedToken.nom,
      roles: decodedToken.Permissions
    };

    this._currentUser$.next(userToken);
    localStorage.setItem("currentUser", JSON.stringify(userToken));

    this._router.navigate(['/']);

    return of(userToken);
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
