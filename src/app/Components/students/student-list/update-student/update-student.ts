import { Component, effect, signal } from '@angular/core';
import { StudentService, Student } from '../../../../services/student-service';
import { RouterOutlet } from '@angular/router';
import { DialogModule } from 'primeng/dialog';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { inject } from '@angular/core';


@Component({
  selector: 'app-update-student',
  imports: [
    DialogModule,
    FormsModule,
    CommonModule,
    ButtonModule,
    InputTextModule
  ],
  templateUrl: './update-student.html',
  styleUrl: './update-student.css',
})
export class UpdateStudent {

  private studentservice = inject(StudentService);
visible = this.studentservice.dialogVisible;
 
  private selectedStudentSignal = this.studentservice.selectedStudent;
 
  student: Student | null = null;
 
  constructor() {
    effect(() => {
      const s = this.selectedStudentSignal();
      this.student = s ? { ...s } : null;
    });
  }
 
  save() {
    if (this.student) {
      this.studentservice.updateStudent(this.student);
      this.studentservice.closeDialog();
    }
  }
 
  cancel() {
    this.studentservice.closeDialog();
  }

}
