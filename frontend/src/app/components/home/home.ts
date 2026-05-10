import { Component, inject, OnInit, signal } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { Product } from '../../models/product';
import { HeroComponent } from '../hero/hero';
import { SidebarComponent } from '../sidebar/sidebar';
import { GalleryComponent } from '../gallery/gallery';
import { ArtworkModalComponent } from '../artwork-modal/artwork-modal';

@Component({
  selector: 'app-home',
  imports: [HeroComponent, SidebarComponent, GalleryComponent, ArtworkModalComponent],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class HomeComponent implements OnInit {
  private api = inject(ApiService);

  sidebarOpen = signal(false);
  products = signal<Product[]>([]);
  categories = signal<string[]>([]);
  selectedCategory = signal<string | null>(null);
  selectedProduct = signal<Product | null>(null);
  isModalOpen = signal(false);

  toggleSidebar() {
    this.sidebarOpen.update(v => !v);
  }

  ngOnInit() {
    this.loadProducts();
  }

  loadProducts() {
    this.api.getProducts(this.selectedCategory() ?? undefined).subscribe({
      next: (products) => {
        this.products.set(products);
        const cats = [...new Set(products.map(p => p.category))];
        this.categories.set(cats);
      },
    });
  }

  filterByCategory(category: string | null) {
    this.selectedCategory.set(category);
    this.loadProducts();
  }

  openModal(product: Product) {
    this.selectedProduct.set(product);
    this.isModalOpen.set(true);
    document.body.style.overflow = 'hidden';
  }

  closeModal() {
    this.isModalOpen.set(false);
    document.body.style.overflow = '';
  }
}
