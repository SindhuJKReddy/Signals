import { Component, inject } from '@angular/core';
import { WorkerService, Worker } from '../../../../services/worker-service';
import { RouterOutlet } from '@angular/router';
import { DialogModule } from 'primeng/dialog';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { effect } from '@angular/core';

@Component({
  selector: 'app-update-workers',
  imports: [
    DialogModule,
    FormsModule,
    CommonModule,
    ButtonModule,
    InputTextModule
  ],
  templateUrl: './update-workers.html',
  styleUrl: './update-workers.css',
})
export class UpdateWorkers {

  private workerservice = inject(WorkerService);


  editDialogVisible = this.workerservice.editDialogVisible;
  worker = this.workerservice.selectedWorkers;

  constructor() {
  }
 

  save() {
    const w = this.worker();
    if (!w) return;

    this.workerservice.updateWorker({ ...w });
    this.workerservice.closeEditDialog();
  }
 
  cancel() {
    this.workerservice.closeEditDialog();
  }
}
