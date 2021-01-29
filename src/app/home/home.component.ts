import { Component, OnInit } from '@angular/core';
import { DataService } from '../data.service';
import { Router } from '@angular/router';
import { TimeslotSmall, openEvent } from '../data';
import { utcToZonedTime } from 'date-fns-tz';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AlertComponent } from '../admin/adminfuture/adminfuture.component';

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
  testString: string;

  //dummy for loader
  public loader = [0, 1, 2, 3];

  constructor(private dataService: DataService, private router: Router,
    private readonly dialog: MatDialog,
    private _snackBar: MatSnackBar) { }

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

    this.events = null;

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

  public async deleteEvent(selectEvent: number) {
    if(selectEvent >= 0 || selectEvent <= 1999) {

      const ref = this.dialog.open(DialogCancelComponent, {
        width: '70%' //no data
      });

      ref.afterClosed().subscribe(result => {
        if (result == true) {
          this.rtn = true;
          this.dataService.userDeleteSignup(selectEvent, this.dataService.userFull.facebookId).then(data => {
            this.openSnackBar(data);
            this.loadEvents();
          });
        } else {
          this.rtn = false;
        }
      });
    }
  }

  openSnackBar(displayText: string) {
    this._snackBar.openFromComponent(AlertComponent, {
      duration: 5000,
      data: displayText
    });
  }

}

@Component({
  selector: 'app-dialog-cancel',
  templateUrl: './home.dialog-delete.html',
})
export class DialogCancelComponent {

  constructor(
    private dialogRef: MatDialogRef<DialogCancelComponent>) {}

  onNoClick(): void {
    console.log('false');
    this.dialogRef.close(false);
  }

  onConfirm(): void {
    this.dialogRef.close(true);
  }


}

