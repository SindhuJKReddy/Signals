import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, FormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { Toast, ToastModule } from 'primeng/toast';
import { MessageModule } from 'primeng/message';
import { MessageService } from 'primeng/api';
import { Router, RouterLink } from '@angular/router';
import { Ripple } from 'primeng/ripple';
import { AuthService } from '../../services/auth-service';

@Component({
  selector: 'app-sign-up',
  imports: [
    CommonModule, 
    FormsModule, 
    RouterLink, 
    ReactiveFormsModule,
    InputTextModule, 
    ButtonModule, 
    ToastModule
  ],
  templateUrl: './sign-up.html',
  styleUrl: './sign-up.css'
})
export class SignUp {

  signupForm!: FormGroup;
  formSubmitted = false;
 
  constructor(
    private fb: FormBuilder, 
    private router: Router, 
    private messageService: MessageService,
    private auth: AuthService
  ) {
    this.signupForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required]
    });
  }
 
  get f() {
    return this.signupForm.controls;
  }
 
  onSubmit() {
    this.formSubmitted = true;
 
    if (this.signupForm.invalid) {
      this.signupForm.markAllAsTouched();
      return;
    }
 
    if (this.f['password'].value !== this.f['confirmPassword'].value) {
      alert('Passwords do not match');
      return;
    }

    // Save user data
    const user = {
      name: this.f['name'].value,
      email: this.f['email'].value,
      password: this.f['password'].value
    };

    this.auth.signUp(user);
 
    this.messageService.add({ 
      severity: 'success', 
      summary: 'Success', 
      detail: 'Account created', 
      life: 3000 
    });
    
    this.signupForm.reset();
    this.formSubmitted = false;
    this.router.navigate(['/signin']);
  }
 
  isInvalid(controlName: string): boolean {
    const control = this.signupForm.get(controlName);
    return !!control && control.invalid && (control.touched || this.formSubmitted);
  }
}
