import { Injectable, signal, inject } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private http = inject(HttpClient);
  private router = inject(Router);

  private baseUrl = 'http://192.168.5.13:5078/api/auth/login';
  private tokenKey = 'jwt_token'

  private usersKey = 'users';
  private loggedInKey = 'isLoggedIn';
  private currentUserKey = 'currentUser';
 
  private currentUserSignal = signal<any>(this.getStoredUser());
  user$ = this.currentUserSignal;
 
  private getStoredUser() {
    const data = localStorage.getItem(this.currentUserKey);
     return data ? JSON.parse(data) : null;
  }
 
  signUp(user: any) {
    const users = JSON.parse(localStorage.getItem(this.usersKey) || '[]');
 
    const newUser = {
      name: user.name,
      email: user.email,
      password: user.password,
      role: 'Administrator'
    };
 
    users.push(newUser);
    localStorage.setItem(this.usersKey, JSON.stringify(users));
  }
 
  signIn(email: string, password: string) {
     return this.http.post<any>(this.baseUrl, {
    email: email,   
    password: password
  });
  }

  saveLogin(res: any): void {
 
  localStorage.setItem(this.tokenKey, res.token);

  const user = {
    name: res.userName ?? 'User',
    email: res.email ?? '',
    role: res.role ?? 'Administrator'
  };

  localStorage.setItem(this.loggedInKey, 'true');
  localStorage.setItem(this.currentUserKey, JSON.stringify(user));

  this.currentUserSignal.set(user);
}

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }
 
  getCurrentUser() {
    return this.currentUserSignal();
  }
  
  logout() {
    localStorage.removeItem(this.loggedInKey);
    localStorage.removeItem(this.currentUserKey);
    this.currentUserSignal.set(null);
    this.router.navigate(['/signin']);
  }
 
  isLoggedIn(): boolean {
     return localStorage.getItem(this.loggedInKey) === 'true';
  }
}
