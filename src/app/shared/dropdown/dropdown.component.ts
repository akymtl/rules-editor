import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Options, IOptions } from '../model/options.model';

@Component({
  selector: 'app-dropdown',
  templateUrl: './dropdown.component.html',
  styleUrls: ['./dropdown.component.scss']
})
export class DropdownComponent implements OnInit {
  @Input('button-text') buttonText: string;
  @Input('value') value: number | string = undefined;
  @Input('context') context: string;

  @Output('get-input') input: EventEmitter<any> = new EventEmitter();

  show: IOptions = {};
  options = Options;

  constructor() {
    Object.keys(this.options).forEach(key => {
      this.show[key] = false;
    });
  }

  ngOnInit(): void {
    if (!this.buttonText.toLowerCase().includes('select')) {
      this.optionChange(this.buttonText);
    }
  }

  optionChange(buttonText: string) {
    Object.keys(this.show).forEach(key => {
      if (buttonText.includes(key)) {
        this.show[key] = true;
      } else {
        this.show[key] = false;
      }
    });
    this.buttonText = buttonText;
  }
}
