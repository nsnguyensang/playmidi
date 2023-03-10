import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroup} from '@angular/forms';
import { ServerHttpService } from '../Services/server-http.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-login-form',
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.scss'],
})
export class LoginFormComponent implements OnInit {
  public loginForm = new FormGroup({
    username: new FormControl(''),
    password: new FormControl(''),
  });
  constructor(private serverHttp: ServerHttpService, private router: Router) { }

  ngOnInit() {}

  public onSubmit() {
    const newUser = {};
    for (const controlName in this.loginForm.controls) {
      if(controlName) {
        newUser[controlName] = this.loginForm.controls[controlName].value;
      }
    }
    this.serverHttp.userLogin(newUser).subscribe(response => {
        localStorage.setItem('id', response.info.id);
        localStorage.setItem('cookie', response.cookie);
      if(response.message)
           {
            this.router.navigate(['/play']);
          }
          
    }
  )}
}
