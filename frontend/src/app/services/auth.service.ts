import { Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private tokenKey = 'art_sale_token';
  private adminKey = 'art_sale_admin';
  isLoggedIn = signal(this.hasToken());

  constructor() {
    const stored = localStorage.getItem(this.tokenKey);
    this.isLoggedIn.set(!!stored);
  }

  private hasToken(): boolean {
    return !!localStorage.getItem(this.tokenKey);
  }

  setSession(token: string, admin: { id: string; email: string; role: string }) {
    localStorage.setItem(this.tokenKey, token);
    localStorage.setItem(this.adminKey, JSON.stringify(admin));
    this.isLoggedIn.set(true);
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  getAdmin(): { id: string; email: string; role: string } | null {
    const data = localStorage.getItem(this.adminKey);
    return data ? JSON.parse(data) : null;
  }

  logout() {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.adminKey);
    this.isLoggedIn.set(false);
  }
}
