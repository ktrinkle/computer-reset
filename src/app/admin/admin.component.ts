import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnInit {

  public links = [
    { label: "Today's Event", path: 'today' },
    { label: 'Confirm attendees', path: 'userlist'},
    { label: 'Select attendees', path: 'future' },
    { label: 'Process standbys', path: 'standby'},
    { label: 'Schedule Events', path: 'event'},
    { label: 'User Management', path: 'user' },
    { label: 'Past Events', path: 'past'},
  ];

  constructor( public router: Router) { }

  ngOnInit(): void {
    this.router.navigate(['/admin/today']);
  }

}
