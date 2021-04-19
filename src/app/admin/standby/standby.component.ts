import { Component, OnInit, OnDestroy } from '@angular/core';
import { DataService } from '../../data.service';
import { Timeslot, UserEventNote, Slot, Standby, standbyList } from '../../data';
import { FormGroup, FormControl, FormBuilder } from '@angular/forms';
import { MatSnackBar, MAT_SNACK_BAR_DATA } from '@angular/material/snack-bar';
import { Subject } from 'rxjs';
import { AlertComponent } from '../adminfuture/adminfuture.component';

@Component({
  selector: 'app-standby',
  templateUrl: './standby.component.html',
  styleUrls: ['./standby.component.scss']
})
export class StandbyComponent implements OnInit, OnDestroy {

  public eventId = 0;
  public signupForm: FormGroup;
  public eventTimeslotSelect: Timeslot;
  public slot: Slot[];
  public standbyList: standbyList;
  public standbyDetail: Standby[];
  public signupLimit: number = 0;
  public selectedRowIndex = -1;
  public loadStatus = false;

  constructor(private dataService: DataService,
    private formBuilder: FormBuilder,
    private _snackBar: MatSnackBar) { }

    private readonly onDestroy = new Subject<void>();

  ngOnInit() {
    this.loadStatus = false;
    this.loadStandby();
  }

  loadStandby() {
    this.signupForm = this.formBuilder.group({});
    this.dataService.getStandbyMaster()
      .subscribe({next: (data: any) => {
        this.standbyList = data;
        this.slot = data.slot;
        this.standbyDetail = data.standbys;
        this.standbyDetail.forEach(event => {
          this.signupForm.addControl('signupTxt' + event.id.toString(), new FormControl(event.signupTxt));
        });
      },
      error: (err) => {
        this.dataService.handleError(err);
      },
      complete: () => {
        this.loadStatus = true;
      }
    });
  }

  updateSignupTxt(event: any) {
    //parse out event
    var signupId = event.target.id;
    signupId = signupId.substring(9);
    //console.log(signupId);
    var id: number = parseInt(signupId);
    var val = event.target.value; //this is the string

    const userNote:UserEventNote = {
      id: id,
      signupTxt: val,
      fbId: this.dataService.userFull.facebookId
    };

    var rtn = this.dataService.updateUserNote(userNote).then(data => {
      this.openSnackBar(data);
      Object.assign(this, data.toString())
    });
  }

  //moveUserSlot
  async assignUser(event: any) {
    //parse out event
    var newEvent = event.value;
    var id = event.source.id;

    this.openSnackBar(await this.dataService.moveUserSlot(id, newEvent, this.dataService.userFull.facebookId));

    this.loadStandby();
  }

  highlight(row){
    this.selectedRowIndex = row.id;
  }

  openSnackBar(displayText: string) {
    this._snackBar.openFromComponent(AlertComponent, {
      duration: 5000,
      data: displayText
    });
  }

  ngOnDestroy() {
    this.onDestroy.next();
  }

}
