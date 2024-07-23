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
			<View View style={{
							backgroundColor: "#ffc2c2",
							rowGap: 10,
							flexDirection: 'column'
						}}>
				<Text>Request Details</Text>
				<View style={{ flexDirection: 'row', alignItems: 'center', cloumnGap: 10 }}>
					<Text style={{ width: "35%" }}>Traveller Name:</Text>
					<Text style={{ width: "55%" }}>{detail.traveller_name} </Text>
				</View>
				<View style={{ flexDirection: 'row', alignItems: 'center', cloumnGap: 10 }}>
					<Text style={{ width: "35%" }}>Start Date:</Text>
					<Text style={{ width: "55%" }}>{detail.start_date}</Text>
				</View>
				<View style={{ flexDirection: 'row', alignItems: 'center', cloumnGap: 10 }}>
					<Text style={{ width: "35%" }}>End Date:</Text>
					<Text style={{ width: "55%" }}>{detail.end_date}</Text>
				</View>
				<View style={{ flexDirection: 'row', alignItems: 'center', cloumnGap: 10 }}>
					<Text style={{ width: "35%" }}>Number Of Persons:</Text>
					<Text style={{ width: "55%" }}>{detail.no_of_persons}</Text>
				</View>
				<View style={{ flexDirection: 'row', alignItems: 'center', cloumnGap: 10 }}>
					<Text style={{ width: "35%" }}>Accomodation:</Text>
					<Text style={{ width: "55%" }}>{detail.is_room_available ? "Required" : "Not Required"}</Text>
				</View>
				<View style={{ flexDirection: 'row', alignItems: 'center', cloumnGap: 10 }}>
					<Text style={{ width: "35%" }}>Vehicle:</Text>
					<Text style={{ width: "55%" }}>{detail.is_vehicle_required ? "Required" : "Not Required"}</Text>
				</View>
				<View style={{ flexDirection: 'row', alignItems: 'center', cloumnGap: 10 }}>
					<Text style={{ width: "35%" }}>Food:</Text>
					<Text style={{ width: "55%" }}>{detail.is_food_required ? "Required" : "Not Required"}</Text>
				</View>
				<View style={{ flexDirection: 'row', alignItems: 'center', cloumnGap: 10 }}>
					<Text style={{ width: "35%" }}>Plan Type</Text>
					<Text style={{ width: "55%" }}>{detail.plan_type}</Text>
				</View>
				<View style={{ flexDirection: 'row', alignItems: 'center', cloumnGap: 10 }}>
					<Text style={{ width: "35%" }}>Places</Text>
					<Text style={{ width: "55%" }}>{detail.places}</Text>
				</View>
				<View style={{ flexDirection: 'row', alignItems: 'center', columnGap: 10 }}>
				<Pressable onPress={handleAccept} style={styles.button}><Text>Accept</Text></Pressable>
				<Pressable onPress={handleReject} style={styles.button}><Text>Decline</Text></Pressable>
				<Pressable onPress={()=>navigation.goBack()} style={styles.button}><Text>Back</Text></Pressable>
				</View>
			</View>
		</>
	)
}
export default RequestDetail;