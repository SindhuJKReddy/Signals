import { Injectable , inject} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { signal } from '@angular/core';
import { computed } from '@angular/core';

export interface Worker {
  name: string;
  email: string;
  role: string;
  department: string;
  shift: 'Morning' | 'Evening' | 'Night';
  status: 'Active' | 'Inactive' | 'On Leave';
  actions?: string;
}


@Injectable({
  providedIn: 'root',
})
export class WorkerService {

  private workersSignal = signal<Worker[]>([]);
  worker = this.workersSignal.asReadonly();

  private http = inject(HttpClient);

  selectedWorkersEmail = signal<string | null>(null);

  selectedWorkers = computed(() =>
    this.workersSignal().find(
      w => w.email === this.selectedWorkersEmail()
    ) ?? null
  );
  
  constructor() {
    this.loadWorker();
  }

  private loadWorker() {
    this.http
      .get<Worker[]>('Data/workers.json')
      .subscribe(data => {
        this.workersSignal.set(data);
      });
  }

  addWorker(worker: Worker) {
    this.workersSignal.update(list => [...list, worker]);
  }

  updateWorker(updatedWorker: Worker) {
    this.workersSignal.update(list =>
      list.map(s =>
        s.name === updatedWorker.name ? updatedWorker : s
      )
    );
  }

  getWorkerByEmail(email: string) {
    return this.worker().find(w => w.email === email) ?? null;
  }
  
  deleteWorker(email: string) {
    this.workersSignal.update(list =>
      list.filter(w => w.email !== email)
    );
  }

  deleteWorkers(emails: string[]) {
    this.workersSignal.update(list =>
      list.filter(w => !emails.includes(w.email))
    );
  }

  //  Edit Dialog
  editDialogVisible = signal(false);

  openEditDialog(email: string) {
    this.selectedWorkersEmail.set(email);
    this.editDialogVisible.set(true);
  }

  closeEditDialog() {
    this.editDialogVisible.set(false);
    this.selectedWorkersEmail.set(null);
  }

   //  Add Dialog
  addDialogVisible = signal(false);

  openAddDialog() {
    this.addDialogVisible.set(true);
  }

  closeAddDialog() {
    this.addDialogVisible.set(false);
  }
}

  

