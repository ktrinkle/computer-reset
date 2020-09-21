import { Component, OnInit, OnDestroy, Inject } from '@angular/core';
import { DataService } from '../../data.service';
import { Timeslot, UserEventSignup, UserEventNote } from '../../data';
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
  public signupLimit: number = 0;
  public selectedRowIndex = -1;
  public loadStatus = false;
  private readonly onDestroy = new Subject<void>();
  
  constructor(private dataService: DataService) { }

  ngOnInit(): void {
    this.dataService.getEventFuture(this.dataService.userFull.facebookId)
      .subscribe((data: Timeslot[]) => { this.events = data });

  }

  ngOnDestroy() { 
    this.onDestroy.next();
  }

  public pickEvent(selectEvent: number) {
    //test if number works
    if(selectEvent >= 0 || selectEvent <= 365) {
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
  //trying a promise
  this.eventSignedUp = [];
  const promise = this.dataService.getSignedUpUsers(eventTimeslot.id, this.maxEvents, this.dataService.userFull.facebookId)
  .then((data: UserEventSignup[]) => {
      // Success
      data.map((event: UserEventSignup) => {
        //console.log(event);
        if (event.attendNbr) {
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

}
