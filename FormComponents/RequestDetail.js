import React from "react";
import { View, Text, Pressable } from "react-native";
import { useAppState } from "../state";
const RequestDetail = ({ navigation, route }) => {
	const { styles } = useAppState();
	const detail = route.params.details;
	const handleAccept = () => {
	fetch(`http://localhost:8080/requests/update/${detail.id}`, {
			method: 'PATCH',
			headers: {
				'Content-Type': 'application/json'
			}, 
			body: JSON.stringify({ 'status': 'Accepted' })
		}).then(response => {
			if (response.ok) {
				console.log("updated succesfully")
				navigation.navigate("RequestsInfo")
			}
		})
	}
	const handleReject = () => {
		fetch(`http://localhost:8080/requests/update/${detail.id}`, {
			method: 'PATCH',
			headers: {
				'Content-Type': 'application/json'
			}, 
			body: JSON.stringify({ 'status': 'Declined' })
		}).then(response => {
			if (response.ok) {
				console.log("Declined succesfully")
				navigation.navigate("RequestsInfo")
			}
		})
	}
	return (
		<>
			<View style={styles.compView}>
				<Text><b>Request Details</b></Text>
				<View style={styles.textInSubView}>
					<label>Traveller Name:</label>
					<Text>{detail.traveller_name} </Text>
				</View>
				<View style={styles.textInSubView}>
					<label>Start Date:</label>
					<Text>{detail.start_date}</Text>
				</View>
				<View style={styles.textInSubView}>
					<label>End Date:</label>
					<Text>{detail.end_date}</Text>
				</View>
				<View style={styles.textInSubView}>
					<label>Number Of Persons:</label>
					<Text>{detail.no_of_persons}</Text>
				</View>
				<View style={styles.textInSubView}>
					<label>Accomodation:</label>
					<Text>{detail.is_room_available ? "Required" : "Not Required"}</Text>
				</View>
				<View style={styles.textInSubView}>
					<label>Vehicle:</label>
					<Text>{detail.is_vehicle_required ? "Required" : "Not Required"}</Text>
				</View>
				<View style={styles.textInSubView}>
					<label>Food:</label>
					<Text>{detail.is_food_required ? "Required" : "Not Required"}</Text>
				</View>
				<View style={styles.textInSubView}>
					<label>Plan Type</label>
					<Text>{detail.plan_type}</Text>
				</View>
				<View style={styles.textInSubView}>
					<label>Places</label>
					<Text>{detail.places}</Text>
				</View>
				<View style={{flex:1,flexDirection:'row',columnGap:'10px', height:'100px'}}>
				<Pressable onPress={handleAccept} style={styles.button}><Text>Accept</Text></Pressable>
				<Pressable onPress={handleReject} style={styles.button}><Text>Decline</Text></Pressable>
				</View>
			</View>
		</>
	)
}
export default RequestDetail;