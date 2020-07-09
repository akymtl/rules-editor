import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.scss']
})
export class AddComponent implements OnInit {
  amount: any;
  tenure: any;
  product: any;
  age: any;
  pincode: any;
  rule = undefined;
  rules = undefined;
  ruleCriteria = {
    amount: 'Select amount filter',
    tenure: 'Select tenure filter',
    age: 'Select age filter',
  }

  constructor(
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.rules = history.state.data ? history.state.data.rules : [];
    if (history.state?.data?.index > -1) {
      const ruleProperties = this.rules[history.state.data.index]?.description?.split(' & ');
      ruleProperties.forEach(prop => {
        const property = prop.split(' is ')[0].split('the ')[1];
        if(prop.includes('less than')) {
          this[property] = ['less than', Number(prop.split(' than ')[1])];
          this.ruleCriteria[property] = `less ${property} than`;
        } else if(prop.includes('greater than')) {
          this[property] = ['greater than', Number(prop.split(' than ')[1])];
          this.ruleCriteria[property] = `greater ${property} than`;
        } else if (prop.includes('within range of')) {
          this[property] = ['within range of', prop.split(' of ')[1].split(' and ').join(', ')];
          this.ruleCriteria[property] = `within ${property} range of`;
        } else {
          this[property] = prop.split(' is ')[1];
        }
      });
    }
  }

  setValue(valueObj: any, property: number | string) {
    this[property] = undefined;
    if (valueObj.context.includes('range')) {
      const [start, end] = valueObj.data.split(', ');
      if (!end) {
        alert('Entered value does not matches with prescribed format.');
        this[property] = undefined;
        return;
      } else if (Number(start) > Number(end)) {
        alert('Start value should be smaller than the end value.');
        this[property] = undefined;
        return;
      }
    }
    this[property] = [valueObj.context, valueObj.data];
  }

  createRule() {
    this.rule = {
      description: 'If',
      logic: '',
    };

    Object.keys(this).forEach((key) => {
      if (!key.includes('rule') && key !== '__ngContext__' && key !== 'router' && this[key]) {
        if (this.rule.description.length > 3) {
          this.rule.description += ' &';
        }
        Array.isArray(this[key]) ? this.addComplexPropertyDescription(key) : this.addSimplePropertyDescription(key);
      }
    });

    history.state?.data?.index > -1 ? this.rules[history.state?.data?.index] = this.rule : this.rules.push(this.rule);
    this.router.navigate([''], { state: { data: this.rules } });
  }

  cancel() {
    this.router.navigate([''], { state: { data: this.rules } });
  }

  private addComplexPropertyDescription(property: string) {
    this.rule.description += ` the ${property} is ${this[property][0]}`;
    if (typeof this[property][1] !== 'number') { // For range
      const value = this[property][1].split(', ');
      this.rule.description += ` ${value[0]} and ${value[1]}`;
    } else {
      this.rule.description += ` ${this[property][1]}`;
    }
    this.addComplexPropertyLogic(property);
  }

  private addComplexPropertyLogic(property: string) {
    if (this.rule.logic.length) {
      this.rule.logic += ' && ';
    }
    if (typeof this[property][1] !== 'number') {
      const value = this[property][1].split(', ');
      this.rule.logic += '${' + `${property}` + '}' + ` > ${value[0]} && ` + '${' + `${property}` + '}' + ` < ${value[1]}`;
    } else {
      this.rule.logic += this[property][0].includes('less') ? '${' + `${property}` + '}' + ` < ${this[property][1]}` : '${' + `${property}` + '}' + ` > ${this[property][1]}`;
    }
  }

  private addSimplePropertyDescription(property: string) {
    this.rule.description += ` the ${property} is ${this[property]}`;
    this.addSimplePropertyLogic(property);
  }

  private addSimplePropertyLogic(property: string) {
    if (this.rule.logic.length) {
      this.rule.logic += ' && ';
    }
    this.rule.logic += '${' + `${property}` + '}' + ` == ${this[property]}`;
  }
}
