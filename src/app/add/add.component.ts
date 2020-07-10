import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import  { Properties, IProperties } from './add.model';

@Component({
  selector: 'app-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.scss']
})
export class AddComponent implements OnInit {
  props: IProperties = {};
  rule = undefined;
  rules = undefined;
  ruleCriteria = {
    amount: 'Select amount filter',
    tenure: 'Select tenure filter',
    age: 'Select age filter',
  }
  properties = Properties;

  constructor(
    private router: Router,
  ) {
    Object.keys(this.properties).forEach(item => {
      Object.keys(this.properties[item]).forEach(key => {
        this.props[key] = undefined;
      });
    });
  }

  ngOnInit(): void {
    this.rules = history.state.data ? history.state.data.rules : [];
    if (history.state?.data?.index > -1) {
      const ruleProperties = this.rules[history.state.data.index]?.description?.split(' & ');
      ruleProperties.forEach(prop => {
        const property = prop.split(' is ')[0].split('the ')[1];
        if (prop.includes('less than')) {
          this.props[property] = ['less than', Number(prop.split(' than ')[1])];
          this.ruleCriteria[property] = `less than`;
        } else if (prop.includes('greater than')) {
          this.props[property] = ['greater than', Number(prop.split(' than ')[1])];
          this.ruleCriteria[property] = `greater than`;
        } else if (prop.includes('within range of')) {
          this.props[property] = ['within range of', prop.split(' of ')[1].split(' and ').join(', ')];
          this.ruleCriteria[property] = `within range of`;
        } else {
          this.props[property] = prop.split(' is ')[1];
        }
      });
    }
  }

  setValue(valueObj: any, property: number | string) {
    this.props[property] = undefined;
    if (valueObj.context.includes('range')) {
      const [start, end] = valueObj.data.split(', ');
      if (!end) {
        alert('Entered value does not matches with prescribed format.');
        this.props[property] = undefined;
        return;
      } else if (Number(start) > Number(end)) {
        alert('Start value should be smaller than the end value.');
        this.props[property] = undefined;
        return;
      }
      this.props[property] = [valueObj.context, valueObj.data];
    } else {
      this.props[property] = [valueObj.context, Number(valueObj.data)];
    }
  }

  createRule() { // add/update rule
    this.rule = {
      description: 'If', // for beginning of description
      logic: '',
    };

    Object.keys(this.props).forEach((key) => {
      if (this.props[key]) {
        if (this.rule.description.length > 3) {
          this.rule.description += ' &';
        }
        Array.isArray(this.props[key]) ? this.addComplexPropertyDescription(key) : this.addSimplePropertyDescription(key);
      }
    });

    history.state?.data?.index > -1 ? this.rules[history.state?.data?.index] = this.rule : this.rules.push(this.rule);
    this.router.navigate([''], { state: { data: this.rules } });
  }

  cancel() { // cancel add or edit
    this.router.navigate([''], { state: { data: this.rules } });
  }

  private addComplexPropertyDescription(property: string) {
    this.rule.description += ` the ${property} is ${this.props[property][0]}`;
    if (typeof this.props[property][1] !== 'number') { // For range
      const value = this.props[property][1].split(', ');
      this.rule.description += ` ${value[0]} and ${value[1]}`;
    } else {
      this.rule.description += ` ${this.props[property][1]}`;
    }
    this.addComplexPropertyLogic(property);
  }

  private addComplexPropertyLogic(property: string) {
    if (this.rule.logic.length) {
      this.rule.logic += ' && ';
    }
    if (typeof this.props[property][1] !== 'number') {
      const value = this.props[property][1].split(', ');
      this.rule.logic += '${' + `${property}` + '}' + ` > ${value[0]} && ` + '${' + `${property}` + '}' + ` < ${value[1]}`;
    } else {
      this.rule.logic += this.props[property][0].includes('less') ? '${' + `${property}` + '}' + ` < ${this.props[property][1]}` : '${' + `${property}` + '}' + ` > ${this.props[property][1]}`;
    }
  }

  private addSimplePropertyDescription(property: string) {
    this.rule.description += ` the ${property} is ${this.props[property]}`;
    this.addSimplePropertyLogic(property);
  }

  private addSimplePropertyLogic(property: string) {
    if (this.rule.logic.length) {
      this.rule.logic += ' && ';
    }
    this.rule.logic += '${' + `${property}` + '}' + ` == ${this.props[property]}`;
  }
}
