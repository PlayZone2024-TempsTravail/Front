export interface JwtPayload {
    "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier": number;
    "http://schemas.microsoft.com/ws/2008/06/identity/claims/expiration": Date;
    nom: string;
    prenom: string;
    Permissions: string[];
    exp: number;

    iss: string;
    aud: string;
    
    [key: string]: any;
}
