import { Component, OnInit, OnDestroy, Inject } from '@angular/core';
import { DataService } from '../../data.service';
import { Timeslot, UserEventSignup } from '../../data';
import { FormGroup, FormControl, FormBuilder } from '@angular/forms';

import { Subject } from 'rxjs';

@Component({
  selector: 'app-userlist',
  templateUrl: './userlist.component.html',
  styleUrls: ['./userlist.component.scss']
})
export class UserlistComponent implements OnInit, OnDestroy {

  public events: Timeslot[] = [];
  public eventId = 0;
  public eventTimeslotSelect: Timeslot;
  public eventSignedUp: UserEventSignup[];
  public maxEvents: number = 999;
  public signupForm: FormGroup;
  public signupLimit: number = 0;
  public selectedRowIndex = -1;
  public loadStatus = false;
  private readonly onDestroy = new Subject<void>();

  constructor(private dataService: DataService,
    private formBuilder: FormBuilder) { }

  ngOnInit(): void {
    this.dataService.getEventFuture(this.dataService.userFull.facebookId)
      .subscribe((data: Timeslot[]) => { this.events = data });

  }

  ngOnDestroy() {
    this.onDestroy.next();
  }

  public pickEvent(selectEvent: number) {
    //test if number works
    if(selectEvent >= 0 || selectEvent <= 1999) {
      this.eventId = selectEvent;

      this.events.forEach(timeslot => {
        if (timeslot.id === selectEvent) {
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

  changeSignupEvent(event: any) {
    //eventtimeslotselect is already filled out.
    this.pullEventSignedUp(this.eventTimeslotSelect);

}

//this is filtered to only pull folks who have a slot number. We use the same API, but do a filter on this level.
//Mostly because I don't feel like making another API.
async pullEventSignedUp(eventTimeslot: Timeslot ) {
  //console.log("pull eventsignedup");
  this.loadStatus = false;
  this.signupForm = null;
  //reset form
  this.signupForm = this.formBuilder.group({});
  //trying a promise
  this.eventSignedUp = [];
  const promise = this.dataService.getSignedUpUsers(eventTimeslot.id, this.dataService.userFull.facebookId)
  .then((data: UserEventSignup[]) => {
      // Success
      data.map((event: UserEventSignup) => {
        //console.log(event);
        if (event.attendNbr) {
          this.signupForm.addControl(event.id.toString(), new FormControl(event.confirmInd));  //defaults to false in DB
          this.eventSignedUp.push(event);
        }
        //console.log(this.eventSignedUp);
      });
    Object.assign(this, data);
  })
  .then(() => this.loadStatus = true);
  }

  highlight(row){
    this.selectedRowIndex = row.id;
  }

  async updateSignup(event: any) {
    //parse out event
    var attendVal = event.source.checked;
    var id = event.source.id;

    var rtnTxt = await this.dataService.sendUserConfirm(id, this.dataService.userFull.facebookId);
    //we don't care about this value right now but may snackbar it
  }

}
