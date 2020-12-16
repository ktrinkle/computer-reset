import { Component, Directive, ViewContainerRef } from '@angular/core';

@Component({
  selector: 'app-rules',
  templateUrl: './rules.component.html',
  styleUrls: ['./rules.component.scss']
})

//@Directive({
//  selector: '[rules]',
//})
export class RulesComponent {

  constructor(public viewContainerRef: ViewContainerRef) { }

}
