import { Component } from '@angular/core';
import { StudentService, Student } from '../../../services/student-service';
import { TableModule } from 'primeng/table';
import { InputTextModule } from 'primeng/inputtext';
import { IconField } from 'primeng/iconfield';
import { InputIcon } from 'primeng/inputicon';
import { TagModule } from 'primeng/tag';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { DialogModule } from 'primeng/dialog';
import { FormsModule } from '@angular/forms';
import { UpdateStudent } from './update-student/update-student';
import { CommonModule } from '@angular/common';
import { AddStudent } from './add-student/add-student';
import { Select } from 'primeng/select';



@Component({
  selector: 'app-student-list',
  standalone: true,
  imports: [
    TableModule,
    InputTextModule,
    IconField,
    InputIcon,
    TagModule,
    ButtonModule,
    AddStudent,
    ToastModule,
    DialogModule,
    FormsModule,
    Select,
    UpdateStudent,
    CommonModule
  ],
  providers: [MessageService],
  templateUrl: './student-list.html',
  styleUrl: './student-list.css',
})
export class StudentList {

  constructor(private studentService: StudentService,
    private messageService: MessageService
  ) { }

  // ✅ Expose signal to template
  get students() {
    return this.studentService.students;
  }

  getSeverity(status: string) {
    switch (status) {
      case 'Inactive':
        return 'warn';

      case 'Active':
        return 'success';

      case 'Suspended':
        return 'danger';

      case 'Graduated':
        return 'info';

      default:
        return null;
    }
  }
  editStudent(student: Student) {
    this.studentService.openEditDialog(student.id);
  }
  onDelete(student: Student) {
    if (confirm('Are you sure you want to delete?')) 
    this.studentService.deleteStudent(student.id);
    


    this.messageService.add({
      severity: 'success',
      summary: 'Deleted',
      detail: `${student.name} deleted successfully`,
      life: 3000
    });
  }

  openAddStudent() {
    this.studentService.openAddDialog();
  }


  //status
  statusOptions = [
    { label: 'All Status', value: null },
    { label: 'Active', value: 'Active' },
    { label: 'Inactive', value: 'Inactive' },
    { label: 'Suspended', value: 'Suspended' },
    { label: 'Graduated', value: 'Graduated' }
  ];

  selectedStatus: string | null = null;

  // Grades
  gradesOptions = [
    { label: 'All Grades', value: null },
    { label: '10th', value: '10th' },
    { label: '11th', value: '11th' },
    { label: '12th', value: '12th' }
  ];

  selectedGrade: string | null = null;


  // Exports 
  exportJSON() {
    const data = this.studentService.students();

    const blob = new Blob(
      [JSON.stringify(data, null, 2)],
      { type: 'application/json' }
    );

    this.downloadFile(blob, 'students.json');
  }

  exportCSV() {
    const data = this.studentService.students();

    if (!data.length) return;

    const headers = Object.keys(data[0]).join(',');
    const rows = data.map(student =>
      Object.values(student).join(',')
    );

    const csvContent = [headers, ...rows].join('\n');

    const blob = new Blob(
      [csvContent],
      { type: 'text/csv;charset=utf-8;' }
    );

    this.downloadFile(blob, 'students.csv');
  }

  private downloadFile(blob: Blob, fileName: string) {
    const url = window.URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    a.click();

    window.URL.revokeObjectURL(url);
  }

  selectedStudents: Student[] = [];


  deleteSelected() {
    if (confirm('Are you sure you want to delete?')) 
    if (!this.selectedStudents.length) return;

    const ids = this.selectedStudents.map(s => s.id);

    this.studentService.deleteStudents(ids);

    this.messageService.add({
      severity: 'success',
      summary: 'Deleted',
      detail: `${ids.length} student(s) deleted`,
      life: 3000
    });

    this.selectedStudents = [];
  }

  

}


