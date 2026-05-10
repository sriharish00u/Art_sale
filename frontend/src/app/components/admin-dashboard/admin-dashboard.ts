import { Component, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpEventType } from '@angular/common/http';
import { lastValueFrom } from 'rxjs';
import { ApiService } from '../../services/api.service';
import { AuthService } from '../../services/auth.service';
import { Product } from '../../models/product';

@Component({
  selector: 'app-admin-dashboard',
  imports: [FormsModule],
  templateUrl: './admin-dashboard.html',
  styleUrl: './admin-dashboard.scss',
})
export class AdminDashboardComponent implements OnInit {
  private api = inject(ApiService);
  private auth = inject(AuthService);
  private router = inject(Router);

  products = signal<Product[]>([]);
  admin = this.auth.getAdmin();
  loading = signal(false);

  showForm = signal(false);
  editingId = signal<string | null>(null);
  title = '';
  description = '';
  price = 0;
  category = '';
  featured = false;
  imageFile: File | null = null;
  imagePreview = '';
  formError = '';
  formLoading = false;
  uploadProgress = signal(0);
  uploading = signal(false);

  ngOnInit() {
    this.loadProducts();
  }

  loadProducts() {
    this.loading.set(true);
    this.api.getProducts().subscribe({
      next: (products) => {
        this.products.set(products);
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }

  logout() {
    this.auth.logout();
    this.router.navigate(['/admin/login']);
  }

  resetForm() {
    this.title = '';
    this.description = '';
    this.price = 0;
    this.category = '';
    this.featured = false;
    this.imageFile = null;
    this.imagePreview = '';
    this.formError = '';
    this.formLoading = false;
    this.uploadProgress.set(0);
    this.uploading.set(false);
    this.editingId.set(null);
  }

  openCreate() {
    this.resetForm();
    this.showForm.set(true);
  }

  openEdit(product: Product) {
    this.title = product.title;
    this.description = product.description;
    this.price = product.price;
    this.category = product.category;
    this.featured = product.featured;
    this.editingId.set(product._id);
    this.imagePreview = product.image;
    this.showForm.set(true);
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      this.imageFile = input.files[0];
      const reader = new FileReader();
      reader.onload = () => this.imagePreview = reader.result as string;
      reader.readAsDataURL(this.imageFile);
    }
  }

  async save() {
    if (!this.title || !this.description || !this.price || !this.category) {
      this.formError = 'Title, description, price, and category are required';
      return;
    }

    this.formLoading = true;
    this.formError = '';

    try {
      let imageUrl = this.imagePreview;

      if (this.imageFile) {
        this.uploading.set(true);
        this.uploadProgress.set(0);

        imageUrl = await new Promise<string>((resolve, reject) => {
          this.api.uploadImageWithProgress(this.imageFile!).subscribe({
            next: (event) => {
              if (event.type === HttpEventType.UploadProgress && event.total) {
                this.uploadProgress.set(Math.round((event.loaded / event.total) * 100));
              } else if (event.type === HttpEventType.Response) {
                resolve((event.body as { url: string }).url);
              }
            },
            error: (err) => reject(err),
          });
        });

        this.uploading.set(false);
        this.uploadProgress.set(100);
      }

      const data = {
        title: this.title,
        description: this.description,
        price: this.price,
        image: imageUrl,
        category: this.category,
        whatsappLink: `https://wa.me/918870444685`,
        featured: this.featured,
      };

      if (this.editingId()) {
        await lastValueFrom(this.api.updateProduct(this.editingId()!, data));
      } else {
        await lastValueFrom(this.api.createProduct(data));
      }

      this.showForm.set(false);
      this.resetForm();
      this.loadProducts();
    } catch (err: any) {
      this.formError = err.error?.error || 'Failed to save product';
    } finally {
      this.formLoading = false;
      this.uploading.set(false);
    }
  }

  deleteProduct(id: string) {
    if (!confirm('Are you sure you want to delete this product?')) return;
    this.api.deleteProduct(id).subscribe({
      next: () => this.loadProducts(),
      error: (err) => alert(err.error?.error || 'Delete failed'),
    });
  }

  cancel() {
    this.showForm.set(false);
    this.resetForm();
  }
}
