import { Component, OnDestroy, OnInit } from '@angular/core';
import { DataService } from '../../data.service';
import { Timeslot, UserManual, StateList, CityList, Signup } from '../../data';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { Subject, Observable } from 'rxjs';
import { takeUntil, map, startWith } from 'rxjs/operators';

@Component({
  selector: 'app-adminuser',
  templateUrl: './adminuser.component.html',
  styleUrls: ['./adminuser.component.scss']
})
export class AdminuserComponent implements OnInit, OnDestroy {

  public events: Timeslot[] = [];
  public eventId = 0;
  public userList: UserManual[] = [];
  public currentUser: UserManual;
  public states: StateList[];
  public cities: CityList[];
  public userForm: FormGroup;
  public userAssignEvent: FormGroup;
  public loadStatus = false;
  public submitResult: string;
  public submitProcess: boolean = false;
  public addOrChange = 0;
  public submitUserEvent: boolean = false;
  public submitUserEventResult: string;
  private readonly onDestroy = new Subject<void>();
  filteredOptions: Observable<UserManual[]>;

  destroy$: Subject<void> = new Subject<void>();

  constructor(private dataService: DataService,
    private formBuilder: FormBuilder) {
      /*this.filteredOptions = this.userForm.valueChanges
      .pipe(
        startWith(''),
        map(firstNm => firstNm ? this._filterFirst(firstNm) : this.userList.slice())
      );*/
    }

  ngOnInit(): void {
    console.log('Opening user management');
    this.userForm = this.formBuilder.group({
      id: new FormControl(''),
      firstNm: new FormControl(''),
      lastNm: new FormControl(''),
      cityNm: new FormControl(''),
      stateCd: new FormControl('TX'),
      realNm: new FormControl(''),
      fbId: new FormControl(''),
      banFlag: new FormControl(''),
      adminFlag: new FormControl(''),
      volunteerFlag: new FormControl('')
    });

    this.userAssignEvent = this.formBuilder.group({
      eventId: new FormControl(''),
      realName: new FormControl(''),
      facebookId: new FormControl('', [Validators.required]),
      cityNm: new FormControl('', [Validators.required]),
      stateCd: new FormControl('', [Validators.required])
    });

    this.dataService.getEventAll(this.dataService.userFull.facebookId).subscribe((data: Timeslot[]) => {
        this.events = data;
      });

    this.dataService.getState().subscribe(
      result => { this.states = result; }
    );

    //default for new users is TX, mostly because that will be who we add manually 95% of the time
    this.userForm.patchValue({stateCd: "TX"});
    this.dataService.getCity("TX").pipe(
      takeUntil(this.destroy$)).subscribe(result => {
        this.cities = result;
      }
    );

  }

  ngOnDestroy(): void {

  }

  private _filterFirst(value: string): UserManual[] {
    const filterValue = value.toLowerCase();

    return this.userList.filter(option => option.firstNm.toLowerCase().indexOf(filterValue) === 0);
  }

  private _filterLast(value: string): UserManual[] {
    const filterValue = value.toLowerCase();

    return this.userList.filter(option => option.lastNm.toLowerCase().indexOf(filterValue) === 0);
  }

  private _filterReal(value: string): UserManual[] {
    const filterValue = value.toLowerCase();

    return this.userList.filter(option => option.realNm.toLowerCase().indexOf(filterValue) === 0);
  }

  submitUserForm(): void {
    //submits user form as userManual. Same API uses both, we just use ID as the delineation
    //since this is admin we are not really doing validation
    this.submitProcess = true;

    this.currentUser = null;
    if (this.addOrChange == 1) {
      this.currentUser.id = 0;
      this.currentUser.realNm = this.userForm.value.firstNm || " " || this.userForm.value.lastNm;
    } else {
      this.currentUser.id = this.userForm.value.id;
      this.currentUser.realNm = this.userForm.value.realNm;
    };

    this.currentUser.firstNm = this.userForm.value.firstNm;
    this.currentUser.lastNm = this.userForm.value.lastNm;
    this.currentUser.cityNm = this.userForm.value.cityNm;
    this.currentUser.stateCd = this.userForm.value.stateCd;

    //set our facebook ID
    this.currentUser.facebookId = this.dataService.userFull.facebookId;

    //this returns a users object.

    this.dataService.updateUser(this.currentUser).subscribe(data => {
      this.currentUser = data;
      this.userForm.value.id = data.id;
      this.userForm.value.firstName = data.firstNm;
      this.userForm.value.lastNm = data.lastNm;
      this.userForm.value.cityNm = data.cityNm;
      this.userForm.value.stateCd = data.stateCd;
      this.userForm.value.realNm = data.realNm;
      this.userForm.value.fbId = data.fbId;
      this.userForm.value.banFlag = data.banFlag;
      this.userForm.value.adminFlag = data.adminFlag;
      this.userForm.value.volunteerFlag = data.volunteerFlag;
      //do the stuff for assign a user to the event
      this.userAssignEvent.value.facebookId = data.fbId;
      this.userAssignEvent.value.cityNm = data.cityNm;
      this.userAssignEvent.value.stateCd = data.stateCd;
      this.userAssignEvent.value.realNm = data.realNm;
      this.addOrChange = 2; //change to edit
      this.submitProcess = false;
      this.submitResult = "This user has been successfully entered into the system.";
    })
  }

  clearUserForm() {
    this.submitProcess = false;
    this.submitResult = null;
    this.userForm = null;
    this.userAssignEvent = null;
  }

  submitEvent() {
    //builds out signup object. We already have the first pieces.
    this.submitUserEvent = true;

    if (!this.userAssignEvent.value.eventId || this.userAssignEvent.value.eventId == 0) {
      //error if nothing is selected
      this.submitUserEventResult = "You may have not selected an event. Please try again.";
      this.submitUserEvent = false;
    };

    //need to build out signup json

    var signUp: Signup = {realname: this.userAssignEvent.value.realNm,
      cityNm: this.userForm.value.cityNm,
      stateCd: this.userForm.value.stateCd,
      eventId: this.userAssignEvent.value.eventId,
      fbId: this.userAssignEvent.value.fbId,
      firstNm: this.userAssignEvent.value.firstNm,
      lastNm: this.userAssignEvent.value.lastNm,
      flexibleInd: false
    };

    if (!signUp.fbId) {
      this.submitUserEventResult = "We do not have a user loaded. Please try again.";
      this.submitUserEvent = false;
    };

    //all is good, lets fire the web service
    this.dataService.signupForEvent(signUp).subscribe((data => {
        this.submitUserEventResult = data;
        this.submitUserEvent = false;
    }));
  }


  /*onChanges(): void {
    this.userForm.valueChanges.subscribe(val => {
      this.submitResult = null;
    });
  }*/
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
