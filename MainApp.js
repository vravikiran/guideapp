import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import LoginScreen from "./LoginScreen";
import BasicInfo from "./FormComponents/BasicInfo";
import Address from "./FormComponents/Address";
import Requests from "./FormComponents/Requests";
import { DrawerContentScrollView, DrawerItem, DrawerItemList, createDrawerNavigator } from "@react-navigation/drawer";
import RequestDetail from "./FormComponents/RequestDetail";
import { CommonActions } from "@react-navigation/native";
import { SafeAreaProvider } from "react-native-safe-area-context";
const Stack = createNativeStackNavigator();
const Drawer = createDrawerNavigator();
const logoutDrawerContent = (props) => {
	return (
		<DrawerContentScrollView {...props} >
			<DrawerItemList {...props} />
			<DrawerItem label="Logout" onPress={() => {
				const resetAction = CommonActions.reset({
					routes: [{ name: "LoginScreen" }]
				});
				props.navigation.dispatch(resetAction)
			}} />
		</DrawerContentScrollView>
	)
}
const MainApp = () => {
	return (
		<>
			<NavigationContainer>
				<Stack.Navigator>
					<Stack.Screen component={LoginScreen} name="LoginScreen" options={{ title: 'Welcome to Local Guides App' }} />
					<Stack.Screen component={BasicInfo} name="Signup" options={{ title: 'Complete profile creation' }} />
					<Stack.Screen component={RequestSearch} name="RequestsInfo" options={{ title: 'List of Requests' }} />
					<Stack.Screen component={Address} name="Address" options={{ title: 'Enter Address details' }} />
					<Stack.Screen component={RequestDetail} name="RequestDetail" options={{ title: "Details of Selected Request" }} />
				</Stack.Navigator>
			</NavigationContainer>
		</>
	)
}

const RequestSearch = () => {
	return (
		<SafeAreaProvider>
			<Drawer.Navigator initialRouteName="Requests" drawerContent={(props) => logoutDrawerContent({ ...props })}>
				<Drawer.Screen name="Requests" component={Requests} />
				<Drawer.Screen name="profile" component={BasicInfo} />
				<Drawer.Screen name="Guide Address" component={Address} />
			</Drawer.Navigator>
		</SafeAreaProvider>
	)
}
export default MainApp;