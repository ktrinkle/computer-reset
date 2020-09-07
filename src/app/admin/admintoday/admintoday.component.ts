import { Component, OnInit, OnDestroy } from '@angular/core';
import { DataService } from '../../data.service';
import { Timeslot, UserEventSignup } from '../../data';
import { FormGroup, FormControl, Validators, FormBuilder, ReactiveFormsModule, FormArray } from '@angular/forms';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-admintoday',
  templateUrl: './admintoday.component.html',
  styleUrls: ['./admintoday.component.scss']
})
export class AdmintodayComponent implements OnInit, OnDestroy {

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
    private formBuilder: FormBuilder) { }

    private readonly onDestroy = new Subject<void>();

  ngOnInit(): void {

    this.dataService.getEventCurrent(this.dataService.userFull.facebookId)
      .subscribe((data: Timeslot[]) => { this.events = data });

  }

  ngOnDestroy() { 
    this.onDestroy.next();
  }

  async pullEventSignedUp(eventTimeslot: Timeslot ) {
    //console.log("pull eventsignedup");
    this.loadStatus = false;
    this.signupForm = null;
    console.log(this.maxEvents);
    //replace form
    this.signupForm = this.formBuilder.group({
      attendNbr: new FormControl(''),
      maxEvents: new FormControl(this.maxEvents, [Validators.pattern('[0-9]*')])
    });
    //trying a promise
    this.eventSignedUp = [];
    const promise = this.dataService.getSignupDayOf(eventTimeslot.id, this.maxEvents, this.dataService.userFull.facebookId)
    .then((data: UserEventSignup[]) => {
        // Success
        data.map((event: UserEventSignup) => {
          //console.log(event);
          this.signupForm.addControl(event.id.toString(), new FormControl(event.attendNbr, [Validators.pattern('[0-9]*')]));

          //console.log(this.signupForm);
          this.eventSignedUp.push(event); //does this blend
          //console.log(this.eventSignedUp);
        });
      Object.assign(this, data);
    })
    .then(() => this.loadStatus = true);
  }

  highlight(row){
    this.selectedRowIndex = row.id;
  }

  public pickEvent(selectEvent: number) {
    //test if number works
    if(selectEvent >= 0 || selectEvent <= 365) {
      this.eventId = selectEvent;

      this.events.forEach(timeslot => {
        if (timeslot.id === selectEvent) {
          this.eventTimeslotSelect = timeslot;
        }
      });

      this.pullEventSignedUp(this.eventTimeslotSelect);

    } else {
      this.eventId = 0;
      this.signupLimit = 0;
    }


  }

}
