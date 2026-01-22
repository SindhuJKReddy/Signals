import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterOutlet } from '@angular/router';
import { Teacher, TeacherService } from '../../../services/teacher-service';
import { AddTeachers } from './add-teachers/add-teachers';
import { UpdateTeachers } from './update-teachers/update-teachers';
import { MessageService } from 'primeng/api';
import { Toast } from 'primeng/toast';
import { Table, TableModule } from 'primeng/table';

import { TagModule } from 'primeng/tag';
import { InputTextModule } from 'primeng/inputtext';
import { InputGroupModule } from 'primeng/inputgroup';
import { Select, SelectModule } from 'primeng/select';
import { InputIconModule } from 'primeng/inputicon';
import { IconField } from 'primeng/iconfield';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-teachers-list',
  imports: [
    RouterOutlet,
    AddTeachers,
    UpdateTeachers,
    Toast,
    TableModule,
    CommonModule,
    FormsModule,
    TagModule,
    InputTextModule,
    InputGroupModule ,
    SelectModule,
    ButtonModule,
    InputIconModule,
    IconField
  ],
   providers: [MessageService],
  templateUrl: './teachers-list.html',
  styleUrl: './teachers-list.css',
})
export class TeachersList {

  searchText: string = ''; 

  constructor(private teacherService: TeacherService,
      private messageService: MessageService
    ) { }
  
    //  Expose signal to template
    get teachers() {
      return this.teacherService.teachers;
    }
  
    getSeverity(status: string) {
      switch (status) {
        case 'Inactive':
          return 'warn';
  
        case 'Active':
          return 'success';
  
        default:
          return null;
      }
    }
    editTeacher(teacher: Teacher) {
      this.teacherService.openEditDialog(teacher.email);
    }
    onDelete(teacher: Teacher) {
      if (confirm('Are you sure you want to delete?')) 
      this.teacherService.deleteTeacher(teacher.email);
  
  
      this.messageService.add({
        severity: 'success',
        summary: 'Deleted',
        detail: `${teacher.name} deleted successfully`,
        life: 3000
      });
    }
  
    openAddTeacher() {
      this.teacherService.openAddDialog();
    }
  
    //status
    statusOptions = [
      { label: 'All Status', value: null },
      { label: 'Active', value: 'Active' },
      { label: 'Inactive', value: 'Inactive' },
    ];
  
    selectedStatus: string | null = null;

     departmentOptions = [
      { label: 'All Departments', value: null },
      { label: 'Science', value: 'Science' },
      { label: 'Arts', value: 'Arts' },
      { label: 'Commerce', value: 'Commerce' },
      { label: 'Technology', value: 'Technology' },
      { label: 'Social studies', value: 'Social studies' },
      { label: 'Languages', value: 'Languages' },
      

    ];
  
    selectedDepartment: string | null = null;
  
   
  
    
  
  
    // Exports 
    exportJSON() {
      const data = this.teacherService.teachers();
  
      const blob = new Blob(
        [JSON.stringify(data, null, 2)],
        { type: 'application/json' }
      );
  
      this.downloadFile(blob, 'teachers.json');
    }
  
    exportCSV() {
      const data = this.teacherService.teachers();
  
      if (!data.length) return;
  
      const headers = Object.keys(data[0]).join(',');
      const rows = data.map(teacher =>
        Object.values(teacher).join(',')
      );
  
      const csvContent = [headers, ...rows].join('\n');
  
      const blob = new Blob(
        [csvContent],
        { type: 'text/csv;charset=utf-8;' }
      );
  
      this.downloadFile(blob, 'teachers.csv');
    }
  
    private downloadFile(blob: Blob, fileName: string) {
      const url = window.URL.createObjectURL(blob);
  
      const a = document.createElement('a');
      a.href = url;
      a.download = fileName;
      a.click();
  
      window.URL.revokeObjectURL(url);
    }
  
    selectedTeachers: Teacher[] = [];
  
  
    deleteSelected() {
      if (confirm('Are you sure you want to delete?'))
      if (!this.selectedTeachers.length) return;
  
      const ids = this.selectedTeachers.map(s => s.email);
  
      this.teacherService.deleteTeachers(ids);
  
      this.messageService.add({
        severity: 'success',
        summary: 'Deleted',
        detail: `${ids.length} teacher(s) deleted`,
        life: 3000
      });
  
      this.selectedTeachers = [];
    }

}
