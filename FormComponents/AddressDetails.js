import React, { useState } from "react";
import { useAppState } from "../state";
import { View, Text, TextInput, Pressable } from "react-native";
import { IconButton } from 'react-native-paper'
const AddressDetails = () => {
	const { styles, state, setState } = useAppState()
	const [enable, setEnable] = useState(false)
	const [address, setAddress] = useState(state.address)
	const handleEdit = () => {
		setEnable(true)
	}
	const handleChange = (text, name) => {
		setAddress({
			...address,
			[name]: text
		})
	}
	const updateAddress = () => {
		fetch('http://localhost:8080/address', {
			method: "PUT",
			body: JSON.stringify(address),
			headers: {
				'Content-Type': 'application/json'
			}
		})
			.then(
				(response) => {
					if (response.ok) {
						console.log("Address updated successfully")
						setState({
							...state,
							address
						})
					}
				}
			)
	}
	return (
		<View>
			<View style={{ alignItems: 'flex-end' }} >
				<IconButton icon="pencil" onPress={handleEdit} />
			</View>
			<View style={styles.compView}>
				<Text style={{ alignContent: 'center' }}>Address Details</Text>
				<View style={styles.textInSubView}>
					<Text style={styles.label}>Address Line 1</Text>
					<TextInput name="address_line1" value={address.address_line1} onChangeText={(text) => handleChange(text, 'address_line1')} editable={enable} />
				</View>
				<View style={styles.textInSubView}>
					<Text style={styles.label}>Address Line 2</Text>
					<TextInput name="address_line2" value={address.address_line2} onChangeText={(text) => handleChange(text, 'address_line2')} editable={enable} />
				</View>
				<View style={styles.textInSubView}>
					<Text style={styles.label}>Pincode</Text>
					<TextInput name="pincode" value={address.pincode} onChangeText={(text) => handleChange(text, 'pincode')} editable={enable} />
				</View>
				<View style={styles.textInSubView}>
					<Text style={styles.label}>City</Text>
					{!enable && <Text style={styles.label}>{address.city}</Text>}
				</View>
				<View style={styles.textInSubView}>
					<Text style={styles.label}>State</Text>
					{!enable && <Text style={styles.label}>{address.state}</Text>}
				</View>
				<View style={styles.textInSubView}>
					<Text style={styles.label}>Country</Text>
					{!enable && <Text style={styles.label}>{address.country}</Text>}
				</View>
				<Pressable onPress={updateAddress} style={styles.button}><Text> Save</Text></Pressable>
			</View>
		</View>
	)
}
export default AddressDetails;