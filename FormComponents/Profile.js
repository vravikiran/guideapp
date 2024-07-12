import React, { useState } from "react";
import { IconButton } from 'react-native-paper'
import { TextInput, View, Text, Pressable } from "react-native";
import { useAppState } from "../state";
const Profile = () => {
	const [enable, setEnable] = useState(false)
	const { state, setState, styles } = useAppState();
	const handleChange = (text, name) => {
		setState({
			...state,
			[name]: text
		})
	}
	const handleEdit = () => {
		setEnable(true)
	}
	const handleUpdate = () => {
		setEnable(false)
		fetch('http://localhost:8080/user', {
			method: "PATCH",
			body: JSON.stringify(state),
			headers: {
				'Content-Type': 'application/json'
			}
		}).then((response) => {
			if (response.ok) {
				return response.json()
			}
		}).then((response) => {
			console.log(response)
		})
	}
	return (
		<>
			<View>
				<View style={{ alignItems: 'flex-end' }} >
					<IconButton icon="pencil" onPress={handleEdit} />
				</View>
				<View style={styles.compView}>
					<Text style={styles.label}>Profile Details</Text>
					<View style={styles.textInSubView}>
						<Text style={styles.label}>First Name</Text>
						<TextInput name="first_name" value={state.first_name} editable={enable} onChangeText={(text) => handleChange(text, 'first_name')} style={enable&&styles.textInput}/>
					</View>
					<View style={styles.textInSubView}>
						<Text style={styles.label}>Last Name</Text>
						<TextInput name="last_name" value={state.last_name} editable={enable} onChangeText={(text) => handleChange(text, 'last_name')} style={enable&&styles.textInput}/>
					</View>
					<View style={styles.textInSubView}>
						<Text style={styles.label}>Email</Text>
						<TextInput name="email" value={state.email} editable={enable} onChangeText={(text) => handleChange(text, 'email')} style={enable&&styles.textInput}/>
					</View>
					<Pressable onPress={handleUpdate} style={styles.button}><Text>Save</Text></Pressable>
				</View>
			</View>
		</>
	)
}
export default Profile;