import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Product, AdminLoginResponse, AdminDashboardData } from '../models/product';

@Injectable({ providedIn: 'root' })
export class ApiService {
  private http = inject(HttpClient);
  private api = 'https://art-sale.onrender.com/api';

  getProducts(category?: string): Observable<Product[]> {
    const params = new HttpParams();
    const httpParams = category ? params.set('category', category) : params;
    return this.http.get<Product[]>(`${this.api}/products`, { params: httpParams });
  }

  getProduct(id: string): Observable<Product> {
    return this.http.get<Product>(`${this.api}/products/${id}`);
  }

  createProduct(data: Partial<Product>): Observable<Product> {
    return this.http.post<Product>(`${this.api}/products`, data);
  }

  updateProduct(id: string, data: Partial<Product>): Observable<Product> {
    return this.http.put<Product>(`${this.api}/products/${id}`, data);
  }

  deleteProduct(id: string): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.api}/products/${id}`);
  }

  login(email: string, password: string): Observable<AdminLoginResponse> {
    return this.http.post<AdminLoginResponse>(`${this.api}/admin/login`, { email, password });
  }

  verifyToken(): Observable<AdminDashboardData> {
    return this.http.get<AdminDashboardData>(`${this.api}/admin/verify`);
  }

  uploadImage(file: File): Observable<{ url: string }> {
    const form = new FormData();
    form.append('image', file);
    return this.http.post<{ url: string }>(`${this.api}/upload`, form);
  }

  uploadImageWithProgress(file: File): Observable<HttpEvent<{ url: string }>> {
    const form = new FormData();
    form.append('image', file);
    return this.http.post<{ url: string }>(`${this.api}/upload`, form, {
      reportProgress: true,
      observe: 'events',
    });
  }
}
