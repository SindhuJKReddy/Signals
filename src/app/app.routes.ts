import { Routes } from '@angular/router';
import { StudentList } from './Components/students/student-list/student-list';
import { TeachersList } from './Components/teachers/teachers-list/teachers-list';
import { WorkersList } from './Components/workers/workers-list/workers-list';
import { Dashboard } from './Components/dashboard/dashboard';

export const routes: Routes = [
      { path: 'student-list', component: StudentList },
      { path: 'teachers-list', component: TeachersList },
      { path: 'workers-list', component: WorkersList },
      { path: 'dashboard',component: Dashboard}
];
