import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import LoginScreen from "./LoginScreen";
import BasicInfo from "./FormComponents/BasicInfo";
import Address from "./FormComponents/Address";
import Requests from "./FormComponents/Requests";
import { createDrawerNavigator } from "@react-navigation/drawer";
import Profile from "./FormComponents/Profile";
import AddressDetails from "./FormComponents/AddressDetails";
import RequestDetail from "./FormComponents/RequestDetail";
const Stack = createNativeStackNavigator();
const Drawer = createDrawerNavigator();
const MainApp = () => {
	return (
		<>
			<NavigationContainer>
				<Stack.Navigator>
					<Stack.Screen component={LoginScreen} name="Login Screen" options={{ title: 'Welcome to Local Guides App' }} />
					<Stack.Screen component={BasicInfo} name="Signup" options={{ title: 'Complete profile creation' }} />
					<Stack.Screen component={RequestSearch} name="RequestsInfo" options={{ title: 'List of Requests' }} />
					<Stack.Screen component={Address} name="Address" options={{ title: 'Enter Address details' }} />
					<Stack.Screen component={RequestDetail} name="RequestDetail" options={{title:"Details of Selected Request"}}/>
				</Stack.Navigator>
			</NavigationContainer>
		</>
	)
}

const RequestSearch = () => {
	return (
		<Drawer.Navigator initialRouteName="Requests">
			<Drawer.Screen name="Requests" component={Requests}/>
			<Drawer.Screen name="profile" component={Profile} />
			<Drawer.Screen name="Guide Address" component={AddressDetails} />
		</Drawer.Navigator>
	)
}
export default MainApp;