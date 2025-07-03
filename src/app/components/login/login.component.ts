import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthenticationService } from 'src/app/services/authentication.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  loginForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required])
  })
  constructor(private authService: AuthenticationService,
    private router: Router) { }

  get email() {
    return this.loginForm.get('email')?.value;
  }

  get password() {
    return this.loginForm.get('password')?.value;
  }

  submit() {
    if (!this.loginForm.valid) {
      return;
    }
    const { email, password } = this.loginForm.value;
    if (email && password) {
      this.authService.login(email, password).subscribe(() => {
        this.router.navigate(['/home'])
      })
    }
  }
}