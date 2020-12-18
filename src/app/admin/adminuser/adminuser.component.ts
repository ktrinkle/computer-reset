import { Component, OnDestroy, OnInit } from '@angular/core';
import { DataService } from '../../data.service';
import { Timeslot, UserManual, StateList, CityList } from '../../data';
import { FormGroup, FormControl, Validators, FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { Subject, Observable } from 'rxjs';
import { takeUntil, map, startWith } from 'rxjs/operators';
import { DatePipe } from '@angular/common';
import { format, parse } from 'date-fns';

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
  public selectedRowIndex = -1;
  public loadStatus = false;
  public submitResult: string;
  public submitProcess: boolean = false;
  private readonly onDestroy = new Subject<void>();
  filteredOptions: Observable<UserManual[]>;

  destroy$: Subject<void> = new Subject<void>();

  constructor(private dataService: DataService,
    private formBuilder: FormBuilder) {
      this.filteredOptions = this.userForm.valueChanges
      .pipe(
        startWith(''),
        map(firstNm => firstNm ? this._filterFirst(firstNm) : this.userList.slice())
      );
    }

  ngOnInit(): void {

    this.userForm = this.formBuilder.group({
      id: new FormControl(''), //needs datetime validation
      firstNm: new FormControl(''),
      lastNm: new FormControl(''),
      cityNm: new FormControl(''),
      stateCd: new FormControl(''),
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
    //submits user form as userManual
    this.submitProcess = true;


  }

  eventSubmit() {
    //builds out signup object. We already have the first pieces.
    this.submitProcess = true;

    if (!this.userAssignEvent.value.eventId || this.userAssignEvent.value.eventId == 0) {
      //error if nothing is selected
      this.submitResult = "You may have not selected an event. Please try again.";
      this.submitProcess = false;
    };

    //need to build out signup json

    //all is good, lets fire the web service
    //this.dataService.signupForEvent(this.signUp).subscribe((data => {
    //    this.submitResult = data;
    //    this.submitProcess = false;
    //}));
  }


  onChanges(): void {
    this.userForm.valueChanges.subscribe(val => {
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
