import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NavigationEnd, Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { ToggleButtonModule } from 'primeng/togglebutton';
import { TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';


@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    CommonModule,
    FormsModule,
    ButtonModule,
    ToggleButtonModule,
    TableModule,
    ToastModule
  ],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  userName = '';
  userRole = '';

  showSidebar = false;
 
  constructor(private router: Router) {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        const currentRoute = this.getChild(this.router.routerState.root);
      this.showSidebar = currentRoute.snapshot.data['showSidebar'] ?? true;

      // 2. REFRESH USER DATA ON EVERY NAVIGATION
        this.loadUser();
      }
    });
  }
 
  getChild(route: any): any {
  while (route.firstChild) {
    route = route.firstChild;
  }
  return route;
}
 
logout() {
  localStorage.removeItem('isLoggedIn');
  this.router.navigate(['/signin']);
}

//  logout() {
//     localStorage.removeItem('token');
//     this.router.navigate(['/signin']);
//   }

   title = 'School Management';

   isDark = false;

  ngOnInit(): void {
    this.loadUser();
    
    const savedTheme = localStorage.getItem('theme');
    this.isDark = savedTheme === 'dark';
    this.applyTheme();
  }

  loadUser(): void {
    const user = localStorage.getItem('currentUser');
    if (user) {
      const parsedUser = JSON.parse(user);
      this.userName = parsedUser.name;
      this.userRole = parsedUser.role ?? 'Administrator';
    } else {
      this.userName = '';
      this.userRole = '';
    }
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
