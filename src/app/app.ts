import { CommonModule } from '@angular/common';
import { Component, effect, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { ThemeService } from './services/theme-service';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    CommonModule,
    ButtonModule
  ],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
   title = 'School Management';

   isDark = false;

  ngOnInit(): void {
    const savedTheme = localStorage.getItem('theme');
    this.isDark = savedTheme === 'dark';
    this.applyTheme();
  }

  toggleTheme(): void {
    this.isDark = !this.isDark;
    localStorage.setItem('theme', this.isDark ? 'dark' : 'light');
    this.applyTheme();
  }

  private applyTheme(): void {
    document.body.classList.remove('dark-theme');
    if (this.isDark) {
      document.body.classList.add('dark-theme');
    }
  }



 }
