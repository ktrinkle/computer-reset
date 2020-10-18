import { Component, OnInit, OnDestroy, Inject } from '@angular/core';
import { DataService } from '../../data.service';
import { Timeslot, UserEventSignup, UserEventNote } from '../../data';
import { FormGroup, FormControl, Validators, FormBuilder, ReactiveFormsModule, FormArray } from '@angular/forms';
import { MatSnackBar, MAT_SNACK_BAR_DATA } from '@angular/material/snack-bar';
import { Subject } from 'rxjs';


@Component({
  selector: 'app-adminfuture',
  templateUrl: './adminfuture.component.html',
  styleUrls: ['./adminfuture.component.scss']
})
export class AdminfutureComponent implements OnInit, OnDestroy {

  public events: Timeslot[] = [];
  public eventId = 0;
  public eventTimeslotSelect: Timeslot;
  public eventSignedUp: UserEventSignup[];
  public maxEvents: number;
  public signupForm: FormGroup;
  public signupLimit: number = 0;
  public selectedRowIndex = -1;
  public loadStatus = false;


  constructor(private dataService: DataService, 
    private formBuilder: FormBuilder,
    private _snackBar: MatSnackBar) { }

    private readonly onDestroy = new Subject<void>();

  public pickEvent(selectEvent: number) {
    //test if number works
    if(selectEvent >= 0 || selectEvent <= 365) {
      this.eventId = selectEvent;

      this.events.forEach(timeslot => {
        if (timeslot.id === selectEvent) {
          //console.log('Timeslot found');
          //console.log(timeslot);
          this.eventTimeslotSelect = timeslot;
          this.signupLimit = timeslot.eventSlotCnt + timeslot.overbookCnt;
        }
      });

      //console.log(this.eventTimeslotSelect);
      this.pullEventSignedUp(this.eventTimeslotSelect);

    } else {
      this.eventId = 0;
      this.signupLimit = 0;
    }


  }

  get s() {
    return this.signupForm.get('signupIds') as FormArray; 
    }

  ngOnInit() {

    this.maxEvents = 1;

    this.signupForm = this.formBuilder.group({
      attendNbr: new FormControl(''),
      maxEvents: new FormControl(this.maxEvents, [Validators.pattern('[0-9]*')])
    });

    this.dataService.getEventFuture(this.dataService.userFull.facebookId)
      .subscribe((data: Timeslot[]) => { this.events = data });

    //console.log(this.dataService.userFull);

  }

  ngOnDestroy() { 
    this.onDestroy.next();
  }

  changeSignupEvent(event: any) {
      //eventtimeslotselect is already filled out.
      this.maxEvents = event.target.value;
      this.pullEventSignedUp(this.eventTimeslotSelect);

  }

  async pullEventSignedUp(eventTimeslot: Timeslot ) {
    //console.log("pull eventsignedup");
    this.loadStatus = false;
    this.signupForm = null;
    //console.log(this.maxEvents);
    //replace form
    this.signupForm = this.formBuilder.group({
      attendNbr: new FormControl(''),
      maxEvents: new FormControl(this.maxEvents, [Validators.pattern('[0-9]*')])
    });
    //trying a promise
    this.eventSignedUp = [];
    const promise = this.dataService.getSignedUpUsers(eventTimeslot.id, this.maxEvents, this.dataService.userFull.facebookId)
    .then((data: UserEventSignup[]) => {
        // Success
        data.map((event: UserEventSignup) => {
          //console.log(event);
          this.signupForm.addControl(event.id.toString(), new FormControl(event.attendNbr, [Validators.pattern('[0-9]*')]));
          this.signupForm.addControl('signupTxt' + event.id.toString(), new FormControl(event.signupTxt));

          //console.log(this.signupForm);
          this.eventSignedUp.push(event); //does this blend
          //console.log(this.eventSignedUp);
        });
      Object.assign(this, data);
    })
    .then(() => this.loadStatus = true);
  }

  async updateSignup(event: any) {
    //parse out event
    var attendNbrTxt = event.target.value;
    var attendNbr: number = parseInt(attendNbrTxt);
    var id = event.target.id;

    if ((attendNbr > this.signupLimit || attendNbr < 0)) {
      this.signupForm.value.formField = null;
      this.openSnackBar("This value is invalid. Please try again.");
    } else {
      this.openSnackBar(await this.dataService.sendUserSlot(id, attendNbr, this.dataService.userFull.facebookId));
    }
  }

  updateSignupTxt(event: any) {
    //parse out event
    var signupId = event.target.id;
    signupId = signupId.substring(9);
    //console.log(signupId);
    var id: number = parseInt(signupId);
    var val = event.target.value; //this is the string

    const userNote:UserEventNote = {
      id: id,
      signupTxt: val,
      fbId: this.dataService.userFull.facebookId
    };

    var rtn = this.dataService.updateUserNote(userNote).then(data => {
      this.openSnackBar(data);
      Object.assign(this, data.toString())
    });
  }

  highlight(row){
      this.selectedRowIndex = row.id;
  }

  openSnackBar(displayText: string) {
    this._snackBar.openFromComponent(AlertComponent, {
      duration: 5000,
      data: displayText
    });
  }

}

//this may need to be a new component
@Component({
  selector: 'app-adminfuture-snackbar',
  templateUrl: './adminfuture.snackbar.html',
  styleUrls: ['./adminfuture.component.scss']
})
export class AlertComponent {
  constructor(@Inject(MAT_SNACK_BAR_DATA) public data: any) { }
}
