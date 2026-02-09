import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { ButtonModule } from 'primeng/button';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth-service';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';

@Component({
  selector: 'app-sign-in',
  imports: [
    RouterLink,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    InputTextModule,
    PasswordModule,
    ButtonModule,
    ToastModule
  ],
  templateUrl: './sign-in.html',
  styleUrl: './sign-in.css',
})
export class SignIn {

   signInForm!: FormGroup;

   private fb = inject(FormBuilder)
   private auth = inject(AuthService)
   private router = inject(Router)
   private messageService = inject(MessageService)

//This is so that we get the email from the state when navigating from sign-up to sign-in
ngOnInit(): void {

  this.signInForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });

  const email = history.state?.email;

  if (email) {
    this.signInForm.patchValue({ email });
  }
}
 
  get f() {
    return this.signInForm.controls;
  }
 
  login(): void {
    if (this.signInForm.invalid) {
      this.signInForm.markAllAsTouched();
      return;
    }
 
    const { email, password } = this.signInForm.value;
 
    this.auth.signIn(email, password).subscribe({
    next: (res) => {
      // Save token & user
      this.auth.saveLogin(res);

      // Navigate after successful login
      this.router.navigate(['/dashboard']);
    },
    error: () => {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Invalid email or password',
        life: 3000
      });
    }
  });
  }
}
