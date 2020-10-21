import { Component, OnInit } from '@angular/core';
import { DataService } from '../data.service';
import { Router } from '@angular/router';
import { TimeslotSmall } from '../data';
import { map } from 'rxjs/operators';
import { utcToZonedTime } from 'date-fns-tz';

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

  constructor(private dataService: DataService, private router: Router) { }

  public pickEvent(selectEvent: number) {
    //test if number works
    if(selectEvent <= 0 || selectEvent >= 365) {
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

    this.dataService.getEvent(this.dataService.userFull.facebookId).subscribe({next: (data: TimeslotSmall[])=>{
      this.events = data;    
      this.events.forEach((event, index) => {
        event.eventStartTms = utcToZonedTime(event.eventStartTms, 'America/Chicago');
        event.eventEndTms = utcToZonedTime(event.eventEndTms, 'America/Chicago');
        this.events[index] = event; 
      })
    },
    complete: () => {
      this.confirmedEvents = this.events.filter(event => event.userSlot == "G");
      this.signedupEvents = this.events.filter(event => event.userSlot == "S");
      this.waitlist = this.events.filter(event => event.userSlot == "C");
      this.loadStatus = true;}});

  }

}