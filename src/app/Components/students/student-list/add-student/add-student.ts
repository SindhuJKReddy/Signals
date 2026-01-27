import { Component, signal } from '@angular/core';
import { StudentService, Student } from '../../../../services/student-service';
import { RouterOutlet } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { Dialog } from 'primeng/dialog';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-add-student',
  imports: [
    RouterOutlet,
    ButtonModule,
    InputTextModule,
    Dialog,
    FormsModule,
    CommonModule,
    
  ],
  templateUrl: './add-student.html',
  styleUrl: './add-student.css',
})
export class AddStudent {
  phone = '';
  name = '';
  grade = '';
  department = '';
  enrollment = '';
  status = 'Active';
  address = '';
 
  display = false;
 
  student: Partial<Student> = {
    id: 0,
    name: '',
    email: '',
    grade: '',
    status: undefined
  };

  constructor(public studentService: StudentService) { }

  addStudent(id:0, name: string, email: string, phone: string, grade: string, enrollment: string, department: string, status: string) {
    const student: Student = {
      id: 0,
      name,
      email,
      phone: Number(phone),
      grade,
      department,
      enrollment: Number(enrollment),
      status: 'Active'
    };

    this.studentService.addStudent(student);
  }

cancel() {
  this.studentService.closeAddDialog();
}

save() {
  if (!this.student) return;

  const newStudent: Student = {
    id: Number(this.student.id),
    name: this.student.name ?? '',
    email: this.student.email ?? '',
    phone: Number(this.student.phone ?? 0),
    grade: this.student.grade ?? '',
    department: this.student.department ?? '',
    enrollment: Number(this.student.enrollment ?? 0),
    status: this.student.status ?? 'Active'
  };

  this.studentService.addStudent(newStudent);
  this.studentService.closeAddDialog();

  // optional: reset form
  this.student = {};
}

}
