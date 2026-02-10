import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { computed } from '@angular/core';

export interface Student {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  age: number;
  course: string;
  year: number;
  rollNumber: string;
  enrollmentDate: string;
}

@Injectable({
  providedIn: 'root',
})
export class StudentService {

  private http = inject(HttpClient);

  private apiUrl = 'http://192.168.5.13:5078/api/students';

  // ✅ signal holds STUDENT data
  private studentsSignal = signal<Student[]>([]);
  students = this.studentsSignal.asReadonly();

  readonly selectedStudent = computed(() =>
    this.studentsSignal().find(s => s.id === this.selectedStudentId()) ?? null
  );

  previousStudentCount = signal<number>(0);

  selectedStudentId = signal<number | null>(null);

  loadStudents() {

    this.http
        .get<Student[]>(this.apiUrl)
        .subscribe({
          next: (data) => this.studentsSignal.set(data),
          error: (err) => console.error('Students API failed', err)
        });
    }

  addStudentToApi(student: Student): void {;

      this.http.post<Student>(this.apiUrl, student)
        .subscribe({
          next: (created) => {
            this.studentsSignal.update(list => [...list, created]);
            console.log('Student added successfully', created);
          },
          error: (err) => {
            console.error('Add student failed', err);
            alert('Failed to add student: ' + (err.error?.message || err.message || 'Unknown error'));
          }
        });
    }

  updateStudentApi(student: Student): void {
      this.http.put<Student>(`${this.apiUrl}/${student.id}`, student)
        .subscribe({
          next: (updated) => {
            this.studentsSignal.update(list =>
              list.map(s => s.id === updated.id 
                ? {...s, ...updated, rollNumber: student.rollNumber} 
                 : s)
            );
            console.log('Student updated successfully', updated);
          },
          error: (err) => {
            console.error('Update failed', err);
            alert('Failed to update student: ' + (err.error?.message || err.message || 'Unknown error'));
          }
        });
    }

  getStudentByIdFromApi(id: number) {
      return this.http.get<Student>(`${this.apiUrl}/${id}`);
    }

  searchStudentById(id: number) {
      this.http.get<Student>(`${this.apiUrl}/${id}`)
        .subscribe({
          next: (student) => {
            this.studentsSignal.set([student]);
          },
          error: (err) => {
            console.error('Student not found', err);
            this.studentsSignal.set([]);
          }
        });
    }

    setStudents(filtered: Student[]) {
    this.studentsSignal.set(filtered);
}


  resetStudents() {
      this.loadStudents();
    }

  deleteStudentApi(id: number) {
  //     const token = this.authService.getToken();
  //     if(!token) {
  //       console.error('No token available');
  //       return;
  //     }

  // const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });
      this.http.delete(`${this.apiUrl}/${id}`)
        .subscribe({
          next: () => {
            this.studentsSignal.update(list => list.filter(s => s.id !== id));
            console.log('Student deleted successfully', id);
          },
          error: (err) => {
            console.error('Delete failed', err);
            alert('Failed to delete student: ' + (err.error?.message || err.message || 'Unknown error'));
          }
        });
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

    deleteStudentsApi(ids: number[]) {
      if (!confirm(`Delete ${ids.length} students permanently?`)) return;
      ids.forEach(id => {
        this.deleteStudentApi(id);
      });
    }
  }
