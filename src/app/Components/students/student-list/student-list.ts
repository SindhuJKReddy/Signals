import { Component, computed } from '@angular/core';
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
  ngOnInit() {
  this.studentService.loadStudents();
}
  constructor(private studentService: StudentService,
    private messageService: MessageService,
  ) {}
  
// To add 1000 columns with less code
  columns = computed(() => {
    const data = this.students(); // reactive
    if (!data || data.length === 0) return [];
 
    const customWidths: Record<string, string> = {
      id: '70px',
      firstName: '140px',
      lastName: '135px',
      age: '90px',
      email: '150px',
      course: '170px',
      year: '100px',
      rollNumber: '150px',
      enrollmentDate: '150px'
    };
 
    return Object.keys(data[0]).map(key => ({
      field: key,
      header: key.charAt(0).toUpperCase() + key.slice(1),
      width: customWidths[key] || '150px',
      type: key === 'status' ? 'tag' : 'text'
    }));
  });

  // ✅ Expose signal to template
  get students() {
    return this.studentService.students;
  }

  getYearSeverity(year: number) {
    switch (year) {
      case 1:
        return 'danger';
      case 2:
        return 'warn';
      case 3:
        return 'info';
      case 4:
        return 'success';
      default:
        return null;
    }
  }

  onSearchChange(value: string) {
  const trimmedValue = value.trim();

  if (!trimmedValue) {
    this.studentService.resetStudents();
    return;
  }

  const id = Number(trimmedValue);
  if (!isNaN(id)) {
    this.studentService.searchStudentById(id);
    return;
  }

    const filtered = this.studentService.students().filter(student => {

    const fullName = `${student.firstName} ${student.lastName}`.toLowerCase();

    return (
      student.firstName.toLowerCase().includes(trimmedValue.toLowerCase()) ||
      student.lastName.toLowerCase().includes(trimmedValue.toLowerCase()) ||
      fullName.includes(trimmedValue.toLowerCase()) ||
      student.email.toLowerCase().includes(trimmedValue.toLowerCase()) ||
      student.rollNumber.toLowerCase().includes(trimmedValue.toLowerCase()) ||
      student.course.toLowerCase().includes(trimmedValue.toLowerCase()) ||
      student.year.toString().includes(trimmedValue)
    );
  });

  this.studentService.setStudents(filtered);
}

  editStudent(student: Student) {
    this.studentService.openEditDialog(student.id);
  }
  onDelete(student: Student) {
    const confirmed = confirm('Are you sure you want to delete?');
    
    if (!confirmed) {
      return;
    }  

    this.studentService.deleteStudentApi(student.id);

    this.messageService.add({
      severity: 'success',
      summary: 'Deleted',
      detail: `${student.firstName} deleted successfully`,
      life: 3000
    });
  }

  openAddStudent() {
    this.studentService.openAddDialog();
  }

  yearOptions = [
    { label: 'All Years', value: null },
    { label: 'Year 1', value: 1 },
    { label: 'Year 2', value: 2 },
    { label: 'Year 3', value: 3 },
    { label: 'Year 4', value: 4 }
  ];

  selectedYear: number | null = null;

  courseOptions = [
    { label: 'All Courses', value: null },
    { label: 'CS', value: 'CS' },
    { label: 'IT', value: 'IT' },
    { label: 'ECE', value: 'ECE' },
    { label: 'ME', value: 'ME' }
  ];

  selectedCourse: string | null = null;

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

    const ids = this.selectedStudents.map(s => s.id);

    this.studentService.deleteStudentsApi(ids);

    this.messageService.add({
      severity: 'success',
      summary: 'Deleted',
      detail: `${ids.length} student(s) deleted`,
      life: 3000
    });

    this.selectedStudents = [];
  }
}


