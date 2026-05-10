import { Component, computed, input, output } from '@angular/core';
import { Product } from '../../models/product';

@Component({
  selector: 'app-artwork-modal',
  imports: [],
  templateUrl: './artwork-modal.html',
  styleUrl: './artwork-modal.scss',
})
export class ArtworkModalComponent {
  product = input.required<Product>();
  close = output<void>();

  whatsappLink = computed(() => {
    const p = this.product();
    const msg = [
      `Hi, I want to buy this product`,
      ``,
      `*Title:* ${p.title}`,
      `*Price:* ₹${p.price}`,
      `*Category:* ${p.category}`,
    ].join('\n');
    return `https://wa.me/918870444685?text=${encodeURIComponent(msg)}`;
  });
}
