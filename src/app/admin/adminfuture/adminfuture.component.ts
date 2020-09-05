import { Component, OnInit, OnDestroy } from '@angular/core';
import { DataService } from '../../data.service';
import { Timeslot, UserEventSignup } from '../../data';
import { FormGroup, FormControl, Validators, FormBuilder, ReactiveFormsModule } from '@angular/forms';


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
  public maxEvents: number = 1;
  public signupForm: FormGroup;
  public signupLimit: number = 0;


  constructor(private dataService: DataService, 
    private formBuilder: FormBuilder) { }

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

  ngOnInit() {

    this.signupForm = this.formBuilder.group({
      id: new FormControl(''),
      attendNbr: new FormControl(''),
      maxEvents: new FormControl(this.maxEvents)
    });

    this.dataService.getEventFuture(this.dataService.userFull.facebookId)
      .subscribe((data: Timeslot[]) => { this.events = data });

    //console.log(this.dataService.userFull);

  }

  ngOnDestroy() { }

  pullEventSignedUp(eventTimeslot: Timeslot ) {
    console.log("pull eventsignedup");
    this.dataService.getSignedUpUsers(eventTimeslot.id, this.maxEvents, this.dataService.userFull.facebookId)
      .subscribe((data: UserEventSignup[]) => this.eventSignedUp = data);

  }

  updateSignup(event: any) {
    //parse out event
    var attendNbr = event.target.value;
    console.log(event);
    
    //formField: string, id: number, attendNbr: number
    /*if (attendNbr > this.signupLimit || attendNbr < 0) {
      this.signupForm.value.formField = null;
      return "This value was invalid, please try again."
    } else {
      return this.dataService.sendUserSlot(id, attendNbr, this.dataService.userFull.facebookId);
    }*/
  }

}