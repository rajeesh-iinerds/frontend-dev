import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule, Router } from '@angular/router';

import { ShoppingCartService } from '../shopping-cart.service';

@Component({
  selector: 'app-order-placement',
  templateUrl: './order-placement.component.html',
  styleUrls: ['./order-placement.component.css']
})
export class OrderPlacementComponent implements OnInit {
	cartInfo: any;
    orderCount: number = 0;
    amountPayable: number = 0;
    customerInfoMap:any={};
    constructor(private route: ActivatedRoute,private router: Router, public cartService: ShoppingCartService) {
    }

    ngOnInit() {
        this.cartInfo = this.cartService.getCartInfo();
        for(var i = 0; i < this.cartInfo.length; i++) {
            this.orderCount = this.orderCount + Number(this.cartInfo[i].cartObject.selectedQuantity);
            this.amountPayable = this.amountPayable + Number(this.cartInfo[i].cartObject.subtotal);
        }
    }
    customerInfoUpdate(customerInfoMap,customerInfoForm){

    }

}
