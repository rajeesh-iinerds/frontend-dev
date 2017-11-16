

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
	"productSearch_URL": "https://api.appcohesion.io/searchProduct",
	"placeOrder_URL": "https://api.appcohesion.io/placeOrder",
	"orderList_URL" : "https://api.appcohesion.io/orderList",
	"retailerStore_URL" : "https://api.appcohesion.io/getStorelist",
	"createUser_URL": "https://7v5j1r1r92.execute-api.us-east-1.amazonaws.com/prod/cognitoSignin",
	"listUsers_URL": "https://dtnqjf4q15.execute-api.us-east-1.amazonaws.com/prod",
	"userDetails_URL" : "https://api.appcohesion.io/userDetails",
	"retailerList_URL" : "https://lmzc2xjexg.execute-api.us-east-1.amazonaws.com/prod",
	"retailercategorylist_URL" : "https://hpbrogcqal.execute-api.us-east-1.amazonaws.com/prod",
	"getDistributorsList_URL" : "https://api.appcohesion.io/getDistList",
	"getDistributorMarkup_URL" : "https://api.appcohesion.io/getMarkup",
	"addDistributorMarkup_URL" : "https://api.appcohesion.io/setMarkup",
	"retailerApply_URL": "https://i0ko9akgah.execute-api.us-east-1.amazonaws.com/prod",
	"placeOrder_SS_URL" : "http://ssplaceorder.cloudhub.io/",
	"createStore_URL": "https://api.appcohesion.io/createStore",
	"productQuantity_SS_URL" : "http://ssapigetquantity.cloudhub.io/",
	"getStoreDetails_URL": "http://api.appcohesion.io/getStoreDetails",
	"retailerProfile_URL" : "https://api.appcohesion.io/userInfo",
	"updateRetailerProfile_URL" : "https://api.appcohesion.io/updateUserInfo",
	"getEmployeeList_URL": "https://api.appcohesion.io/usersList"
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
export const forgetPasswordMsg = {
	"Msg_description" : "Cannot reset password for the user as there is no registered/verified email or phone_number",
	"Email_description" : "Email Sent"
};
export const SS_prod_param = {
	"CustomerNumber": "31821", //"99994",
    "UserName": "31821", //"99994",
    "Password": "17602", //"99999",
    "Source": "31821" //"99994",
};