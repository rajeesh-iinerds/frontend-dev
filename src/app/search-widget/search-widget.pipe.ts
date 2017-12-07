import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'searchWidget'
})
export class SearchWidgetPipe implements PipeTransform {

  transform(categories: any, inputData: any): any {
    if(inputData == null) return categories;

    return categories.filter(function(category){
      return category.itemName.toLowerCase().indexOf(inputData.toLowerCase()) > -1;
    })
  }

}
