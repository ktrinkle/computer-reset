import { Component, OnInit, Input } from '@angular/core';
import { DataService } from '../data.service';
import { Router } from '@angular/router';
import { Signup } from '../data';
import { AppComponent } from '../app.component';

@Component({
  selector: 'app-event',
  templateUrl: './event.component.html',
  styleUrls: ['./event.component.scss']
})
export class EventComponent implements OnInit {

  events = [];
  public signUp: Signup = {realname: "", userId: 0, cityNm: "", stateCd: "", eventId: 0};

  public agreeInd: boolean = false;

  public agreeClick(): void {
    this.agreeInd = true;
  }

  constructor(
    private dataService: DataService, 
    private router: Router, 
    private appComponent: AppComponent
    ) { }

  ngOnInit(): void {

      //get routed event id if needed
      this.signUp.eventId = this.dataService.eventIdPass;
      this.dataService.eventIdPass = 0;

      this.dataService.getEvent().subscribe((data: any[])=>{
        console.log(data);
        this.events = data;
      }) 

      this.signUp.realname = this.appComponent.userInfo.realName;
      this.signUp.userId = this.appComponent.userInfo.id;
      this.signUp.cityNm = this.appComponent.userInfo.cityName;
      this.signUp.stateCd = this.appComponent.userInfo.stateCode;

  }

}
