import { Component, Directive, ViewContainerRef, OnInit } from '@angular/core';
import { dumpster } from 'src/app/data';
import { DataService } from '../../data.service';

@Component({
  selector: 'app-rules',
  templateUrl: './rules.component.html',
  styleUrls: ['./rules.component.scss']
})

//@Directive({
//  selector: '[rules]',
//})
export class RulesComponent {

  dumpsterCount: number;
  dumpsterVolume: number;

  constructor(public viewContainerRef: ViewContainerRef, private dataService: DataService) { }

  ngOnInit(): void {
    this.dataService.getDumpster().subscribe(data => {
      this.dumpsterCount = data.dumpsterCount;
      this.dumpsterVolume = data.dumpsterVolume;
    });
  }

}
