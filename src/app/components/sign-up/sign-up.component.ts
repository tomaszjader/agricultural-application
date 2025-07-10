import { Component } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthenticationService } from 'src/app/services/authentication.service';

export function passwordsMachValidators(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const password = control.get('password')?.value;
    const confirmPassword = control.get('confirmPassword')?.value;
    if (password && confirmPassword && password !== confirmPassword) {
      return {
        passwordsDontMatch: true
      }
    }
    return null;
  }
}

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss']
})
export class SignUpComponent {

  signUpForm = new FormGroup({
    name: new FormControl('', Validators.required),
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required]),
    confirmPassword: new FormControl('', [Validators.required]),
  }, { validators: passwordsMachValidators() })

  constructor(private authService: AuthenticationService,
    private router: Router) { }

  get email() {
    return this.signUpForm.get('email')?.value;
  }

  get password() {
    return this.signUpForm.get('password')?.value;
  }

  get confirmPassword() {
    return this.signUpForm.get('confirmPassword')?.value;
  }
  get name() {
    return this.signUpForm.get('name')?.value;
  }
  signUp() {

  }
  submit() {
    if (!this.signUpForm.valid) {
      return;
    }
    const { name, email, password } = this.signUpForm?.value;
    if(name && email && password){
      this.authService.signUp(name, email, password).subscribe(() => {
        this.router.navigate(['/home'])
      })
    }
    
  }
}