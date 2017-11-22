import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-message-popup',
  templateUrl: './message-popup.component.html',
  styleUrls: ['./message-popup.component.css']
})
export class MessagePopupComponent implements OnInit {

  constructor() { }
  messagePopup: Boolean;
  messageTitle: String;
  messageDescription: String;
  statusCode:String;
  ngOnInit() {
    this.messagePopup = false;
    this.messageTitle = "";
    this.messageDescription = "";
    this.statusCode="";
  }
  showMessagePopUp(statusCode,messageTitle,messageDescription){
    this.messagePopup = true;
    this.messageTitle = messageTitle ? messageTitle:"Invalid Title";
    this.messageDescription = messageDescription ? messageDescription:"Invalid Description";
    this.statusCode=statusCode ? statusCode:"Invalid Status Code";
  }

}
