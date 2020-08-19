import { Component, OnInit, Input } from '@angular/core';
import { DataService } from '../data.service';
import { Router } from '@angular/router';
import { Signup, StateList, CityList } from '../data';
import { AppComponent } from '../app.component';
import { NgForm, FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-event',
  templateUrl: './event.component.html',
  styleUrls: ['./event.component.scss']
})

export class EventComponent implements OnInit {

  events = [];
  public signUp: Signup = {realname: "", cityNm: "", stateCd: "", eventId: 0, 
    fbId: this.dataService.userSmall.facebookId, 
    firstName: this.dataService.userSmall.firstName, 
    lastName: this.dataService.userSmall.lastName
  };

  public agreeInd: boolean = false;
  public eventForm: FormGroup;
  public states: StateList[];
  public cities: CityList[];
  public responseJson: string;
  public submitResult: string;

  public agreeClick(): void {
    this.agreeInd = true;
  }

  constructor(
    public dataService: DataService, 
    private router: Router, 
    private appComponent: AppComponent,
    private formBuilder: FormBuilder
    ) { }

  ngOnInit() {
      this.eventForm = this.formBuilder.group({
        eventId: new FormControl(this.dataService.eventIdPass, [Validators.required]),
        realName: new FormControl(),
        facebookId: new FormControl(this.dataService.userSmall.facebookId, [Validators.required]),
        cityNm: new FormControl('', [Validators.required]),
        stateCd: new FormControl('', [Validators.required])
      });

      //get routed event id if needed
      this.signUp.eventId = this.dataService.eventIdPass;
      this.dataService.eventIdPass = 0;

      this.dataService.getEvent().subscribe((data: any[])=>{
        this.events = data;
      }) 

      this.dataService.getState().subscribe(
        result => { this.states = result; }
        );

      //default us to Texas
      this.changeCityList(45);

      console.log(this.eventForm);
      
  }

  eventSubmit() {
    //builds out signup object. We already have the first pieces.

    if (this.eventForm.value.realName) {
      this.signUp.realname = this.eventForm.value.realName;
    }

    this.signUp.cityNm = this.eventForm.value.cityNm; //should we add client side for this?
    this.signUp.stateCd = this.states.filter(state => (state.id = this.eventForm.value.stateCd)).toString(); //this may be a code

    if (this.signUp.eventId == 0) {
      this.signUp.eventId = this.eventForm.value.eventId;
    }

    //final checks. This is in case of form hacking.
    if (this.signUp.eventId == 0) {
      this.submitResult = "You may have not selected an event. Please try again.";
    } else if (!this.signUp.cityNm || !this.signUp.stateCd ) {
      this.submitResult = "We did not find a city or state selected. Please try again.";
    } else {
      //all is good, lets fire the web service
      this.dataService.signupForEvent(this.signUp).subscribe((data => {
          this.submitResult = data.result;
      }));
    }
  }
  
  //onchange handler next to clear status for submitResult
  //onchange for state

  changeCityList(newState: number) {
    this.dataService.getCity(newState).subscribe(
      result => { this.cities = result; }
      );
  }

}
