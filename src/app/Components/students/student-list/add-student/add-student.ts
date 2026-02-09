import { Component, signal } from '@angular/core';
import { StudentService, Student } from '../../../../services/student-service';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { Dialog } from 'primeng/dialog';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-add-student',
  imports: [
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
  guardianName = '';
  address = '';
  
  display = false;

  student: Partial<Student> = {
    id: 0,
    firstName: '',
    lastName: '',
    email: '',
    age: 0,
    course: '',
    year: 1,
    rollNumber: '',
    enrollmentDate: ''
  };

  constructor(public studentService: StudentService) { }

  cancel() {
    this.studentService.closeAddDialog();
  }

  save() {
    if (
      !this.student.firstName ||
      !this.student.lastName ||
      !this.student.email ||
      !this.student.rollNumber ||
      !this.student.course
    ) {
      alert('Please fill all required fields');
      return;
    }

    const newStudent = {
      firstName: this.student.firstName,
      lastName: this.student.lastName,
      email: this.student.email,
      age: Number(this.student.age ?? 0),
      course: this.student.course,
      year: Number(this.student.year ?? 1),
      rollNumber: this.student.rollNumber,
       enrollmentDate: this.student.enrollmentDate
    ? new Date(this.student.enrollmentDate).toISOString()
    : null
    };

    this.studentService.addStudentToApi(newStudent as any);
    this.studentService.closeAddDialog();

    // optional: reset form
    this.student = {
      firstName: '',
      lastName: '',
      email: '',
      age: 0,
      course: '',
      year: 1,
      rollNumber: '',
      enrollmentDate: ''
    };
  }
}
