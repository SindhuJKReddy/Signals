import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { computed } from '@angular/core';
import { list } from '@primeuix/themes/aura/autocomplete';

export interface Student {
  id: number;
  name: string;
  email: string;
  phone: number;
  grade: string;
  enrollment: number;
  department: string;
  status: 'Active' | 'Inactive' | 'Suspended' | 'Graduated';
}

@Injectable({
  providedIn: 'root',
})
export class StudentService {

  readonly selectedStudent = computed(() =>
    this.studentsSignal().find(s => s.id === this.selectedStudentId()) ?? null
  );

  previousStudentCount = signal<number>(0);

  // ✅ signal holds STUDENT data
  private studentsSignal = signal<Student[]>([]);
  students = this.studentsSignal.asReadonly();

  private http = inject(HttpClient);

  // dialogVisible = signal(false);
  selectedStudentId = signal<number | null>(null);

  constructor() {
    this.loadStudents();
  }


  private loadStudents() {
    this.http
      .get<Student[]>('http://localhost:4001/students')
      .subscribe(data => {
        this.previousStudentCount.set(this.studentsSignal().length);
        this.studentsSignal.set(data);
      });
  }

  addStudent(student: Student) {
    this.studentsSignal.update(list => [...list, student]);
  }

  updateStudent(updatedStudent: Student) {
    this.studentsSignal.update(list =>
      list.map(s =>
        s.id === updatedStudent.id ? updatedStudent : s
      )
    );
  }

  getStudentById(id: number) {
    return this.students().find(s => s.id === id) ?? null;
  }

  
  deleteStudent(id: number) {
    this.studentsSignal.update(list =>
      list.filter(s => s.id !== id)
    );
  }

  dialogVisible = signal(false);

 

  closeDialog() {
    this.dialogVisible.set(false);
    this.selectedStudentId.set(null);
  }

  openEditDialog(id: number) {
    this.selectedStudentId.set(id);
    this.dialogVisible.set(true);
  }

  closeEditDialog() {
    this.dialogVisible.set(false);
    this.selectedStudentId.set(null);
  }

  // Add Student Dialog Methods

  addDialogVisible = signal(false);

  openAddDialog() {
    this.addDialogVisible.set(true);
  }

  closeAddDialog() {
    this.addDialogVisible.set(false);
  }

 deleteStudents(ids: number[]) {
  this.studentsSignal.update(list =>
    list.filter(student => !ids.includes(student.id))
  );
}

}
