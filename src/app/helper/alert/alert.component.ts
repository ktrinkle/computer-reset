import { Component, Inject, Optional } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-alert',
  templateUrl: './alert.component.html',
  styleUrls: ['./alert.component.scss']
})
export class AppAlertComponent {

  public alertTitle: string;
  public alertText: string;
  public alertNoAction: string;
  public alertAction: string;

  constructor(
    private dialogRef: MatDialogRef<AppAlertComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any
    ) {
      this.alertTitle = data.alertTitle ?? null;
      this.alertText = data.alertText; // required
      this.alertNoAction = data.alertNoAction ?? null;
      this.alertAction = data.alertAction; //required
    }

  onNoClick(): void {
    console.log('false');
    this.dialogRef.close(false);
  }

  onConfirm(): void {
    this.dialogRef.close(true);
  }

}
