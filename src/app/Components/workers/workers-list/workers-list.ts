import { Component } from '@angular/core';
import { WorkerService, Worker } from '../../../services/worker-service';
import { RouterOutlet } from '@angular/router';
import { TableModule } from 'primeng/table';
import { InputTextModule } from 'primeng/inputtext';
import { IconField } from 'primeng/iconfield';
import { InputIcon } from 'primeng/inputicon';
import { TagModule } from 'primeng/tag';
import { ButtonModule } from 'primeng/button';
import { AddStudent } from '../../students/student-list/add-student/add-student';
import { AddWorkers } from './add-workers/add-workers';
import { ToastModule } from 'primeng/toast';
import { DialogModule } from 'primeng/dialog';
import { FormsModule } from '@angular/forms';
import { Select } from 'primeng/select';
import { UpdateWorkers } from './update-workers/update-workers';
import { CommonModule } from '@angular/common';
import { MessageService } from 'primeng/api';
import { Teacher } from '../../../services/teacher-service';

@Component({
  selector: 'app-workers-list',
  imports: [
   TableModule,
    InputTextModule,
    IconField,
    InputIcon,
    TagModule,
    ButtonModule,
    AddWorkers,
    ToastModule,
    DialogModule,
    FormsModule,
    Select,
    UpdateWorkers,
    CommonModule],
    providers: [MessageService],
  templateUrl: './workers-list.html',
  styleUrl: './workers-list.css',
})
export class WorkersList {

   selectedWorkers: Worker[] = [];

   searchText: string = ''; 
   
     constructor(private workerService: WorkerService,
         private messageService: MessageService
       ) { }
     
       //  Expose signal to template
       get workers() {
         return this.workerService.worker;
       }
     
       getSeverity(status: string) {
         switch (status) {
           case 'Inactive':
             return 'warn';
     
           case 'Active':
             return 'success';

             case 'On Leave':
               return 'info';
     
           default:
             return null;
         }
       }

        getShiftSeverity(shift: string) {
          switch (shift) {
            case 'Morning':
            return 'success';

            case 'Night':
            return 'info';

           default:
           return null;
  }
}

       editWorker(worker: Worker) {
         this.workerService.openEditDialog(worker.email);
       }
       onDelete(worker: Worker) {
        if (confirm('Are you sure you want to delete?')) 
         this.workerService.deleteWorker(worker.email);
     
     
         this.messageService.add({
           severity: 'success',
           summary: 'Deleted',
           detail: `${worker.name} deleted successfully`,
           life: 3000
         });
       }
     
       openAddWorker() {
         this.workerService.openAddDialog();
       }
     
       //status
       statusOptions = [
         { label: 'All Status', value: null },
         { label: 'Active', value: 'Active' },
         { label: 'Inactive', value: 'Inactive' },
         { label: 'On Leave', value: 'On Leave' },
       ];
     
       selectedStatus: string | null = null;

        // Shift
        shiftOptions = [
          { label: 'All Shift', value: null },
          { label: 'Morning', value: 'Morning' },
          { label: 'Night', value: 'Night' }
        ];

        selectedShift: string | null = null;


     
      
     
       
     
     
       // Exports 
       exportJSON() {
         const data = this.workerService.worker();
     
         const blob = new Blob(
           [JSON.stringify(data, null, 2)],
           { type: 'application/json' }
         );
     
         this.downloadFile(blob, 'teachers.json');
       }
     
       exportCSV() {
         const data = this.workerService.worker();
     
         if (!data.length) return;
     
         const headers = Object.keys(data[0]).join(',');
         const rows = data.map(worker =>
           Object.values(worker).join(',')
         );
     
         const csvContent = [headers, ...rows].join('\n');
     
         const blob = new Blob(
           [csvContent],
           { type: 'text/csv;charset=utf-8;' }
         );
     
         this.downloadFile(blob, 'workers.csv');
       }
     
       private downloadFile(blob: Blob, fileName: string) {
         const url = window.URL.createObjectURL(blob);
     
         const a = document.createElement('a');
         a.href = url;
         a.download = fileName;
         a.click();
     
         window.URL.revokeObjectURL(url);
       }
     
      //  selectedWorkers: Worker[] = [];
     
     
       deleteSelected() {
        if (confirm('Are you sure you want to delete?')) 
         if (!this.selectedWorkers.length) return;
     
         const ids = this.selectedWorkers.map(s => s.email);
     
         this.workerService.deleteWorkers(ids);
     
         this.messageService.add({
           severity: 'success',
           summary: 'Deleted',
           detail: `${ids.length} worker(s) deleted`,
           life: 3000
         });
     
         this.selectedWorkers = [];
       }
}
