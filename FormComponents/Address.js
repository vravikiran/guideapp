import { useAppState } from "../state"
import React, { useState, useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { Pressable, TextInput, View, Text } from "react-native";
import { IconButton } from 'react-native-paper'
import { Dropdown } from "react-native-element-dropdown";

const Address = ({ navigation }) => {
	const { state, setState, styles, isNew, setIsNew, countries } = useAppState();
	const { control, handleSubmit, formState: { errors } } = useForm({ defaultValues: state });
	const [enable, setEnable] = useState(false)
	const [states, setStates] = useState([])
	const [locations, setLocations] = useState([]);

	const handlePress = (data) => {
		data.address.city = locations[data.address.city_id - 1].label
		data.address.state = states[data.address.state_id - 1].label
		data.address.country = countries[data.address.country_id - 1].label
		fetch('http://localhost:8080/user', {
			method: "POST",
			body: JSON.stringify(data),
			headers: {
				'Content-Type': 'application/json'
			}
		}).then((response) => {
			if (response.ok) {
				return response.json()
			}
		}).then((response) => {
			setIsNew(false)
			data.address.address_id = response.address.address_id;
			setState({ ...state, ...data })
			console.log(JSON.stringify(states))
			navigation.navigate('RequestsInfo')
			console.log("User created successfully")
		})
	}

	useEffect(
		() => {
			console.log(JSON.stringify(states))
			console.log(JSON.stringify(locations))
			if (!isNew) {
				handleCountryChange(state.address.country_id)
				handleStateChange(state.address.state_id)
			}
		}, []
	)

	const handleCountryChange = (item) => {
		console.log(JSON.stringify(item))
		const params = new URLSearchParams({
			'country_id': item
		});
		fetch(`http://localhost:8080/locations/statesByCountry?${params}`, {
			method: 'GET', headers: {
				'Content-Type': 'application/json',
			},
		}).then((response) => {
			if (response.ok) {
				return response.json()
			}
		}).then(data => {
			const info = []
			data.map(item => {
				info.push({ "label": item.state, "value": item.state_id })
			})
			setStates(info)
		})
	}

	const handleStateChange = (item) => {
		console.log("state", item)
		const params = new URLSearchParams({
			'state_id': item
		});
		fetch(`http://localhost:8080/locations?${params}`, {
			method: 'GET', headers: {
				'Content-Type': 'application/json',
			},
		}).then((response) => {
			if (response.ok) {
				return response.json()
			}
		}).then(data => {
			const info = []
			data.map(item => {
				info.push({ "label": item.location, "value": item.location_id })
			})
			setLocations(info)
		})
	}

	const handleEdit = () => {
		setEnable(true)
	}
	
	const handleCancel = () => {
		setEnable(false)
	}

	const handleUpdate = (data) => {
		data.address.city = locations[data.address.city_id - 1].label
		data.address.state = states[data.address.state_id - 1].label
		data.address.country = countries[data.address.country_id - 1].label
		fetch('http://localhost:8080/address', {
			method: "PUT",
			body: JSON.stringify(data.address),
			headers: {
				'Content-Type': 'application/json'
			}
		})
			.then(
				(response) => {
					if (response.ok) {
						console.log("Address updated successfully")
						setState(data)
						setEnable(false)
					}
				}
			)
	}

	return (
		<View>
			{!isNew &&
				<View style={{ alignItems: 'flex-end' }} >
					<IconButton icon="pencil" onPress={handleEdit} />
				</View>
			}
			<View style={styles.compView}>
				<Text>Enter Address Details</Text>
				<View style={styles.textInSubView}>
					<View style={styles.label}>
						<Text>Address Line 1</Text>
					</View>
					{(isNew || enable) ?
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
						</View> :
						<View>
							<Text style={styles.label}>{state.address.address_line1}</Text>
						</View>
					}
				</View>
				<View style={styles.textInSubView}>
					<View style={styles.label}>
						<Text>Address Line 2</Text>
					</View>
					{(isNew || enable) ?
						<View>
							<Controller control={control} name={'address.address_line2'} defaultValue={''} render={({ field: { value, onChange } }) => (
								<TextInput value={value} onChangeText={onChange} style={styles.textInput} />
							)}
							/>
						</View> :
						<View>
							<Text style={styles.label}>{state.address.address_line2}</Text>
						</View>
					}
				</View>

				<View style={styles.textInSubView}>
					<View style={styles.label}>
						<label>Country</label>
					</View>
					{(isNew || enable) ?
						<View>
							<Controller control={control} name={'address.country_id'} defaultValue={''} render={({ field: { value, onChange } }) => (
								<Dropdown
									data={countries}
									valueField={"value"}
									labelField={"label"}
									value={!isNew ? countries[state.address.country_id - 1] : value}
									onChange={(item) => { onChange(item.value), handleCountryChange(item.value) }}
									containerStyle={{ width: "230px" }}
									placeholder="Select Country"
									closeModalWhenSelectedItem={true}
									style={{ width: "230px" }}
								/>
							)} rules={{
								required: {
									value: 'true',
									message: 'Please select Country'
								}
							}}
							/>
							{errors.address?.country_id?.message && <Text> {errors.address?.country_id?.message}</Text>}
						</View> :
						<View>
							<Text style={styles.label}>{state.address.country}</Text>
						</View>
					}
				</View>

				<View style={styles.textInSubView}>
					<View style={styles.label}>
						<Text>State</Text>
					</View>
					{(isNew || enable) ?
						<View>
							<Controller control={control} name={'address.state_id'} defaultValue={''} render={({ field: { value, onChange } }) => (
								<Dropdown
									data={states}
									valueField={"value"}
									labelField={"label"}
									value={!isNew ? states[state.address.state_id - 1] : value}
									onChange={(item) => { onChange(item.value), handleStateChange(item.value) }}
									containerStyle={{ width: "230px" }}
									placeholder="Select State"
									closeModalWhenSelectedItem={true}
									style={{ width: "230px" }}
								/>
							)} rules={{
								required: {
									value: 'true',
									message: 'Please select State'
								}
							}}
							/>
							{errors.address?.state_id?.message && <Text>{errors.address?.state_id?.message}</Text>}
						</View> :
						<View style={styles.label}>
							<Text>{state.address.state}</Text>
						</View>
					}
				</View>

				<View style={styles.textInSubView}>
					<View style={styles.label}>
						<Text>City</Text>
					</View>
					{(isNew || enable) ?
						<View>
							<Controller control={control} name={'address.city_id'} defaultValue={''} render={({ field: { value, onChange } }) => (
								<Dropdown
									data={locations}
									valueField={"value"}
									labelField={"label"}
									value={!isNew ? locations[state.address.city_id - 1] : value}
									onChange={(item) => onChange(item.value)}
									containerStyle={{ width: "230px" }}
									placeholder="Select City"
									closeModalWhenSelectedItem={true}
									style={{ width: "230px" }}
									itemTextStyle={{ alignItems: 'center' }}
								/>
							)} rules={{
								required: {
									value: 'true',
									message: 'Please select City'
								}
							}}
							/>
							{errors.address?.city_id?.message && <Text> {errors.address?.city_id?.message}</Text>}
						</View>
						: <View>
							<Text style={styles.label}>
								{state.address.city}
							</Text>
						</View>
					}
				</View>

				<View style={styles.textInSubView}>
					<View style={styles.label}>
						<Text>PinCode</Text>
					</View>
					{(isNew || enable) ?
						<View>
							<Controller control={control} name={'address.pincode'} defaultValue={''} render={({ field: { value, onChange } }) => (
								<TextInput value={value} onChangeText={onChange} style={styles.textInput} maxLength='6' />
							)}
								rules={{
									required: {
										value: true,
										message: 'Please enter valid pincode'
									},
									pattern: {
										value: /^\d+$/,
										message: "Please enter numbers only"
									},
									minLength: {
										value: 6,
										message: "Please enter valid pincode"
									}
								}}
							/>
							{errors.address?.pincode?.message && <Text>{errors.address?.pincode?.message}</Text>}
						</View> :
						<View>
							<Text style={styles.label}>{state.address.pincode}</Text>
						</View>
					}
				</View>
				{
					isNew ?
						<Pressable onPress={handleSubmit(handlePress)} style={styles.button} ><Text>Submit</Text></Pressable>
						: (enable &&
							(<View style={{ flexDirection: 'row', columnGap: "10px" }}>
								<Pressable onPress={handleSubmit(handleUpdate)} style={styles.button}><Text>Save</Text> </Pressable>
								<Pressable onPress={handleSubmit(handleCancel)} style={styles.button}><Text>Cancel</Text></Pressable>
							</View>
							)
						)
				}
			</View>
		</View>
	);
}
export default Address;