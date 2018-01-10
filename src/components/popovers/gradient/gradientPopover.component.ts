import { Component } from '@angular/core';
import { ViewController } from 'ionic-angular';

interface Gradient {
  primaryColor: string;
  secondaryColor: string;
}

@Component({
  selector: 'GradientPopover',
  templateUrl: 'gradientPopover.component.html'
})
export class GradientPopover {

  // be wary darker colors combos dont work as well with black background
  gradients: Gradient[] = [
    { primaryColor: '#FC5C7D', secondaryColor: '#6A82FB'},
    { primaryColor: '#D3CCE3', secondaryColor: '#E9E4F0'},
    { primaryColor: '#00b09b', secondaryColor: '#96c93d'},
    { primaryColor: '#22c1c3', secondaryColor: '#fdbb2d'},
    { primaryColor: '#007991', secondaryColor: '#78ffd6'},
    { primaryColor: '#93278F', secondaryColor: '#00A99D'},
    { primaryColor: '#C33764', secondaryColor: '#1D2671'},
    { primaryColor: '#43C6AC', secondaryColor: '#191654'},
    { primaryColor: '#3494E6', secondaryColor: '#EC6EAD'},
    { primaryColor: '#ee0979', secondaryColor: '#ff6a00'},
    { primaryColor: '#00c3ff', secondaryColor: '#ffff1c'},
    { primaryColor: '#de6161', secondaryColor: '#2657eb'},
    { primaryColor: '#bdc3c7', secondaryColor: '#2c3e50'},
    { primaryColor: '#ffd89b', secondaryColor: '#19547b'},
    { primaryColor: '#FF5F6D', secondaryColor: '#FFC371'},
    { primaryColor: '#EECDA3', secondaryColor: '#EF629F'},
    { primaryColor: '#5A3F37', secondaryColor: '#2C7744'},
    { primaryColor: '#141517', secondaryColor: '#6A9113'},
    { primaryColor: '#001510', secondaryColor: '#00bf8f'},
    { primaryColor: '#5D4157', secondaryColor: '#A8CABA'},
  ];

  constructor(
    public viewCtrl: ViewController,
  ) {

  }

  selectOption(i: number) {
    this.viewCtrl.dismiss(this.gradients[i]);
  }
}
