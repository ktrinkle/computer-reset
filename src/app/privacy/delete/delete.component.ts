import { Component, OnInit } from '@angular/core';
import { DataService } from '../../data.service';
import { AlertComponent } from '../../admin/adminfuture/adminfuture.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatCard } from '@angular/material/card';
import { Router } from '@angular/router';

@Component({
  selector: 'app-delete',
  templateUrl: './delete.component.html',
  styleUrls: ['./delete.component.scss']
})
export class DeleteComponent implements OnInit {

  constructor(private dataService: DataService,
    private _snackBar: MatSnackBar,
    public router: Router) {}

  ngOnInit(): void {
  }

  async requestDelete() {
    // parse out event
    var id = this.dataService.userFull.facebookId;

    var rtnTxt = await this.dataService.requestUserDelete(id);
    this.openSnackBar(rtnTxt);

    await new Promise(res => setTimeout(res, 5000));
    // force logout
    this.router.navigate(["/home"]);

  }

  openSnackBar(displayText: string) {
    this._snackBar.openFromComponent(AlertComponent, {
      duration: 5000,
      data: displayText
    });
  }

}
