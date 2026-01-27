import { HttpClient } from '@angular/common/http';
import { Injectable, signal , inject, computed} from '@angular/core';

export interface Teacher {
  name: string;
  email: string;        
  subject: string;
  department: string;
  experience: number;
  status: 'Active' | 'Inactive'| 'On Leave';
}

@Injectable({
  providedIn: 'root',
})
export class TeacherService {
  private http = inject(HttpClient);

  //  Signal holding teacher data
  private teachersSignal = signal<Teacher[]>([]);
  teachers = this.teachersSignal.asReadonly();

  previousTeacherCount = signal<number>(0);

  //  Selected teacher (by email)
  selectedTeacherEmail = signal<string | null>(null);

  selectedTeacher = computed(() =>
    this.teachersSignal().find(
      t => t.email === this.selectedTeacherEmail()
    ) ?? null
  );

  constructor() {
    this.loadTeachers();
  }

  //  Load from JSON
  private loadTeachers() {
    this.http
      .get<Teacher[]>('Data/teachers.json')
      .subscribe(data => {
        this.previousTeacherCount.set(this.teachersSignal().length);
        this.teachersSignal.set(data);
      });
  }

  //  Add teacher
  addTeacher(teacher: Teacher) {
    this.teachersSignal.update(list => [...list, teacher]);
  }

  //  Update teacher (match by email)
  updateTeacher(updatedTeacher: Teacher) {
    this.teachersSignal.update(list =>
      list.map(t =>
        t.email === updatedTeacher.email ? updatedTeacher : t
      )
    );
  }

  //  Get teacher by email
  getTeacherByEmail(email: string) {
    return this.teachers().find(t => t.email === email) ?? null;
  }

  //  Delete single teacher
  deleteTeacher(email: string) {
    this.teachersSignal.update(list =>
      list.filter(t => t.email !== email)
    );
  }

  //  Delete multiple teachers
  deleteTeachers(emails: string[]) {
    this.teachersSignal.update(list =>
      list.filter(t => !emails.includes(t.email))
    );
  }

  //  Edit Dialog
  editDialogVisible = signal(false);

  openEditDialog(email: string) {
    this.selectedTeacherEmail.set(email);
    this.editDialogVisible.set(true);
  }

  closeEditDialog() {
    this.editDialogVisible.set(false);
    this.selectedTeacherEmail.set(null);
  }

  //  Add Dialog
  addDialogVisible = signal(false);

  openAddDialog() {
    this.addDialogVisible.set(true);
  }

  closeAddDialog() {
    this.addDialogVisible.set(false);
  }
  
}
