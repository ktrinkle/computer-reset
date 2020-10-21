import { Component, OnInit, OnDestroy, Inject } from '@angular/core';
import { DataService } from '../../data.service';
import { Timeslot, UserEventSignup, UserEventNote, Slot, Standby, standbyList } from '../../data';
import { FormGroup, FormControl, Validators, FormBuilder, ReactiveFormsModule, FormArray } from '@angular/forms';
import { MatSnackBar, MAT_SNACK_BAR_DATA } from '@angular/material/snack-bar';
import { Subject, BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-standby',
  templateUrl: './standby.component.html',
  styleUrls: ['./standby.component.scss']
})
export class StandbyComponent implements OnInit, OnDestroy {

  public eventId = 0;
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
    this.dataService.getStandbyMaster(this.dataService.userFull.facebookId)
      .subscribe({next: (data: any) => { 
        this.standbyList = data; 
      },
      complete: () => {
        console.log(this.standbyList);
        this.loadStatus = true;
      }
    });

  }

  ngOnDestroy() { 
    this.onDestroy.next();
  }

}
