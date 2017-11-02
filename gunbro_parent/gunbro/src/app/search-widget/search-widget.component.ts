import { Component, OnInit } from '@angular/core';
import { DemoService } from '../demo-component/demo.service'; 
import { SearchWidgetPipe } from './search-widget.pipe';
@Component({
  selector: 'app-search-widget',
  templateUrl: './search-widget.component.html',
  styleUrls: ['./search-widget.component.css']
})
export class SearchWidgetComponent implements OnInit {

  mySource: Array<any>;
  sourceData: any;
  inputData: any;
  isAutoComplete: Boolean;
  searchHistoryMap = [];
  searchType: any;
  manufacturerId:String;
  searchKey:any;
  level = 0;
  constructor(private demoService:DemoService) {
    this.switchDataList();
  }
  fetchResults(inputData) {
    // {gsin: "77777", store_id: "1", retailer_id: "1"}
    // {mpn: "cscsc", manufacturerID: "7", store_id: "1", retailer_id: "1"}
    if (this.searchHistoryMap[0].itemId == 2) {
      this.searchType="mpn";
      this.searchKey=inputData;
      this.manufacturerId=this.searchHistoryMap[1].manufacturerId;
    } else if (this.searchHistoryMap[0].itemId == 1) {
      this.searchType="gsin";
      this.searchKey=inputData;
      this.manufacturerId='';
    }
    return this.demoService.getSessionToken().subscribe((response) => {
      if(response.getIdToken().getJwtToken()) {
          const jwt = response.getIdToken().getJwtToken();
          this.demoService.productSearchfromService(this.searchType, this.searchKey, jwt, this.manufacturerId);
          this.inputData='';
          this.isAutoComplete=false;
          this.level = 0;
          this.searchHistoryMap=[];
          this.switchDataList();
      }
  }, (err) => {
    console.log(err);
  });

  }
  closeLabelCard(index) {
    this.searchHistoryMap.splice(index, 1);
    if (this.searchHistoryMap.length) {
      this.level = this.searchHistoryMap[this.searchHistoryMap.length - 1].level;
      this.checkLevel(this.searchHistoryMap.length - 1);
    } else {
      this.level = 0;
      this.checkLevel(-1);
    }
  }
  selectComponent(mySourceMap) {
  
    if (this.searchHistoryMap.length) {
      //console.info(mySourceMap);
      //console.info(this.searchHistoryMap);
      var indexOfItem = this.containsObject(mySourceMap, this.searchHistoryMap);
      if (indexOfItem <= 0) {
        //console.info("Pushing item");
        this.searchHistoryMap.push(mySourceMap);
        this.checkLevel(this.searchHistoryMap.length - 1);
        // this.searchHistoryMap.reverse();
      } else {
        this.checkLevel(this.searchHistoryMap.length - 1);
      }
    } else {
      //console.info("Initial Pushing item");
      this.searchHistoryMap.push(mySourceMap);
      // this.searchHistoryMap.reverse();
      this.checkLevel(this.searchHistoryMap.length - 1);
    }
    //console.info(mySourceMap);

    //console.info(this.searchHistoryMap);
    this.inputData='';
  }
  blurComponent(){
    this.isAutoComplete=false;
  }
  checkLevel(indexOfItem) {
    if (indexOfItem >= 0) {
      if (this.searchHistoryMap[indexOfItem].itemId == 2) {
        this.level = 2;
        this.switchDataList();
      } else if (this.searchHistoryMap[indexOfItem].itemId == 1) {
        this.level = 1;
        this.switchDataList();
      } else if (this.searchHistoryMap[indexOfItem].itemId > 2) {
        this.level = 3;
        this.switchDataList();
      }
    }
    else {
      this.level = 0;
      this.switchDataList();
    }
  }
  switchDataList() {
    if (this.level == 0) {
      this.mySource = [{ level: 0, itemId: 1, itemName: "GSIN" }, { level: 0, itemId: 2, itemName: "Manufacturer Part" }];
      
    } else if (this.level == 1) {
      this.mySource = [];
    } else if (this.level == 2) {
      this.mySource = [
        { level: 2, itemId: 3, itemName: "Sig Sauer", manufacturerId: 3 }, 
        { level: 2, itemId: 4, itemName: "Ruger", manufacturerId: 8 },
        { level: 2, itemId: 5, itemName: "Browning", manufacturerId: 7 }, 
        { level: 2, itemId: 6, itemName: "Colt", manufacturerId: 150 }, 
        { level: 2, itemId: 7, itemName: "Springfield", manufacturerId: 58 },
        { level: 2, itemId: 8, itemName: "Blackhawk", manufacturerId: 21 }, 
        { level: 2, itemId: 9, itemName: "Remington", manufacturerId: 40 },
        { level: 2, itemId: 10, itemName: "Glock", manufacturerId: 61 },
        { level: 2, itemId: 11, itemName: "Mossberg", manufacturerId: 157 }, 
        { level: 2, itemId: 12, itemName: "Savage Arms", manufacturerId: 128 } 
    ];
    } else if (this.level == 3) {
      this.mySource = [];
    }
  }
  getIntentLength() {
    var count = 0;
    if (this.searchHistoryMap.length) {
      for (var i = 0; i < this.searchHistoryMap.length; i++) {
        count = count + this.searchHistoryMap[i].itemName.replace(/[^A-Z]/gi, "").length;
      }
      return count * 10 + 20 + 'px';
    } else {
      return 0;
    }
  }
  containsObject(obj, list) {

    var index, i;
    for (i = 0; i < list.length; i++) {
      if (list[i].itemName === obj.itemName) {
        //console.info("item exist in index" + i);
        index = i;
      } else {
        index = -1;
      }
    }
    return index;
  }
 
  ngOnInit() {
  }

}
