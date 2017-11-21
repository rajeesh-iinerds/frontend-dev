import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-shopping-cart',
  templateUrl: './shopping-cart.component.html',
  styleUrls: ['./shopping-cart.component.css']
})
export class ShoppingCartComponent implements OnInit {

	sizes: any[] = [
		{ 'size': '9999', 'diameter': '16000 km', 'id': 'id666' },
	    { 'size': '3333', 'diameter': '32000 km', 'id': 'id555' }
	];

	dummy: any[] = [
		{"name": "American Classic 1911 Amigo 45 ACP 3.5", "price": "129.00", "id": "101"},
		{"name": "Ruger", "price": "230.00", "id": "102"},
		{"name": "Hornady", "price": "112.00", "id": "103"},
		{"name": "Test", "price": "150.00", "id": "104"},
		{"name": "Dump", "price": "500.00", "id": "105"}
	];
	totalAmount: any;
	list: any;
	count: number = 0;

  	constructor() { }

  	ngOnInit() {
  		this.totalAmount = 0;
  		for(var i = 0; i < this.dummy.length; i++) {
  			this.totalAmount = this.totalAmount+Number(this.dummy[i].price);
  		}
  		this.list = this.dummy;
  		this.count = this.dummy.length;
  	}

	checkAll(size, ev) {
  		// this.sizes.forEach(x => x.state = ev.target.checked)
  		console.log('******', ev);
  		var isChecked = ev.target.checked;
  		if (!isChecked) {  			
  			this.count--;
  			this.totalAmount = this.totalAmount-Number(size.price);
  		}
  		else {
  			this.count++;
  			this.totalAmount = this.totalAmount+Number(size.price);
  		}
	}

	isAllChecked() {
  		return this.sizes.every(_ => _.state);
	}

	removeFromCart(obj) {
		this.count--;
  		this.totalAmount = this.totalAmount-Number(obj.price);
		const index: number = this.dummy.indexOf(obj);
	    if (index !== -1) {
	        this.dummy.splice(index, 1);
	    }        
	}


}
