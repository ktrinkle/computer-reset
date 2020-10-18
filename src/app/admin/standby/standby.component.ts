import { Component, OnInit, OnDestroy, Inject } from '@angular/core';
import { DataService } from '../../data.service';
import { Timeslot, UserEventSignup, UserEventNote } from '../../data';
import { FormGroup, FormControl, Validators, FormBuilder, ReactiveFormsModule, FormArray } from '@angular/forms';
import { MatSnackBar, MAT_SNACK_BAR_DATA } from '@angular/material/snack-bar';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-standby',
  templateUrl: './standby.component.html',
  styleUrls: ['./standby.component.scss']
})
export class StandbyComponent implements OnInit, OnDestroy {

  public eventList = [];
  public eventId = 0;
  public eventTimeslotSelect: Timeslot;
  public eventSignedUp: UserEventSignup[];
  public maxEvents: number;
  public signupLimit: number = 0;
  public selectedRowIndex = -1;
  public loadStatus = false;

  constructor(private dataService: DataService, 
    private formBuilder: FormBuilder,
    private _snackBar: MatSnackBar) { }

    private readonly onDestroy = new Subject<void>();

  ngOnInit() {

    this.dataService.getStandbyMaster(this.dataService.userFull.facebookId)
      .subscribe((data: any) => { this.eventList = data });

  }

  ngOnDestroy() { 
    this.onDestroy.next();
  }

}
