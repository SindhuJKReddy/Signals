import { Routes } from '@angular/router';
import { StudentList } from './Components/students/student-list/student-list';
import { TeachersList } from './Components/teachers/teachers-list/teachers-list';
import { WorkersList } from './Components/workers/workers-list/workers-list';
import { Dashboard } from './Components/dashboard/dashboard';
import { SignIn } from './Components/sign-in/sign-in';
import { SignUp } from './Components/sign-up/sign-up';
import { authGuard } from './guards/auth-guard';



export const routes: Routes = [
      { path: '', redirectTo: 'signin', pathMatch: 'full' },
      {path: 'signin', component: SignIn, data: { showSidebar: false } },
      {path: 'signup', component: SignUp, data: { showSidebar: false }},
      { path: 'student-list', component: StudentList, canActivate: [authGuard], data: { showSidebar: true } },
      { path: 'teachers-list', component: TeachersList, canActivate: [authGuard], data: { showSidebar: true } },
      { path: 'workers-list', component: WorkersList, canActivate: [authGuard], data: { showSidebar: true } },
      { path: 'dashboard',component: Dashboard, canActivate: [authGuard], data: { showSidebar: true } },
      { path: '**', redirectTo: 'signin' }
];
