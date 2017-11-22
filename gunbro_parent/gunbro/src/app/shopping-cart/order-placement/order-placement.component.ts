import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule, Router } from '@angular/router';

import { ShoppingCartService } from '../shopping-cart.service';

@Component({
  selector: 'app-order-placement',
  templateUrl: './order-placement.component.html',
  styleUrls: ['./order-placement.component.css']
})
export class OrderPlacementComponent implements OnInit {
	test: any;

  constructor(private route: ActivatedRoute,private router: Router, public cartService: ShoppingCartService) {
  }

  ngOnInit() {
  	this.test = this.cartService.getCartInfo();
  	console.log('dfgfffffffffffffffff', this.test);
  }

}
