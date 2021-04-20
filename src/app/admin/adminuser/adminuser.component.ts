import { Component, OnDestroy, OnInit } from '@angular/core';
import { DataService } from '../../data.service';
import { Timeslot, UserManual, StateList, CityList, Signup } from '../../data';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil, debounceTime, switchMap, tap } from 'rxjs/operators';
import { AlertComponent } from '../adminfuture/adminfuture.component';
import { MatSnackBar } from '@angular/material/snack-bar';


@Component({
  selector: 'app-adminuser',
  templateUrl: './adminuser.component.html',
  styleUrls: ['./adminuser.component.scss']
})
export class AdminuserComponent implements OnInit, OnDestroy {

  public events: Timeslot[] = [];
  public eventId = 0;
  public userList: UserManual[] = [];
  public currentUser: UserManual = {} as UserManual;
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
  selectId = new FormControl();
  adminUserInd = new FormControl();
  volUserInd = new FormControl();
  banUserInd = new FormControl();
  public loadingLookup: boolean = false;

  lookupList: UserManual[];  //to go away?

  destroy$: Subject<void> = new Subject<void>();

  constructor(private dataService: DataService,
    private _snackBar: MatSnackBar) {}

  ngOnInit(): void {
    this.userForm = new FormGroup({
      id: new FormControl('0'),
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

    this.userAssignEvent = new FormGroup({
      eventId: new FormControl(''),
      realNm: new FormControl(''),
      firstNm: new FormControl(''),
      lastNm: new FormControl(''),
      facebookId: new FormControl('', [Validators.required]),
      cityNm: new FormControl('', [Validators.required]),
      stateCd: new FormControl('', [Validators.required]),
      fbId: new FormControl('')
    });


    this.dataService.getEventAll().subscribe((data: Timeslot[]) => {
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
    ).catch(err => this.dataService.handleError);

    //failing on data?.trim.length() > 2, saying is not a function
    this.selectId.valueChanges.pipe(
      //filter(data => data.length > 2),
      debounceTime(500),
      tap(() => {
        this.lookupList = [];
        this.loadingLookup = true;
      }),
      switchMap(value => this.dataService.lookupUser(value.toString()))
    )
    .subscribe((data: UserManual[]) => {
      this.lookupList = data;
      this.loadingLookup = false;
      if (data.length == 0) {
        this.userForm.patchValue(this.selectId.value);
        this.userAssignEvent.patchValue(this.selectId.value);
        this.adminUserInd.patchValue(this.selectId.value.adminFlag);
        this.currentUser = this.selectId.value;
        this.volUserInd.patchValue(this.selectId.value.volunteerFlag);
        this.banUserInd.patchValue(this.selectId.value.banFlag);
        this.submitResult = "";
        this.submitUserEventResult = "";
        };
      }
    );
  }

  ngOnDestroy(): void {

  }

  showName(lookup: UserManual) : string {
    //set values in display textbox
    this.currentUser = lookup;
    return lookup ? lookup.firstNm + ' ' + lookup.lastNm : '';
  }

  public submitUserForm(): void {
    //submits user form as userManual. Same API uses both, we just use ID as the delineation
    //since this is admin we are not really doing validation

    //console.log('Beginning submit');
    this.submitProcess = true;

    console.log(this.userForm);
    if (this.addOrChange == 0) {
      this.currentUser = {} as UserManual;
      this.currentUser.id = 0;
    } else {  //assume we already have a currentuser
      this.currentUser.id = this.userForm.value.id;
    };

    this.currentUser.realNm = this.userForm.value.realNm;
    this.currentUser.firstNm = this.userForm.value.firstNm;
    this.currentUser.lastNm = this.userForm.value.lastNm;
    this.currentUser.cityNm = this.userForm.value.cityNm;
    this.currentUser.stateCd = this.userForm.value.stateCd;

    //set our facebook ID
    this.currentUser.facebookId = this.dataService.userFull.facebookId;

    this.dataService.updateUser(this.currentUser).subscribe({next: data => {
      this.currentUser = data;
      this.userForm.patchValue(data);
      //do the stuff for assign a user to the event
      this.userAssignEvent.patchValue(data);
      this.addOrChange = 1; //change to edit
      this.submitProcess = false;
      this.submitResult = "This user has been successfully entered into the system.";
      this.selectId.reset();
    },
    error: (err) => {
      this.dataService.handleError(err);
    }})
  }

  clearUserForm() {
    this.submitProcess = false;
    this.submitResult = null;
    this.userForm.reset();
    this.userAssignEvent.reset();
    this.currentUser = {} as UserManual;
  }

  submitEvent() {
    //builds out signup object. We already have the first pieces.
    this.submitUserEvent = true;
    console.log(this.userAssignEvent);

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

    // all is good, lets fire the web service
    this.dataService.adminAddToEvent(signUp).subscribe({next:(data => {
        this.submitUserEventResult = data;
        this.submitUserEvent = false;
    }),
    error: (err) => {
      this.dataService.handleError(err);
    }});
  }

  async changeAdminInd(event: any) {
    //parse out event
    var id = this.userForm.value.id;

    var rtnTxt = await this.dataService.changeAdminState(id);
    this.openSnackBar(rtnTxt);
  }

  async changeBanInd(event: any) {
    //parse out event
    var id = this.userForm.value.id;

    var rtnTxt = await this.dataService.changeBanState(id);
    this.openSnackBar(rtnTxt);
  }

  async changeVolInd(event: any) {
    //parse out event
    var id = this.userForm.value.id;

    var rtnTxt = await this.dataService.changeVolunteerState(id);
    this.openSnackBar(rtnTxt);
  }

  changeCityList(event) {
    //console.log("GetCity");
    this.dataService.getCity(event.value).pipe(
      takeUntil(this.destroy$)).subscribe(result => {
        this.cities = result;
      }
    );
  }

  openSnackBar(displayText: string) {
    this._snackBar.openFromComponent(AlertComponent, {
      duration: 5000,
      data: displayText
    });
  }

}
