import { Component, OnInit, OnDestroy } from '@angular/core';
import { DataService } from '../../data.service';
import { Timeslot, UserEventDayOf } from '../../data';
import { FormGroup, FormControl, FormBuilder } from '@angular/forms';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-pastevent',
  templateUrl: './pastevent.component.html',
  styleUrls: ['./pastevent.component.scss']
})
export class PasteventComponent implements OnInit, OnDestroy {

  public events: Timeslot[] = [];
  public eventId = 0;
  public eventTimeslotSelect: Timeslot;
  public eventSignedUp: UserEventDayOf[];
  public signedUpNoShow: UserEventDayOf[];
  public maxEvents: number;
  public signupForm: FormGroup;
  public noShowForm: FormGroup;
  public signupLimit: number = 0;
  public selectedRowIndex = -1;
  public loadStatus = false;
  public noShowFlag = false;
  public initialListStatus = false;
  selectEvent = new FormControl();

  constructor(private dataService: DataService,
    private formBuilder: FormBuilder) { }

    private readonly onDestroy = new Subject<void>();

  ngOnInit(): void {
    this.initialListStatus = true;
    this.dataService.getEventAll()
      .subscribe({next: (data: Timeslot[]) => {
        this.events = data;
        this.initialListStatus = false;
     },
     error: (err) => {
       this.dataService.handleError(err);
     }});

  }

  ngOnDestroy() {
    this.onDestroy.next();
  }

  async pullEventSignedUp(eventTimeslot: Timeslot ) {
    //console.log("pull eventsignedup");
    this.loadStatus = false;
    this.signupForm = null;
    this.noShowFlag = false;
    //reset form
    this.signupForm = this.formBuilder.group({});
    //console.log(this.maxEvents);
    //trying a promise
    this.eventSignedUp = [];
    const promise = this.dataService.getSignupDayOf(eventTimeslot.id)
    .catch(err => this.dataService.handleError(err))
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

  public pickEvent(selectEvent: any) {
    //test if number works
    if(selectEvent.value >= 0 || selectEvent.value <= 1000) {
      this.eventId = selectEvent.value;

      this.events.forEach(timeslot => {
        if (timeslot.id === selectEvent.value) {
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

    var rtnTxt = await this.dataService.sendUserAttend(id);
    //we don't care about this value right now but may snackbar it
  }

  async updateNoShow(event: any) {
    //parse out event
    var noshowVal = event.source.checked;
    var noShowId = event.source.id;
    noShowId = noShowId.substring(2);
    //console.log(signupId);
    var id: number = parseInt(noShowId);

    var rtnTxt = await this.dataService.sendNoShow(id);
    //we don't care about this value right now but may snackbar it
  }

  public showNoShow(id: number) {
    this.noShowForm = null;
    this.noShowFlag = false;
    //reset form
    this.noShowForm = this.formBuilder.group({});
    this.signedUpNoShow = [];
    const promise = this.dataService.getSignupDayOf(id)
    .catch(err => this.dataService.handleError(err))
    .then((data: UserEventDayOf[]) => {
        // Success
        data.map((event: UserEventDayOf) => {
          //console.log(event);
          if (!event.attendInd) {
            this.noShowForm.addControl('ns'+event.id.toString(), new FormControl(event.noShowInd ?? false));
            this.signedUpNoShow.push(event);
          }
        });
        //console.log(this.signedUpNoShow);
      Object.assign(this, data);
    })
    .then(() => this.noShowFlag = true);
  }

}

