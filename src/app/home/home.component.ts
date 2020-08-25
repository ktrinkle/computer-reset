import { Component, OnInit } from '@angular/core';
import { DataService } from '../data.service';
import { Router } from '@angular/router';
import { first } from 'rxjs/operators';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  events = [];

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

  ngOnInit() {

    this.dataService.getEvent().subscribe((data: any[])=>{
      //console.log(data);
      this.events = data;
    });

    localStorage.setItem('admin', 
      this.dataService.getAdmin(localStorage.getItem('facebookId')).pipe(first()).toString());

  }

}