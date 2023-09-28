import { Component } from '@angular/core';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.css']
})
export class AccountComponent {
  Onedit=false

  openedit(){
    this.Onedit=true
  }
  canceledit(){
    this.Onedit=false
  }
}
