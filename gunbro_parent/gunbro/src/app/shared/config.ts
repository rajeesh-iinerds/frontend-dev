
import { environment } from '../../environments/environment';
var apiUrl = environment.apiUrl;

export const user = {
	"userGroup": "admin",
	"superadminUser" : "superadmin",
	"retaileradminUser": "retaileradmin"
};
export const userRoles = {
	"superAdminUser" : 3,
	"retailerAdminUser":4,
	"storeAdminUser": 1,
	"storeUser": 2,
};
export const userTypes = {
	"superadmin" : "APPCO ADMIN",
	"retaileradmin": "RETAILER ADMIN",
	"admin": "STORE ADMIN",
	"posuser": "STORE USER"
};
export const userPoolData = {
	"UserPoolId" : 'us-east-1_Q3sA5af5A',
	"ClientId" : '7iaf7o5ja7su88mjb8du0pqigv'
};
export const appcohesionURL = {
	"productSearch_URL": apiUrl + "searchProduct",
	"placeOrder_URL": apiUrl + "placeOrder",
	"orderList_URL" : apiUrl + "orderList",
	"retailerStore_URL" : apiUrl + "getStorelist",
	"createUser_URL": apiUrl + "userCreation",
	// "listUsers_URL": "https://dtnqjf4q15.execute-api.us-east-1.amazonaws.com/prod",
	"userDetails_URL" : apiUrl + "userDetails",
	"retailerList_URL" : apiUrl + "getRetailersList",
	"retailercategorylist_URL" : apiUrl + "retailerCategory",
	"getDistributorsList_URL" : apiUrl +"getDistList",
	"getDistributorMarkup_URL" : apiUrl +"getMarkup",
	"addDistributorMarkup_URL" : apiUrl +"setMarkup",
	"retailerApply_URL": apiUrl + "retailerMarkUpApply", 
	"placeOrder_SS_URL" : "http://ssplaceorder.cloudhub.io/",
	"createStore_URL": apiUrl + "createStore",
	"productQuantity_SS_URL" : "http://ssapigetquantity.cloudhub.io/",
	"getStoreDetails_URL": apiUrl +"getStoreDetails",
	"retailerProfile_URL" : apiUrl +"userInfo",
	"updateRetailerProfile_URL" : apiUrl + "updateUserInfo",
	"getEmployeeList_URL": apiUrl +"usersList",
	"forgetPasssword_URL": apiUrl + "forgotPwd",
	"deleteStore_URL": apiUrl + "deleteStore",
	"addToCart_URL": apiUrl + "addToCart",
	"getCartList_URL": apiUrl + "cartListing",
	"deleteCart_URL": apiUrl + "deleteItem",
	"cartListing_URL":apiUrl+"cartListing"
	
};
export const distApiList = ["ss"];
export const statusCode = {
	"success_code": "200",
	"empty_code": "2003",
	"error_code": "400"
};
export const distributor_markup_messages = {
	"success_title": "SUCCESS",
	"success_description": "Markup has been added successfully!"
};
export const retailerProfile_messages = {
	"success_title": "SUCCESS",
	"success_description": "Retailer profile updated successfully!"
};
export const store_messages = {
	"success_description": "Store has been created successfully!",
	"delete_confirm_description": "Do you really want to continue?"
};
export const error_message = {
	"error_title": "ERROR"
};
export const forgetPasswordMsg = {
	"Msg_description" : "Cannot reset password for the user as there is no registered/verified email or phone_number",
	"Email_description" : "Email Sent"
};
export const orderRoute = {
	"flag" : "order"
};
export const cartRoute ="/dashboard/cart";
export const SS_prod_param = {
	"CustomerNumber": "31821", //"99994",
    "UserName": "31821", //"99994",
    "Password": "17602", //"99999",
    "Source": "31821" //"99994",
};