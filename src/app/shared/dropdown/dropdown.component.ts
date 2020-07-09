import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-dropdown',
  templateUrl: './dropdown.component.html',
  styleUrls: ['./dropdown.component.scss']
})
export class DropdownComponent implements OnInit {
  @Input('button-text') buttonText: string;
  @Input('value') value: number | string = undefined;
  @Output('get-input') input: EventEmitter<any> = new EventEmitter();

  context: string;
  showLess: boolean = false;
  showGreater: boolean = false;
  showRange: boolean = false;

  constructor() { }

  ngOnInit(): void {
    if (this.buttonText) {
      this.context = this.buttonText.split(' ')[1];
      if (this.buttonText.includes('less')) {
        this.less();
      }
      if (this.buttonText.includes('great')) {
        this.greater();
      }
      if (this.buttonText.includes('range')) {
        this.range();
      }
    }
  }

  less() {
    this.showLess = true;
    this.showGreater = false;
    this.showRange = false;
    this.buttonText = 'less than';
  }

  greater() {
    this.showLess = false;
    this.showGreater = true;
    this.showRange = false;
    this.buttonText = 'greater than';
  }

  range() {
    this.showLess = false;
    this.showGreater = false;
    this.showRange = true;
    this.buttonText = 'within range of';
  }
}
