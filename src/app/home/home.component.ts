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

  public events = [];
  public fullName = "";

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

    console.log("Home starting");

    this.fullName = sessionStorage.getItem('firstName') + " " + sessionStorage.getItem('lastName');
    console.log(sessionStorage.getItem('firstName'));

    this.dataService.getEvent().subscribe((data: any[])=>{
      //console.log(data);
      this.events = data;
    });

    //sessionStorage.setItem('admin', 
    //  this.dataService.getAdmin(sessionStorage.getItem('facebookId')).pipe(first()).toString());

  }

}