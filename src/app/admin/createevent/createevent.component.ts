import { Component, OnDestroy, OnInit } from '@angular/core';
import { DataService } from '../../data.service';
import { Timeslot } from '../../data';
import { FormGroup, FormControl, Validators, FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { MediaObserver } from '@angular/flex-layout';
import { MatCalendar } from '@angular/material/datepicker';
import { DateAdapter, MAT_DATE_FORMATS, MatDateFormats } from '@angular/material/core';

@Component({
  selector: 'app-createevent',
  templateUrl: './createevent.component.html',
  styleUrls: ['./createevent.component.scss']
})
export class CreateeventComponent implements OnInit, OnDestroy {

  public events: Timeslot[] = [];
  public eventId = 0;
  public eventTimeslotSelect: Timeslot;
  public newEventForm: FormGroup;
  public currEvents: FormGroup;
  public signupLimit: number = 0;
  public selectedRowIndex = -1;
  public loadStatus = false;
  private readonly onDestroy = new Subject<void>();


  constructor(private dataService: DataService, 
    private formBuilder: FormBuilder) { }

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
      eventId: new FormControl('')
    });

    this.currEvents = this.formBuilder.group({});

    //We shall see if this works ok. Promise would be bad since we want new events to show
    this.dataService.getEventFuture(this.dataService.userFull.facebookId)
      .subscribe((data: Timeslot[]) => { 
        (event: Timeslot) => {
          this.currEvents.addControl(event.id.toString(), new FormControl(event.eventClosed));
        }
        this.events = data;
        console.log(this.currEvents);
       });


  }

  highlight(row){
    this.selectedRowIndex = row.id;
  }

  async changeEventState(event: any) {
      //parse out event
      var openInd = event.source.checked;
      var id = event.source.id;
  
      var rtnTxt = await this.dataService.changeEventState(id, this.dataService.userFull.facebookId);
      //we don't care about this value right now but may snackbar it    
  }

  manageEvent(eventId: number) {
    //takes current event and loads to form

    console.log(this.events);
    console.log(eventId);
    const selEvent = this.events.find(event => event.id == eventId);
    console.log(selEvent);
    this.newEventForm.setValue({
      eventDate: selEvent.eventStartTms,
      startTm: selEvent.eventStartTms,
      endTm: selEvent.eventEndTms,
      openDate: selEvent.eventOpenTms,
      openTm: selEvent.eventOpenTms,
      eventSlotCnt: selEvent.eventSlotCnt,
      overbookCnt: selEvent.overbookCnt,
      eventId: selEvent.id
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
