import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { WorkerService, Worker } from '../../../../services/worker-service';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { DialogModule } from 'primeng/dialog';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Teacher } from '../../../../services/teacher-service';

@Component({
  selector: 'app-add-workers',
  imports: [
    ButtonModule,
    InputTextModule,
    DialogModule,
    FormsModule,
    CommonModule],
  templateUrl: './add-workers.html',
  styleUrl: './add-workers.css',
})
export class AddWorkers {

  

     name = '';
     email: string = '';
     role = '';
     department = '';
     shift = ''
     status = '';
     display = false;
    
     worker: Partial<Worker> = {
       name: '',
       email: '',
       role: '',
       department: '',
       shift: 'Morning',
      status: undefined
     };
   
     constructor(public workerService: WorkerService) { }
   
     addWorker( name: string, email: string, role: string, department: string, shift: string, status: string) {
       const worker: Worker = { 
        name,
        email,
        role,
        department,
        shift: 'Morning',
        status: 'Active'
       };
   
       
   
       this.workerService.addWorker(worker);
     }
   
   
   
   cancel() {
     this.workerService.closeAddDialog();
   
   }
   
   save() {
     if (!this.worker) return;
   
     const newWorker:Worker = {
       name: this.worker.name ?? '',
       email: this.worker.email ?? '',
       role: this.worker.role ?? '',
       department: this.worker.department ?? '',
       shift: this.worker.shift ?? 'Morning',
       status: this.worker.status ?? 'Active'
     };
   
     this.workerService.addWorker(newWorker);
     this.workerService.closeAddDialog();

     // optional: reset form
     this.worker = {};
   }
  }

