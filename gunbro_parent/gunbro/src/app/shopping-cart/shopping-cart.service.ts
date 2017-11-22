import { Injectable } from '@angular/core';

@Injectable()
export class ShoppingCartService {
	cartInfo: any;

  constructor() { }

	setCartInfo(cartInfo) {
		this.cartInfo = cartInfo;
  	}

  	getCartInfo() {
  		return this.cartInfo;
  	}

}
