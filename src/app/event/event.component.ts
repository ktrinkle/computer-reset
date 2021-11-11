import { Component, OnDestroy, OnInit } from '@angular/core';
import { DataService } from '../data.service';
import { Signup, StateList, CityList, TimeslotSmall, openEvent, CountryList } from '../data';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { utcToZonedTime } from 'date-fns-tz';

@Component({
  selector: 'app-event',
  templateUrl: './event.component.html',
  styleUrls: ['./event.component.scss']
})

export class EventComponent implements OnInit, OnDestroy {

  public signUp: Signup = {realname: "", cityNm: "", stateCd: "", countryCd: "", eventId: 0,
    fbId: this.dataService.userFull.facebookId,
    firstNm: this.dataService.userFull.firstName,
    lastNm: this.dataService.userFull.lastName,
    flexibleInd: false
  };

  public events: TimeslotSmall[];
  public agreeInd: boolean = false;
  public eventForm: FormGroup;
  public states: StateList[];
  public cities: CityList[];
  public country: CountryList[];
  public responseJson: string;
  public submitResult: string;
  public submitProcess: boolean = false;
  public loadStatus: boolean = true;
  public moveOrSignup: boolean;
  public signedupSlot: number;
  public stopChange: boolean = false;

  public intlInd: boolean;

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
        stateCd: new FormControl(''),
        countryCd: new FormControl(''),
        flexibleInd: new FormControl(''),
        intlInd: new FormControl('')
      });

      //get routed event id if needed
      this.signUp.eventId = this.dataService.eventIdPass;
      this.dataService.eventIdPass = 0;

      //set this here because if we reload, we don't want to flash the screen
      this.loadStatus = false;
      this.loadEvents();

      this.dataService.getState().subscribe(
        result => { this.states = result; }
        );

      this.dataService.getCountryCodes().subscribe(
        result => { this.country = result; }
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

      // If the user isn't USA, default. We only show this if we have an international event.
      if (this.dataService.userFull.countryCd == null ) {
        this.eventForm.patchValue({countryCd: "US"});
      } else {
        this.eventForm.patchValue({countryCd: this.dataService.userFull.countryCd});
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

  loadEvents() {
    //loads all events from web service and parses based on requirements

    this.dataService.getOpenEventUser().subscribe({next: (data: openEvent)=>{
      this.events = data.timeslot;
      this.moveOrSignup = data.moveFlag;
      this.signedupSlot = data.signedUpTimeslot ?? -1;
      this.eventForm.patchValue({flexibleInd: data.flexSlot ?? false});
      this.events.forEach((event, index) => {
        event.eventStartTms = utcToZonedTime(event.eventStartTms, 'America/Chicago');
        event.eventEndTms = utcToZonedTime(event.eventEndTms, 'America/Chicago');
        if (event.id === this.signUp.eventId) {
          console.log(event.id);
          console.log(this.signUp.eventId);
          this.intlInd = event.intlEventInd;
        }
        this.events[index] = event;
      });

    },
    error: (err) => {
      this.dataService.handleError(err);
    },
    complete: () => {
      this.loadStatus = true;}});
  }

  async eventSubmit() {
    //builds out signup object. We already have the first pieces.
    this.submitProcess = true;

    if (this.eventForm.value.realName) {
      this.signUp.realname = this.eventForm.value.realName;
    }

    if (this.eventForm.value.flexibleInd) {
      this.signUp.flexibleInd = true;
    }

    this.signUp.cityNm = this.eventForm.value.cityNm;
    this.signUp.stateCd = this.eventForm.value.stateCd; //this is a code, not an index
    this.signUp.countryCd = this.eventForm.value.countryCd;

    this.signUp.eventId = this.eventForm.value.eventId; //always take from form, assuming we pre-populate

    //final checks. This is in case of form hacking.
    console.log(this.signUp);
    if (this.signUp.eventId == 0 || !this.signUp.eventId) {
      this.submitResult = "You may have not selected an event. Please try again.";
      this.submitProcess = false;
    } else if (!this.signUp.cityNm) {
      this.submitResult = "We did not find a city. Please try again.";
      this.submitProcess = false;
    } else if (!this.signUp.stateCd || !this.signUp.countryCd) {
      this.submitResult = "We did not find a country or state. Please try again."
      this.submitProcess = false;
    /*} else if (!this.moveOrSignup) {
      this.submitResult = "You are already signed up for an open slot."
      this.submitProcess = false;*/
    } else {
      //all is good, lets fire the web service
      //determine if move or signup
      if (!this.moveOrSignup) {
        await this.dataService.signupForEvent(this.signUp).subscribe({next: (data => {
          this.submitResult = data;
          this.submitProcess = false;
          this.stopChange = true;
          this.loadEvents();
      }),
      error: (err) => {
        this.dataService.handleError(err);
      }});
      }
    }
  }

  //onchange handler next to clear status for submitResult

  onChanges(): void {
    this.eventForm.valueChanges.subscribe(val => {
      if (this.stopChange == false) {
        this.submitResult = null;
      } else {
        this.stopChange = false;
      }

    });
  }
  // onchange for state

  changeCityList(event) {
    //console.log("GetCity");
    this.dataService.getCity(event.value).pipe(
      takeUntil(this.destroy$)).subscribe(result => {
        this.cities = result;
      }
    );
  }

  changeIntlEvent(intlEvent: boolean) {
    console.log(intlEvent);
    this.intlInd = intlEvent;
    console.log(this.intlInd);
  }

}
