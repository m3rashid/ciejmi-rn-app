import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import LoginScreen from '../screens/auth/LoginScreen';
import SignupScreen from '../screens/auth/SignupScreen';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Splash from '../screens/auth/Splash';
import ForgetPasswordScreen from '../screens/auth/ForgetPasswordScreen';
import UpdatePasswordScreen from '../screens/profile/UpdatePasswordScreen';
import AddProductScreen from '../screens/admin/AddProductScreen';
import DashboardScreen from '../screens/admin/DashboardScreen';
import ViewProductScreen from '../screens/admin/ViewProductScreen';
import Tabs from './Tabs';
import CartScreen from '../screens/user/CartScreen';
import CheckoutScreen from '../screens/user/CheckoutScreen.js';
import OrderConfirmScreen from '../screens/user/OrderConfirmScreen';
import ProductDetailScreen from '../screens/user/ProductDetailScreen';
import EditProductScreen from '../screens/admin/EditProductScreen';
import ViewOrdersScreen from '../screens/admin/ViewOrdersScreen';
import ViewOrderDetailScreen from '../screens/admin/ViewOrderDetailScreen';
import MyOrderScreen from '../screens/user/MyOrderScreen';
import MyOrderDetailScreen from '../screens/user/MyOrderDetailScreen';
import ViewCategoryScreen from '../screens/admin/ViewCategoryScreen';
import AddCategoryScreen from '../screens/admin/AddCategoryScreen';
import ViewUsersScreen from '../screens/admin/ViewUsersScreen';
import CategoriesScreen from '../screens/user/CategoriesScreen';
import EditCategoryScreen from '../screens/admin/EditCategoryScreen';
import MyWishlistScreen from '../screens/profile/MyWishlistScreen';
import MyAddressScreen from '../screens/user/myAddresses';
import AddAdressScreen from "../screens/user/AddAddressScreen"
import ViewPDFScreen from '../screens/admin/showPdf';
import ViewDepartmentScreen from '../screens/admin/ViewDepartmentsScreen';
import AddDepartmentScreen from "../screens/admin/AddDepartmentScreen"
import AdminProfileScreen from "../screens/admin/adminProfileScreen"

const Stack = createNativeStackNavigator();

const Routes = () => {
	return (
		<NavigationContainer>
			<Stack.Navigator
				initialRouteName="splash"
				screenOptions={{ headerShown: false }}>
				<Stack.Screen name="splash" component={Splash} />
				<Stack.Screen name="login" component={LoginScreen} />
				<Stack.Screen name="signup" component={SignupScreen} />
				<Stack.Screen name="forgetpassword" component={ForgetPasswordScreen} />
				<Stack.Screen name="updatepassword" component={UpdatePasswordScreen} />
				<Stack.Screen name="mywishlist" component={MyWishlistScreen} />
				<Stack.Screen name="dashboard" component={DashboardScreen} />
				<Stack.Screen name="addproduct" component={AddProductScreen} />
				<Stack.Screen name="viewproduct" component={ViewProductScreen} />
				<Stack.Screen name="editproduct" component={EditProductScreen} />
				<Stack.Screen name="tab" component={Tabs} />
				<Stack.Screen name="cart" component={CartScreen} />
				<Stack.Screen name="checkout" component={CheckoutScreen} />
				<Stack.Screen name="orderconfirm" component={OrderConfirmScreen} />
				<Stack.Screen name="productdetail" component={ProductDetailScreen} />
				<Stack.Screen name="vieworder" component={ViewOrdersScreen} />
				<Stack.Screen name="pdf" component={ViewPDFScreen} />
				<Stack.Screen name="viewDepartment" component={ViewDepartmentScreen} />
				<Stack.Screen name="addDepartment" component={AddDepartmentScreen} />
				<Stack.Screen name="adminProfileScreen" component={AdminProfileScreen} />
				<Stack.Screen
					name="vieworderdetails"
					component={ViewOrderDetailScreen}
				/>
				<Stack.Screen name="myorder" component={MyOrderScreen} />
				<Stack.Screen name="myaddress" component={MyAddressScreen} />
				<Stack.Screen name="addAddress" component={AddAdressScreen} />
				<Stack.Screen name="myorderdetail" component={MyOrderDetailScreen} />
				<Stack.Screen name="viewcategories" component={ViewCategoryScreen} />
				<Stack.Screen name="addcategories" component={AddCategoryScreen} />
				<Stack.Screen name="editcategories" component={EditCategoryScreen} />
				<Stack.Screen name="viewusers" component={ViewUsersScreen} />
				<Stack.Screen name="categories" component={CategoriesScreen} />
			</Stack.Navigator>
		</NavigationContainer>
	);
};

export default Routes;
