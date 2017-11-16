
import { environment } from '../../environments/environment';
var apiUrl = environment.apiUrl;
alert(apiUrl);
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
	"superadmin" : "SUPER ADMIN",
	"retaileradmin": "RETAILER ADMIN",
	"admin": "STORE ADMIN",
	"posuser": "USER"
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
	"createUser_URL": "https://7v5j1r1r92.execute-api.us-east-1.amazonaws.com/prod/cognitoSignin",
	"listUsers_URL": "https://dtnqjf4q15.execute-api.us-east-1.amazonaws.com/prod",
	"userDetails_URL" : apiUrl + "userDetails",
	"retailerList_URL" : "https://lmzc2xjexg.execute-api.us-east-1.amazonaws.com/prod",
	"retailercategorylist_URL" : "https://hpbrogcqal.execute-api.us-east-1.amazonaws.com/prod",
	"getDistributorsList_URL" : apiUrl +"getDistList",
	"getDistributorMarkup_URL" : apiUrl +"getMarkup",
	"addDistributorMarkup_URL" : apiUrl +"setMarkup",
	"retailerApply_URL": "https://i0ko9akgah.execute-api.us-east-1.amazonaws.com/prod",
	"placeOrder_SS_URL" : "http://ssplaceorder.cloudhub.io/",
	"createStore_URL": apiUrl + "createStore",
	"productQuantity_SS_URL" : "http://ssapigetquantity.cloudhub.io/",
	"getStoreDetails_URL": apiUrl +"getStoreDetails",
	"retailerProfile_URL" : apiUrl +"userInfo",
	"updateRetailerProfile_URL" : apiUrl + "updateUserInfo",
	"getEmployeeList_URL": apiUrl +"usersList"
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
	"success_description": "Store has been created successfully!"
};
export const error_message = {
	"error_title": "ERROR"
};
export const SS_prod_param = {
	"CustomerNumber": "31821", //"99994",
    "UserName": "31821", //"99994",
    "Password": "17602", //"99999",
    "Source": "31821" //"99994",
};