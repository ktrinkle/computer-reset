import { Component, OnDestroy, OnInit } from '@angular/core';
import { DataService } from '../../data.service';
import { Timeslot } from '../../data';
import { FormGroup, FormControl, Validators, FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil, map } from 'rxjs/operators';
import { DatePipe } from '@angular/common';
import { format, parse } from 'date-fns';

@Component({
  selector: 'app-createevent',
  templateUrl: './createevent.component.html',
  styleUrls: ['./createevent.component.scss'],
  providers: [DatePipe]
})
export class CreateeventComponent implements OnInit, OnDestroy {

  public events: Timeslot[] = [];
  public eventId = 0;
  public eventTimeslotSelect: Timeslot = <Timeslot>{};
  public newEventForm: FormGroup;
  public currEvents: FormGroup;
  public signupLimit: number = 0;
  public selectedRowIndex = -1;
  public loadStatus = false;
  public submitResult: string;
  public submitProcess: boolean = false;
  public selectEventId = 0;
  private readonly onDestroy = new Subject<void>();

  destroy$: Subject<void> = new Subject<void>();

  constructor(private dataService: DataService, 
    private formBuilder: FormBuilder,
    private datePipe: DatePipe) { }

  ngOnInit(): void {

    this.newEventForm = this.formBuilder.group({
      eventDate: new FormControl(''), //needs datetime validation
      startTm: new FormControl(''),
      endTm: new FormControl(''),
      openDate: new FormControl(''),
      openTm: new FormControl(''),
      eventSlotCnt: new FormControl('10', [Validators.pattern('[0-9]*')]),
      overbookCnt: new FormControl('5', [Validators.pattern('[0-9]*')]),
      signupCnt: new FormControl('30', [Validators.pattern('[0-9]*')]),
      eventId: new FormControl(''),
      eventNote: new FormControl(''),
      privateEventInd: new FormControl('')
    });

    this.currEvents = this.formBuilder.group({});

    //We shall see if this works ok. Promise would be bad since we want new events to show
    this.dataService.getEventFuture(this.dataService.userFull.facebookId).subscribe((data: Timeslot[]) => { 
        this.events = data;
        this.events.forEach(event => {
          this.currEvents.addControl(event.id.toString(), new FormControl(event.eventClosed));
          this.currEvents.addControl('pvt' + event.id.toString(), new FormControl(event.privateEventInd));
        });
        console.log(this.currEvents);
       });

  }

  highlight(row){
    this.selectedRowIndex = row.id;
  }

  eventSubmit() {
    //builds out timeslot into eventTimeSlotSelect object, overwriting what is there.
    this.submitProcess = true;
    
    //this sets update or insert
    if (this.newEventForm.value.eventId) {
      this.eventTimeslotSelect.id = this.newEventForm.value.eventId;
    } else {
      this.eventTimeslotSelect.id === null;
    }

    //compile event_start_tms and event_end_tms from 2 fields via strings
    
    var startDt = this.datePipe.transform(this.newEventForm.value.eventDate, 'yyyy-MM-dd');
    var startTm = startDt + ' ' + this.newEventForm.value.startTm;
    var endTm = startDt + ' ' + this.newEventForm.value.endTm;

    var eventStartTms = parse(startTm, "yyyy-MM-dd h:mm aa", new Date());
    var eventEndTms = parse(endTm, "yyyy-MM-dd h:mm aa", new Date());

    this.eventTimeslotSelect.eventStartTms = eventStartTms;
    this.eventTimeslotSelect.eventEndTms = new Date(eventEndTms);

    var openDt = this.datePipe.transform(this.newEventForm.value.openDate, 'yyyy-MM-dd');
    var openTm = openDt + ' ' + this.newEventForm.value.openTm;

    var eventOpenTms = parse(openTm, "yyyy-MM-dd h:mm aa", new Date());
    this.eventTimeslotSelect.eventOpenTms = new Date(eventOpenTms);

    this.eventTimeslotSelect.eventSlotCnt = parseInt(this.newEventForm.value.eventSlotCnt);
    this.eventTimeslotSelect.overbookCnt = parseInt(this.newEventForm.value.overbookCnt);
    this.eventTimeslotSelect.signupCnt = parseInt(this.newEventForm.value.signupCnt);
    this.eventTimeslotSelect.eventNote = this.newEventForm.value.eventNote;
    this.eventTimeslotSelect.privateEventInd = this.newEventForm.value.privateEventInd;

    //close ind should already be in eventTimeslotSelect. if null, set to false.

    if (!this.eventTimeslotSelect.eventClosed) {
      this.eventTimeslotSelect.eventClosed = false;
    }

    //inject facebook ID for auth

    this.eventTimeslotSelect.facebookId = this.dataService.userFull.facebookId;

    //console.log(this.eventTimeslotSelect);

    //final checks. This is in case of form hacking.
    if (!this.eventTimeslotSelect.eventStartTms) {
      this.submitResult = "There is not a valid start time selected. Please correct this issue.";
      this.submitProcess = false;
    } else if (!this.eventTimeslotSelect.eventEndTms) {
      this.submitResult = "There is not a valid end time selected. Please correct this issue.";
      this.submitProcess = false;
    } else if (!this.eventTimeslotSelect.eventOpenTms) {
      this.submitResult = "There is not a valid open time selected. Please correct this issue.";
      this.submitProcess = false;
    } else {
      //all is good, lets fire the web service
      this.dataService.updateEvent(this.eventTimeslotSelect).subscribe((data => {
          this.submitResult = data;
          this.submitProcess = false;
      }));
    }
  }

  async changeEventState(event: any) {
      //parse out event
      var openInd = event.source.checked;
      var id = event.source.id;
  
      var rtnTxt = await this.dataService.changeEventState(id, this.dataService.userFull.facebookId);
      //we don't care about this value right now but may snackbar it    
  }

  async changePrivateState(event: any) {
    //parse out event

    var privateId = event.source.id;
    privateId = privateId.substring(3);
    //console.log(signupId);
    var id: number = parseInt(privateId);
    var openInd = event.source.checked;

    var rtnTxt = await this.dataService.changePrivateState(id, this.dataService.userFull.facebookId);
    //we don't care about this value right now but may snackbar it    
}

  manageEvent(eventId: number) {
    //takes current event and loads to form

    const selEvent = this.events.find(event => event.id == eventId);
    this.selectEventId = eventId;
    this.newEventForm.setValue({
      eventDate: selEvent.eventStartTms,
      startTm: (format(new Date(selEvent.eventStartTms), 'h:mm a')),
      endTm: (format(new Date(selEvent.eventEndTms), 'h:mm a')),
      openDate: selEvent.eventOpenTms,
      openTm: (format(new Date(selEvent.eventOpenTms), 'h:mm a')),
      eventSlotCnt: selEvent.eventSlotCnt,
      overbookCnt: selEvent.overbookCnt,
      signupCnt: selEvent.signupCnt,
      eventId: selEvent.id,
      eventNote: selEvent.eventNote,
      privateEventInd: selEvent.privateEventInd
    })
  }

  submitEventChange(): string {
    //validates event change and update
    //need to rewrite api to support update

    return "Help";
  }

  ngOnDestroy(): void{

  }

}
