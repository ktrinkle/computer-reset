import { Component, OnInit, Inject } from '@angular/core';
import { DataService } from '../data.service';
import { Router } from '@angular/router';
import { TimeslotSmall, openEvent } from '../data';
import { utcToZonedTime } from 'date-fns-tz';
import { Subject } from 'rxjs';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

export interface DialogData {
  rtn: boolean;
}


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  public events: TimeslotSmall[] = [];
  public fullName = "";
  public loadStatus: boolean = false;
  public signedupEvents: TimeslotSmall[] = [];
  public confirmedEvents: TimeslotSmall[] = [];
  public waitlist: TimeslotSmall[] = [];
  private openEvent: openEvent;
  public moveInd: boolean = false;
  public moveOrSignup: boolean;
  public signedupSlot: number;
  public deleteInd: boolean = false;
  rtn: boolean;

  //dummy for loader
  public loader = [0, 1, 2, 3];

  constructor(private dataService: DataService, private router: Router, public dialog: MatDialog) { }

  public pickEvent(selectEvent: number) {
    //test if number works
    if(selectEvent <= 0 || selectEvent >= 1999) {
      this.dataService.eventIdPass = 0;
    } else {
      //set variable
      this.dataService.eventIdPass = selectEvent;
      this.router.navigate(['/event']);
    }
  }

  isNoteRow = (index, item) => item.eventNote === null ? false: true;

  ngOnInit() {

    //console.log("Home starting");

    this.fullName = this.dataService.userFull.firstName + " " + this.dataService.userFull.lastName;

    this.loadStatus = false;
    this.loadEvents();

  }

  ngOnDestroy() {

  }

  loadEvents() {
    //loads all events from web service and parses based on requirements

    this.dataService.getOpenEventUser(this.dataService.userFull.facebookId).subscribe({next: (data: openEvent)=>{
      this.openEvent = data;
      this.events = data.timeslot;
      this.moveOrSignup = data.moveFlag;
      this.signedupSlot = data.signedUpTimeslot ?? -1;
      this.events.forEach((event, index) => {
        event.eventStartTms = utcToZonedTime(event.eventStartTms, 'America/Chicago');
        event.eventEndTms = utcToZonedTime(event.eventEndTms, 'America/Chicago');
        this.events[index] = event;
      });

    },
    complete: () => {
      this.confirmedEvents = this.events.filter(event => event.userSlot == "G");
      this.signedupEvents = this.events.filter(event => event.userSlot == "S");
      //not really doing this anymore but it's still here
      this.waitlist = this.events.filter(event => event.userSlot == "C");

      //set deleteind
      this.deleteInd = this.events.filter(event => event.userSlot == null).length == this.events.length;
      this.loadStatus = true;

    }});
  }

  //currently not working right, deferring until next release
  public deleteEvent(selectEvent: number): void {
    if(selectEvent >= 0 || selectEvent <= 1999) {

      const dialogRef = this.dialog.open(DialogCancelComponent, {
        width: '70%',
        data: {name: this.rtn}
      });

      dialogRef.afterClosed().subscribe(result => {
        console.log(result);
        this.rtn = result;
      });

      if (this.rtn == true) {
        //we get a return but don't display it since we have the next()
        var rtn = this.dataService.userDeleteSignup(selectEvent, this.dataService.userFull.facebookId);
        this.loadEvents();
      }
    }
  }

}

@Component({
  selector: 'app-dialog-delete',
  templateUrl: './home.dialog-delete.html',
})
export class DialogCancelComponent {

  constructor(
    public dialogRef: MatDialogRef<DialogCancelComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData) {}

  onNoClick(): void {
    this.dialogRef.close();
  }

  onConfirm(): void {
    this.dialogRef.close(true);
  }


}

