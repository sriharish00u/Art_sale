import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  imports: [FormsModule, RouterLink],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.scss',
})
export class SidebarComponent {
  currentYear = new Date().getFullYear();
  whatsappNumber = '918870444685';

  showForm = signal(false);
  isOpen = signal(false);
  projectTitle = '';
  customerName = '';
  phone = '';
  email = '';
  description = '';
  price = 0;

  toggle() {
    this.isOpen.update(v => !v);
  }

  close() {
    this.isOpen.set(false);
  }

  openRequestForm() {
    this.showForm.set(true);
    document.body.style.overflow = 'hidden';
  }

  closeRequestForm() {
    this.showForm.set(false);
    document.body.style.overflow = '';
  }

  submitRequest() {
    const message = [
      'Hi I am inspired with your art and I need a design for my own',
      '',
      this.projectTitle ? `*Project:* ${this.projectTitle}` : '',
      this.customerName ? `*Name:* ${this.customerName}` : '',
      this.phone ? `*Phone:* ${this.phone}` : '',
      this.email ? `*Email:* ${this.email}` : '',
      this.description ? `*Description:* ${this.description}` : '',
      this.price ? `*Budget:* ₹${this.price}` : '',
    ]
      .filter(Boolean)
      .join('\n');

    const url = `https://wa.me/${this.whatsappNumber}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
    this.closeRequestForm();
  }
}
