import { HttpClient } from '@angular/common/http';
import { EventEmitter, Injectable } from '@angular/core';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'platform',
})
export class AuthService {
  loggedInSubject: EventEmitter<boolean> = new EventEmitter<boolean>(false);
  isLoggedIn = false;
  url: string = `${environment.mpsServer}/api/v1/authorize`;

  constructor(private readonly http: HttpClient) {
    if (localStorage.loggedInUser != null) {
      this.isLoggedIn = true;
      this.loggedInSubject.next(this.isLoggedIn);
    }
    if (environment.mpsServer.includes('/mps')) {
      // handles kong route
      this.url = `${environment.mpsServer}/login/api/v1/authorize`;
    }
  }

  getLoggedUserToken(): string {
    const loggedUser: any = localStorage.getItem('loggedInUser');
    const token: string = JSON.parse(loggedUser).token;
    return token;
  }
}
