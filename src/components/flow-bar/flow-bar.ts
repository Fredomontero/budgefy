import { Component } from '@angular/core';

@Component({
  selector: 'flow-bar',
  templateUrl: 'flow-bar.html'
})
export class FlowBarComponent {

  text: string;

  constructor() {
    console.log('Hello FlowBarComponent Component');
    this.text = 'Hello World';
  }

}
