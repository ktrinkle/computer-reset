import { Component, OnInit, Input } from '@angular/core';
import { DataService } from '../data.service';
import { Router } from '@angular/router';
import { Signup, StateList, CityList, Timeslot } from '../data';
import { AppComponent } from '../app.component';
import { FormGroup, FormControl, Validators, FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-event',
  templateUrl: './event.component.html',
  styleUrls: ['./event.component.scss']
})

export class EventComponent implements OnInit {

  events = [];
  dataSource = new MatTableDataSource<Timeslot>(this.events);
  public signUp: Signup = {realname: "", cityNm: "", stateCd: "", eventId: 0, 
    fbId: sessionStorage.getItem('facebookId'), 
    firstNm: sessionStorage.getItem('firstName'), 
    lastNm: sessionStorage.getItem('lastName')
  };



  public agreeInd: boolean = false;
  public eventForm: FormGroup;
  public states: StateList[];
  public cities: CityList[];
  public responseJson: string;
  public submitResult: string;
  public submitProcess: boolean = false;

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
        eventId: new FormControl(this.dataService.eventIdPass),
        realName: new FormControl(sessionStorage.getItem('firstName') + " " + sessionStorage.getItem('lastName')),
        facebookId: new FormControl(sessionStorage.getItem('facebookId'), [Validators.required]),
        cityNm: new FormControl('', [Validators.required]),
        stateCd: new FormControl('', [Validators.required])
      });

      //get routed event id if needed
      this.signUp.eventId = this.dataService.eventIdPass;
      this.dataService.eventIdPass = 0;

      this.dataService.getEvent().subscribe((data: Timeslot[])=>{
        this.events = data;
      }) 

      this.dataService.getState().subscribe(
        result => { this.states = result; }
        );

      //default us to Dallas, Tx
      this.eventForm.patchValue({stateCd: "TX"});
      this.changeCityList(45);
      this.eventForm.patchValue({cityNm: "Dallas"});

      this.onChanges();
      
  }

  eventSubmit() {
    //builds out signup object. We already have the first pieces.
    this.submitProcess = true;
    
    if (this.eventForm.value.realName) {
      this.signUp.realname = this.eventForm.value.realName;
    }

    this.signUp.cityNm = this.eventForm.value.cityNm; 
    this.signUp.stateCd = this.eventForm.value.stateCd; //this is a code now

    this.signUp.eventId = this.eventForm.value.eventId; //always take from form, assuming we pre-populate

    //final checks. This is in case of form hacking.
    if (this.signUp.eventId == 0 || !this.signUp.eventId) {
      this.submitResult = "You may have not selected an event. Please try again.";
      this.submitProcess = false;
    } else if (!this.signUp.cityNm || !this.signUp.stateCd ) {
      this.submitResult = "We did not find a city or state selected. Please try again.";
      this.submitProcess = false;
    } else {
      //all is good, lets fire the web service
      this.dataService.signupForEvent(this.signUp).subscribe((data => {
          this.submitResult = data;
          this.submitProcess = false;
      }));
    }
  }
  
  //onchange handler next to clear status for submitResult

  onChanges(): void {
    this.eventForm.valueChanges.subscribe(val => {
      this.submitResult = null;
    });
  }
  //onchange for state

  changeCityList(newState: number) {
    this.dataService.getCity(newState).subscribe(
      result => { this.cities = result; }
      );
  }

}
