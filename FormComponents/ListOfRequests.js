import React, { useState } from "react";
import {  RadioButton } from "react-native-paper";
import { Pressable, Text, View } from "react-native";
import { useAppState } from "../state";

const ListOfRequests = ({ list,navigation }) => {
	const { styles } = useAppState();
	const [value, setValue] = useState('')
	const handleDetails = () => {
		console.log(value)
		const details = list.filter(item => item.id === value);
		navigation.navigate('RequestDetail',{details:details[0]})
	}
	const listOfItems = list.map(item =>
		<>
			<View style={{ flexDirection: 'row', alignItems: 'center'}}>
				<RadioButton value={item.id} />
				<Text style={{position:'absolute',left:"25%"}}>{item.traveller_name}</Text>
				<Text style={{position:'absolute',left:"55%"}}>{item.start_date} </Text>
				<Text style={{position:'absolute',left:"86%"}}>{item.end_date}</Text>
			</View>
		</>
	)
	return (

		<View>
			<RadioButton.Group onValueChange={newValue => setValue(newValue)} value={value}>
				<View style={{rowGap:10}}>
					<View style={{ flexDirection: 'row', alignItems: 'center' }}>
						<Text style={{position:'absolute',left:"25%"}}>Traveller Name</Text>
						<Text style={{position:'absolute',left:"55%"}}>Start Date</Text>
						<Text style={{position:'absolute',left:"86%"}}>End Date</Text>
					</View>
					{listOfItems}
				</View>
			</RadioButton.Group>
			<Pressable onPress={handleDetails} style={styles.button}><Text>View Request</Text></Pressable>
		</View>
	)
}
export default ListOfRequests;