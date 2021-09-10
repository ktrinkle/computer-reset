import { Component, OnInit } from '@angular/core';
import { DataService } from '../../data.service';
import { AlertComponent } from '../../admin/adminfuture/adminfuture.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatCard } from '@angular/material/card';

@Component({
  selector: 'app-delete',
  templateUrl: './delete.component.html',
  styleUrls: ['./delete.component.scss']
})
export class DeleteComponent implements OnInit {

  constructor(private dataService: DataService,
    private _snackBar: MatSnackBar) {}

  ngOnInit(): void {
  }

  async requestDelete() {
    //parse out event
    var id = this.dataService.userFull.facebookId;

    var rtnTxt = await this.dataService.requestUserDelete(id);
    this.openSnackBar(rtnTxt);
  }

  openSnackBar(displayText: string) {
    this._snackBar.openFromComponent(AlertComponent, {
      duration: 5000,
      data: displayText
    });
  }

}
