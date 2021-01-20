import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-load-event',
  templateUrl: './load-event.component.html',
  styleUrls: ['./load-event.component.scss']
})
export class LoadEventComponent implements OnInit {

  //dummy for load screen
  public loader = [0, 1, 2, 3];

  constructor() { }

  ngOnInit(): void {
  }

}
