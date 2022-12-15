import { Component, OnInit } from '@angular/core';
import { Validators, FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { UsernameValidator } from '../validators/username.validator';
import { Router } from '@angular/router';
import { Storage } from '@ionic/storage';

@Component({
  selector: 'app-form',
  templateUrl: './form.page.html',
  styleUrls: ['./form.page.scss'],
})
export class FormPage implements OnInit {

  validations_form: FormGroup;
  genders: Array<string>;
  usernames: any;

  constructor(
    public formBuilder: FormBuilder,
    private router: Router,
    private storage: Storage
  ) { 
    this.storage.create();
  }

  ngOnInit() {

    this.genders = [
      "Male",
      "Female"
    ];


    this.validations_form = this.formBuilder.group({
      username: new FormControl('', Validators.compose([
        UsernameValidator.validUsername,
        Validators.maxLength(25),
        Validators.minLength(5),
        Validators.pattern('^(?=.*[a-zA-Z])(?=.*[0-9])[a-zA-Z0-9]+$'),
        Validators.required
      ])),
      name: new FormControl('', Validators.required),
      lastname: new FormControl('', Validators.required),
      email: new FormControl('', Validators.compose([
        Validators.required,
        Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')
      ])),
      gender: new FormControl(this.genders[0], Validators.required),
      terms: new FormControl(true, Validators.pattern('true'))
    });
  }

  validation_messages = {
    'username': [
      { type: 'required', message: 'Username is required.' },
      { type: 'minlength', message: 'Username must be at least 5 characters long.' },
      { type: 'maxlength', message: 'Username cannot be more than 25 characters long.' },
      { type: 'pattern', message: 'Your username must contain only numbers and letters.' },
      { type: 'validUsername', message: 'Your username has already been taken.' }
    ],
    'name': [
      { type: 'required', message: 'Name is required.' }
    ],
    'lastname': [
      { type: 'required', message: 'Last name is required.' }
    ],
    'email': [
      { type: 'required', message: 'Email is required.' },
      { type: 'pattern', message: 'Please enter a valid email.' }
    ],
    'terms': [
      { type: 'pattern', message: 'You must accept terms and conditions.' }
    ],
  };

  ionViewWillEnter() {
    this.storage.get('users').then((val) => {
      console.log(val,"Val")
      if(val!=null && val!=undefined && val.username!='')
      {
        this.validations_form = this.formBuilder.group({
          username: new FormControl(val.username, Validators.compose([
            UsernameValidator.validUsername,
            Validators.maxLength(25),
            Validators.minLength(5),
            Validators.pattern('^(?=.*[a-zA-Z])(?=.*[0-9])[a-zA-Z0-9]+$'),
            Validators.required
          ])),
          name: new FormControl(val.name, Validators.required),
          lastname: new FormControl(val.lastname, Validators.required),
          email: new FormControl(val.email, Validators.compose([
            Validators.required,
            Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')
          ])),
          gender: new FormControl(this.genders[0], Validators.required),
          terms: new FormControl(val.terms, Validators.pattern('true'))
        });
      }
      else
      {
        this.ngOnInit();
      }
    });
  }

  onChangeTime(val,val1)
  {
    this.storage.set('users', val1);
  }

}
