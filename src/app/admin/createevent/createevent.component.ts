import { Component, OnDestroy, OnInit } from '@angular/core';
import { DataService } from '../../data.service';
import { Timeslot } from '../../data';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { Subject } from 'rxjs';
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
  hours24 = Array(24).fill(0).map((e, i) => this.pad(i));
  minutes60 = Array(60).fill(0).map((e, i) => this.pad(i));
  private readonly onDestroy = new Subject<void>();
  public startHourVal: string;
  public startMinuteVal: string;
  public endHourVal: string;
  public endMinuteVal: string;
  public openHourVal: string;
  public openMinuteVal: string;

  destroy$: Subject<void> = new Subject<void>();

  constructor(private dataService: DataService,
    private formBuilder: FormBuilder,
    private datePipe: DatePipe) { }

  ngOnInit(): void {

    this.newEventForm = new FormGroup({
      eventDate: new FormControl(''), //needs datetime validation
      hour_startTm: new FormControl('', [Validators.pattern('[0-9]*')]),
      minute_startTm: new FormControl('',[Validators.pattern('[0-9]*')]),
      hour_endTm: new FormControl('',[Validators.pattern('[0-9]*')]),
      minute_endTm: new FormControl('',[Validators.pattern('[0-9]*')]),
      openDate: new FormControl(''),
      hour_openTm: new FormControl('', [Validators.pattern('[0-9]*')]),
      minute_openTm: new FormControl('', [Validators.pattern('[0-9]*')]),
      eventSlotCnt: new FormControl('10', [Validators.pattern('[0-9]*')]),
      overbookCnt: new FormControl('5', [Validators.pattern('[0-9]*')]),
      signupCnt: new FormControl('20', [Validators.pattern('[0-9]*')]),
      eventId: new FormControl(''),
      eventNote: new FormControl(''),
      privateEventInd: new FormControl(''),
      intlEventInd: new FormControl('')
    });

    this.loadStatus = false;
    this.loadEvents();

  }

  loadEvents() {
    this.currEvents = this.formBuilder.group({});

    //We shall see if this works ok. Promise would be bad since we want new events to show
    this.dataService.getEventFuture().subscribe({next: (data: Timeslot[]) => {
        this.events = data;
        this.events.forEach(event => {
          this.currEvents.addControl(event.id.toString(), new FormControl(event.eventClosed));
          this.currEvents.addControl('pvt' + event.id.toString(), new FormControl(event.privateEventInd));
          this.currEvents.addControl('intl' + event.id.toString(), new FormControl(event.intlEventInd));
        });
        // console.log(this.currEvents);
       },
       error: (err) => {
         this.dataService.handleError(err);
       }
      });
  }

  highlight(row){
    this.selectedRowIndex = row.id;
  }

  eventSubmit() {
    // builds out timeslot into eventTimeSlotSelect object, overwriting what is there.
    this.submitProcess = true;

    // this sets update or insert
    if (this.newEventForm.value.eventId) {
      this.eventTimeslotSelect.id = this.newEventForm.value.eventId;
    } else {
      this.eventTimeslotSelect.id === null;
    }

    // compile event_start_tms and event_end_tms from 2 fields via strings
    // this is being transmitted as UTC without timezone, so we need to inject timezone

    // console.log(this.newEventForm.value);
    var startDt = this.datePipe.transform(this.newEventForm.value.eventDate, 'yyyy-MM-dd');
    var startTm = startDt + ' ' + this.newEventForm.value.hour_startTm + ':' + this.newEventForm.value.minute_startTm;
    var endTm = startDt + ' ' + this.newEventForm.value.hour_endTm + ':' + this.newEventForm.value.minute_endTm;
    // console.log(startTm);
    // console.log(endTm);

    var eventStartTms = parse(startTm, "yyyy-MM-dd HH:mm", new Date());
    // console.log(eventStartTms);
    var eventEndTms = parse(endTm, "yyyy-MM-dd HH:mm", new Date());
    // console.log(eventEndTms);

    this.eventTimeslotSelect.eventStartTms = new Date(eventStartTms);
    this.eventTimeslotSelect.eventEndTms = new Date(eventEndTms);

    var openDt = this.datePipe.transform(this.newEventForm.value.openDate, 'yyyy-MM-dd');
    var openTm = openDt + ' ' + this.newEventForm.value.hour_openTm + ':' + this.newEventForm.value.minute_openTm;

    var eventOpenTms = parse(openTm, "yyyy-MM-dd HH:mm", new Date());  // yyyy-MM-dd
    this.eventTimeslotSelect.eventOpenTms = new Date(eventOpenTms);
    // console.log(eventOpenTms);

    this.eventTimeslotSelect.eventSlotCnt = parseInt(this.newEventForm.value.eventSlotCnt);
    this.eventTimeslotSelect.overbookCnt = parseInt(this.newEventForm.value.overbookCnt);
    this.eventTimeslotSelect.signupCnt = parseInt(this.newEventForm.value.signupCnt);
    this.eventTimeslotSelect.eventNote = this.newEventForm.value.eventNote;

    if (!this.newEventForm.value.privateEventInd) {
      this.eventTimeslotSelect.privateEventInd = false;
    } else {
      this.eventTimeslotSelect.privateEventInd = true;
    }

    if (!this.newEventForm.value.intlEventInd) {
      this.eventTimeslotSelect.intlEventInd = false;
    } else {
      this.eventTimeslotSelect.intlEventInd = true;
    }

    // close ind should already be in eventTimeslotSelect. if null, set to false.

    if (!this.eventTimeslotSelect.eventClosed) {
      this.eventTimeslotSelect.eventClosed = false;
    }

    // inject facebook ID for auth

    this.eventTimeslotSelect.facebookId = this.dataService.userFull.facebookId;

    // console.log(this.eventTimeslotSelect);

    // final checks. This is in case of form hacking.
    if (!this.eventTimeslotSelect.eventStartTms || this.eventTimeslotSelect.eventStartTms == null) {
      this.submitResult = "There is not a valid start time selected. Please correct this issue.";
      this.submitProcess = false;
    } else if (!this.eventTimeslotSelect.eventEndTms || this.eventTimeslotSelect.eventEndTms == null) {
      this.submitResult = "There is not a valid end time selected. Please correct this issue.";
      this.submitProcess = false;
    } else if (!this.eventTimeslotSelect.eventOpenTms || this.eventTimeslotSelect.eventOpenTms == null) {
      this.submitResult = "There is not a valid open time selected. Please correct this issue.";
      this.submitProcess = false;
    } else {
      // all is good, lets fire the web service
      this.dataService.updateEvent(this.eventTimeslotSelect).subscribe({next: (data => {
          this.submitResult = data;
          this.submitProcess = false;
      }),
      error: (err) => {
        this.dataService.handleError(err);
        this.submitProcess = false;
      },
      complete: () => {
        this.loadEvents();
      }
      });
    }
  }

  resetProcess() {
    this.submitProcess = false;
  }

  async changeEventState(event: any) {
      //parse out event
      var openInd = event.source.checked;
      var id = event.source.id;

      var rtnTxt = await this.dataService.changeEventState(id);
      //we don't care about this value right now but may snackbar it
  }

  async changePrivateState(event: any) {
    //parse out event

    var privateId = event.source.id;
    privateId = privateId.substring(3);
    //console.log(signupId);
    var id: number = parseInt(privateId);
    var openInd = event.source.checked;

    var rtnTxt = await this.dataService.changePrivateState(id);
    //we don't care about this value right now but may snackbar it
  }

  async changeIntlState(event: any) {
    //parse out event
    var intlId = event.source.id;
    intlId = intlId.substring(4);
    //console.log(signupId);
    var id: number = parseInt(intlId);

    var rtnTxt = await this.dataService.changeIntlState(id);
    //we don't care about this value right now but may snackbar it
}

  manageEvent(eventId: number) {
    //takes current event and loads to form

    const selEvent = this.events.find(event => event.id == eventId);
    this.selectEventId = eventId;
    this.newEventForm.setValue({
      eventDate: selEvent.eventStartTms,
      hour_startTm: (format(new Date(selEvent.eventStartTms), 'HH')),
      minute_startTm: (format(new Date(selEvent.eventStartTms), 'mm')),
      hour_endTm: (format(new Date(selEvent.eventEndTms), 'HH')),
      minute_endTm: (format(new Date(selEvent.eventEndTms), 'mm')),
      openDate: selEvent.eventOpenTms,
      hour_openTm: (format(new Date(selEvent.eventOpenTms), 'HH')),
      minute_openTm: (format(new Date(selEvent.eventOpenTms), 'mm')),
      eventSlotCnt: selEvent.eventSlotCnt,
      overbookCnt: selEvent.overbookCnt,
      signupCnt: selEvent.signupCnt,
      eventId: selEvent.id,
      eventNote: selEvent.eventNote,
      privateEventInd: selEvent.privateEventInd,
      intlEventInd: selEvent.intlEventInd
    })
  }

  // these are designed for no more than 1 hour of change. Fine for now but not optimal.
  modifyStartHour(hours: number) {
    let temp_hours: number = 0;
    if (this.startHourVal && /^\d+$/.test(this.startHourVal)) {
      temp_hours = Number.parseInt(this.newEventForm.value.hour_startTm, 10).valueOf();
      temp_hours += hours;
      temp_hours = temp_hours < 0 ? 23 : temp_hours;
      temp_hours = temp_hours > 23 ? 0 : temp_hours;
    }
  this.newEventForm.patchValue({hour_startTm: temp_hours.toString()});
  // this will trigger change detection and keep our val below up to date
  }

  modifyEndHour(hours: number) {
    let temp_hours: number = 0;
    if (this.endHourVal && /^\d+$/.test(this.endHourVal)) {
      temp_hours = Number.parseInt(this.newEventForm.value.hour_endTm, 10).valueOf();
      temp_hours += hours;
      temp_hours = temp_hours < 0 ? 23 : temp_hours;
      temp_hours = temp_hours > 23 ? 0 : temp_hours;
    }
  this.newEventForm.patchValue({hour_endTm: temp_hours.toString()});
  // this will trigger change detection and keep our val below up to date
  }

  modifyOpenHour(hours: number) {
    let temp_hours: number = 0;
    if (this.openHourVal && /^\d+$/.test(this.openHourVal)) {
      temp_hours = Number.parseInt(this.newEventForm.value.hour_openTm, 10).valueOf();
      temp_hours += hours;
      temp_hours = temp_hours < 0 ? 23 : temp_hours;
      temp_hours = temp_hours > 23 ? 0 : temp_hours;
    }
  this.newEventForm.patchValue({hour_openTm: temp_hours.toString()});
  // this will trigger change detection and keep our val below up to date
  }

  // these are designed for no more than 60 mins of change. Fine for now but not optimal.
  modifyStartMinute(minutes: number) {
    let temp_minutes: number = 0;
    if (this.startMinuteVal && /^\d+$/.test(this.startMinuteVal)) {
      temp_minutes = Number.parseInt(this.startMinuteVal, 10).valueOf();
      temp_minutes += minutes;
      if (temp_minutes < 0) {
        this.modifyStartHour(-1);
        temp_minutes = 59;
      } else if (temp_minutes > 59) {
        this.modifyStartHour(1);
        temp_minutes = 0;
      }
    }
    this.newEventForm.patchValue({minute_startTm: this.pad(temp_minutes.toString())});

  }

  modifyEndMinute(minutes: number) {
    let temp_minutes: number = 0;
    if (this.endMinuteVal && /^\d+$/.test(this.endMinuteVal)) {
      temp_minutes = Number.parseInt(this.endMinuteVal, 10).valueOf();
      temp_minutes += minutes;
      if (temp_minutes < 0) {
        this.modifyEndHour(-1);
        temp_minutes = 59;
      } else if (temp_minutes > 59) {
        this.modifyEndHour(1);
        temp_minutes = 0;
      }
    }
    this.newEventForm.patchValue({minute_endTm: this.pad(temp_minutes.toString())});

  }

  modifyOpenMinute(minutes: number) {
    let temp_minutes: number = 0;
    if (this.openMinuteVal && /^\d+$/.test(this.openMinuteVal)) {
      temp_minutes = Number.parseInt(this.openMinuteVal, 10).valueOf();
      temp_minutes += minutes;
      if (temp_minutes < 0) {
        this.modifyOpenHour(-1);
        temp_minutes = 59;
      } else if (temp_minutes > 59) {
        this.modifyOpenHour(1);
        temp_minutes = 0;
      }
    }
    this.newEventForm.patchValue({minute_openTm: this.pad(temp_minutes.toString())});

  }

  async changeStartTimeHour(event: any) {
    var newHour = event.value;
    // console.log(newHour);

    if (newHour && this.startHourVal && (/^\d+$/.test(newHour))) {
        this.startHourVal = this.pad(newHour);
    } else {
        this.startHourVal = '';
    }
  }

  async changeEndTimeHour(event: any) {
    var newHour = event.value;
    // console.log(newHour);

    if (newHour && this.endHourVal && (/^\d+$/.test(newHour))) {
        this.endHourVal = this.pad(newHour);
    } else {
        this.endHourVal = '';
    }
  }

  async changeOpenTimeHour(event: any) {
    var newHour = event.value;
    // console.log(newHour);

    if (newHour && this.openHourVal && (/^\d+$/.test(newHour))) {
        this.openHourVal = this.pad(newHour);
    } else {
        this.openHourVal = '';
    }
  }

  async changeStartTimeMinute(event: any) {
    var newMinute = event.value;

    if (newMinute && this.startMinuteVal && (/^\d+$/.test(newMinute))) {
        this.startMinuteVal = this.pad(newMinute);
    } else {
        this.startMinuteVal = '';
    }
  }

  async changeEndTimeMinute(event: any) {
    var newMinute = event.value;

    if (newMinute && this.endMinuteVal && (/^\d+$/.test(newMinute))) {
        this.endMinuteVal = this.pad(newMinute);
    } else {
        this.endMinuteVal = '';
    }
  }

  async changeOpenTimeMinute(event: any) {
    var newMinute = event.value;

    if (newMinute && this.openMinuteVal && (/^\d+$/.test(newMinute))) {
        this.openMinuteVal = this.pad(newMinute);
    } else {
        this.openMinuteVal = '';
    }
  }

  clearForm() {
    this.newEventForm.reset();
  }


  ngOnDestroy(): void{

  }

  pad(i: number | string): string {
    return (i !== null && i < 10 && i.toLocaleString().length < 2) ? `0${i}` : `${i}`;
}

}
