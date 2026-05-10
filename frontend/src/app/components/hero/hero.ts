import { Component, input, output } from '@angular/core';

@Component({
  selector: 'app-hero',
  imports: [],
  templateUrl: './hero.html',
  styleUrl: './hero.scss',
})
export class HeroComponent {
  categories = input<string[]>([]);
  selectedCategory = input<string | null>(null);
  categoryChange = output<string | null>();

  allCategories() {
    return this.categories();
  }

  selectCategory(category: string | null) {
    this.categoryChange.emit(category);
  }
}
