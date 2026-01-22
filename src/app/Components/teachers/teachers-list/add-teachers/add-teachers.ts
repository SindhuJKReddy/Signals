import { Component } from '@angular/core';
import { TeacherService, Teacher } from '../../../../services/teacher-service';
import { RouterOutlet } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { Dialog, DialogModule } from 'primeng/dialog';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-add-teachers',
  standalone: true,
  imports: [
    RouterOutlet,
    ButtonModule,
    InputTextModule,
    DialogModule,
    FormsModule,
    CommonModule,
  ],
  templateUrl: './add-teachers.html',
  styleUrl: './add-teachers.css',
})
export class AddTeachers {

  // Form model
  teacher: Partial<Teacher> = {
    name: '',
    email: '',
    subject: '',
    department: '',
    experience: 0,
    status: 'Active'
  };

  constructor(public teacherService: TeacherService) {}

  save() {
    if (!this.teacher) return;

    const newTeacher: Teacher = {
      name: this.teacher.name ?? '',
      email: this.teacher.email ?? '',
      subject: this.teacher.subject ?? '',
      department: this.teacher.department ?? '',
      experience: Number(this.teacher.experience ?? 0),
      status: this.teacher.status ?? 'Active'
    };

    this.teacherService.addTeacher(newTeacher);
    this.teacherService.closeAddDialog();

    // reset form
    this.teacher = {};
  }

  cancel() {
    this.teacherService.closeAddDialog();
  }
}
