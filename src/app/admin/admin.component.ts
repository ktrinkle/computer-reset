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
    { label: 'Users with slots', path: 'userlist'},
    { label: 'Future events', path: 'future' },
    { label: 'Schedule Events', path: 'event'},
    { label: 'User Management', path: 'user' },
  ];

  constructor( public router: Router) { }

  ngOnInit(): void {
    this.router.navigate(['/admin/today']);
  }

}
