import { Component, OnInit, OnDestroy } from '@angular/core';
import { DataService } from '../../data.service';
import { Timeslot, UserEventDayOf } from '../../data';
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
  public eventSignedUp: UserEventDayOf[];
  public maxEvents: number;
  public signupForm: FormGroup;
  public signupLimit: number = 0;
  public selectedRowIndex = -1;
  public loadStatus = false;

  constructor(private dataService: DataService, 
    private formBuilder: FormBuilder) { }

    private readonly onDestroy = new Subject<void>();

  ngOnInit(): void {

    this.dataService.getEventFuture(this.dataService.userFull.facebookId)
      .subscribe((data: Timeslot[]) => { this.events = data });

  }

  ngOnDestroy() { 
    this.onDestroy.next();
  }

  async pullEventSignedUp(eventTimeslot: Timeslot ) {
    //console.log("pull eventsignedup");
    this.loadStatus = false;
    this.signupForm = null;
    //reset form
    this.signupForm = this.formBuilder.group({});
    //console.log(this.maxEvents);
    //trying a promise
    this.eventSignedUp = [];
    const promise = this.dataService.getSignupDayOf(eventTimeslot.id, this.dataService.userFull.facebookId)
    .then((data: UserEventDayOf[]) => {
        // Success
        data.map((event: UserEventDayOf) => {
          //console.log(event);
          this.signupForm.addControl(event.id.toString(), new FormControl(event.attendInd ?? false));
          this.signupForm.addControl('ns'+event.id.toString(), new FormControl(event.noShowInd ?? false));

          //console.log(this.signupForm);
          this.eventSignedUp.push(event);
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

  async updateSignup(event: any) {
    //parse out event
    var attendVal = event.source.checked;
    var id = event.source.id;

    var rtnTxt = await this.dataService.sendUserAttend(id, this.dataService.userFull.facebookId);
    //we don't care about this value right now but may snackbar it
  }

  async updateNoShow(event: any) {
    //parse out event
    var noshowVal = event.source.checked;
    var noShowId = event.source.id;
    noShowId = noShowId.substring(2);
    //console.log(signupId);
    var id: number = parseInt(noShowId);

    var rtnTxt = await this.dataService.sendNoShow(id, this.dataService.userFull.facebookId);
    //we don't care about this value right now but may snackbar it
  }

}
