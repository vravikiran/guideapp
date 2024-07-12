import { useAppState } from "../state"
import React from "react";
import { Controller, useForm } from "react-hook-form";
import { Pressable, TextInput, View, Text } from "react-native";
import { Dropdown } from "react-native-element-dropdown";
import Countries from "./Countries";
import States from "./States";
import Locations from "./Locations";

const Address = ({ navigation }) => {
	const { state, setState, styles, countries, states,locations } = useAppState();
	const { control, handleSubmit, formState: { errors } } = useForm({ defaultValues: state });
	const handlePress = (data) => {
		data.address.country = countries[data.address.country - 1].label
		data.address.state = states[data.address.state - 1].label
		data.address.city = locations[data.address.city - 1].label
		setState({ ...state, ...data })
		fetch('http://localhost:8080/user', {
			method: "POST",
			body: JSON.stringify(data),
			headers: {
				'Content-Type': 'application/json'
			}
		})
			.then(
				(response) => {
					if (response.ok) {
						navigation.navigate('RequestsInfo', { profile: state })
					}
				}
			)
	}

	return (
		<View style={styles.compView}>
			<Text>Enter Address Details</Text>
			<View style={styles.textInSubView}>
				<View style={styles.label}>
					<Text>Address Line 1</Text>
				</View>
				<View>
					<Controller control={control} name={'address.address_line1'} defaultValue={''}
						render={({ field: { value, onChange } }) => (
							<TextInput value={value} onChangeText={onChange} style={styles.textInput} />
						)} rules={{
							required: {
								value: true,
								message: 'Address Line 1 is required'
							}
						}}>
					</Controller>
					{errors.address?.address_line1?.message && <Text> {errors.address?.address_line1?.message}</Text>}
				</View>
			</View>
			<View style={styles.textInSubView}>
				<View style={styles.label}>
					<Text>Address Line 2</Text>
				</View>
				<View>
					<Controller control={control} name={'address.address_line2'} defaultValue={''} render={({ field: { value, onChange } }) => (
						<TextInput value={value} onChangeText={onChange} style={styles.textInput} />
					)}
					/>
				</View>
			</View>

			<View style={styles.textInSubView}>
				<View style={styles.label}>
					<label>Country</label>
				</View>
				<View>
					<Controller control={control} name={'address.country'} defaultValue={''} render={({ field: { value, onChange } }) => (
						<Countries value={value} onChange={onChange} />
					)} rules={{
						required: {
							value: 'true',
							message: 'Please select Country'
						}
					}}
					/>
					{errors.address?.country?.message && <Text> {errors.address?.country?.message}</Text>}
				</View>
			</View>

			<View style={styles.textInSubView}>
				<View style={styles.label}>
					<Text>State</Text>
				</View>
				<View>
					<Controller control={control} name={'address.state'} defaultValue={''} render={({ field: { value, onChange } }) => (
						<States value={value} onChange={onChange} />
					)} rules={{
						required: {
							value: 'true',
							message: 'Please select State'
						}
					}}
					/>
					{errors.address?.state?.message && <Text>{errors.address?.state?.message}</Text>}
				</View>
			</View>

			<View style={styles.textInSubView}>
				<View style={styles.label}>
					<Text>City</Text>
				</View>
				<View>
					<Controller control={control} name={'address.city'} defaultValue={''} render={({ field: { value, onChange } }) => (
						<Locations value={value} onChange={onChange}/>
					)} rules={{
						required: {
							value: 'true',
							message: 'Please select City'
						}
					}}
					/>
					{errors.address?.city?.message && <Text> {errors.address?.city?.message}</Text>}
				</View>
			</View>

			<View style={styles.textInSubView}>
				<View style={styles.label}>
					<Text>PinCode</Text>
				</View>
				<View>
					<Controller control={control} name={'address.pincode'} defaultValue={''} render={({ field: { value, onChange } }) => (
						<TextInput value={value} onChangeText={onChange} style={styles.textInput} />
					)}
						rules={{
							required: {
								value: true,
								message: 'Please enter valid pincode'
							}
						}}
					/>
					{errors.address?.pincode?.message && <Text>{errors.address?.pincode?.message}</Text>}
				</View>
			</View>
			<Pressable onPress={handleSubmit(handlePress)} style={styles.button} ><Text>Submit</Text></Pressable>
		</View>
	);
}
export default Address;