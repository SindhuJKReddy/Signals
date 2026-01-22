import { Component, effect, inject } from '@angular/core';
import { TeacherService, Teacher } from '../../../../services/teacher-service';
import { RouterOutlet } from '@angular/router';
import { DialogModule } from 'primeng/dialog';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { IconField } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputGroupModule } from 'primeng/inputgroup';

@Component({
  selector: 'app-update-teachers',
  standalone: true,
  imports: [
    RouterOutlet,
    DialogModule,
    FormsModule,
    CommonModule,
    ButtonModule,
    InputTextModule
  ],
  templateUrl: './update-teachers.html',
  styleUrl: './update-teachers.css',
})
export class UpdateTeachers {

  

  private teacherService = inject(TeacherService);



  public selectedTeacherSignal = this.teacherService.selectedTeacher;

  public visible = this.teacherService.editDialogVisible;

  teacher: Teacher | null = null;

  constructor() {
    // whenever the selectedTeacher signal changes, copy to a local object
    effect(() => {
      const s = this.selectedTeacherSignal();
      this.teacher = s ? { ...s } : null;
    });
  }

      
    
   
    save() {
    if (this.teacher) {
      this.teacherService.updateTeacher(this.teacher);
      this.visible.set(false); // close dialog
    }
  }
   
    cancel() {
    this.visible.set(false); // close dialog
  }
}
