import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit {
  ruleList: Array<any>;

  constructor() { }

  ngOnInit(): void {
    this.ruleList = history.state.data ? history.state.data : [];
  }

  deleteRule(index: number) {
    if (confirm(`Are you sure you want to delete the rule "${this.ruleList[index].description}" ?`)) {
      this.ruleList.splice(index, 1);
      alert("Rule successfully deleted");
    }
  }

}