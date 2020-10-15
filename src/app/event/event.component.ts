import { Component, OnDestroy, OnInit } from '@angular/core';
import { DataService } from '../data.service';
import { Signup, StateList, CityList, TimeslotSmall } from '../data';
import { FormGroup, FormControl, Validators, FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';



@Component({
  selector: 'app-event',
  templateUrl: './event.component.html',
  styleUrls: ['./event.component.scss']
})

export class EventComponent implements OnInit, OnDestroy {

  events = [];
  
  public signUp: Signup = {realname: "", cityNm: "", stateCd: "", eventId: 0, 
    fbId: this.dataService.userFull.facebookId, 
    firstNm: this.dataService.userFull.firstName, 
    lastNm: this.dataService.userFull.lastName
  };

  public agreeInd: boolean = false;
  public eventForm: FormGroup;
  public states: StateList[];
  public cities: CityList[];
  public responseJson: string;
  public submitResult: string;
  public submitProcess: boolean = false;
  public loadStatus: boolean = true;

  public agreeClick(): void {
    this.agreeInd = true;
  }

  destroy$: Subject<void> = new Subject<void>();

  constructor(
    public dataService: DataService, 
    private formBuilder: FormBuilder
    ) { }

  ngOnInit() {
      this.eventForm = this.formBuilder.group({
        eventId: new FormControl(this.dataService.eventIdPass),
        realName: new FormControl(this.dataService.userFull.firstName + " " + this.dataService.userFull.lastName),
        facebookId: new FormControl(this.dataService.userFull.facebookId, [Validators.required]),
        cityNm: new FormControl('', [Validators.required]),
        stateCd: new FormControl('', [Validators.required])
      });

      //get routed event id if needed
      this.signUp.eventId = this.dataService.eventIdPass;
      this.dataService.eventIdPass = 0;

      this.loadStatus = false;
      this.dataService.getEvent(this.dataService.userFull.facebookId).subscribe({next: (data: TimeslotSmall[])=>{
        this.events = data;
      },
      complete: () => {
        //console.log(this.events);
        this.loadStatus = true;}});
  
      this.dataService.getState().subscribe(
        result => { this.states = result; }
        );

      //add real name default
      if (this.dataService.userFull.realName != null) {
        this.eventForm.patchValue({realName: this.dataService.userFull.realName});
      }
      
      //default us to Dallas, Tx
      if (this.dataService.userFull.stateCode == null ) {
        this.eventForm.patchValue({stateCd: "TX"});
        this.dataService.getCity("TX").pipe(
          takeUntil(this.destroy$)).subscribe(result => { 
            this.cities = result; 
          }
        );
      } else {
        this.eventForm.patchValue({stateCd: this.dataService.userFull.stateCode});
        this.dataService.getCity(this.dataService.userFull.stateCode).pipe(
          takeUntil(this.destroy$)).subscribe(result => { 
            this.cities = result; 
          }
        );
      }

      if (this.dataService.userFull.cityName == null ) {
        this.eventForm.patchValue({cityNm: "Dallas"});
      } else {
        this.eventForm.patchValue({cityNm: this.dataService.userFull.cityName});
      }

      this.onChanges();
      
  }

  ngOnDestroy() {

  }

  isNoteRow = (index, item) => item.eventNote === null ? false: true;
  
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

  changeCityList(event) {
    //console.log("GetCity");
    this.dataService.getCity(event.value).pipe(
      takeUntil(this.destroy$)).subscribe(result => { 
        this.cities = result; 
      }
    );
  }

}
