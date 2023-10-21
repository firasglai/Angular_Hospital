import { Component, OnInit } from '@angular/core';
import { SpringAuthService } from 'src/app/services/authentication/spring-auth.service';
@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.css']
})
export class AccountComponent implements OnInit{

constructor(
  private auth:SpringAuthService,
){

}
  ngOnInit(): void {

    
  }

  Onedit=false

  openedit(){
    this.Onedit=true
  }
  canceledit(){
    this.Onedit=false
  }
}
