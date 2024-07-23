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

	const handleCreateUser = (data) => {
		data.address.city = locations[data.address.city_id - 1].label
		data.address.state = states[data.address.state_id - 1].label
		data.address.country = countries[data.address.country_id - 1].label
		setState({ ...state, ...data })
		fetch('http://192.168.1.7:8080/user', {
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
			console.log('in response')
			setIsNew(false)
			data.address.address_id = response.address.address_id;
			console.log("state in create method",JSON.stringify(state))
			console.log("data in create method",JSON.stringify(data))
			navigation.navigate('RequestsInfo')
			console.log("User created successfully")
		})
	}

	useEffect(
		() => {
			console.log(JSON.stringify(state))
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
		fetch(`http://192.168.1.7:8080/locations/statesByCountry?${params}`, {
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
		fetch(`http://192.168.1.7:8080/locations?${params}`, {
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
		console.log(JSON.stringify(state))
		setEnable(true)
	}

	const handleCancel = () => {
		setEnable(false)
	}

	const handleUpdate = (data) => {
		data.address.city = locations[data.address.city_id - 1].label
		data.address.state = states[data.address.state_id - 1].label
		data.address.country = countries[data.address.country_id - 1].label
		fetch('http://192.168.1.7:8080/address', {
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
		<View style={{
			flex: 1,
			backgroundColor: "#ffc2c2",
			rowGap: 10,
			flexDirection: 'column',
		}}>
			{(isNew || enable) ? (
				<View style={{ rowGap: 10 }}>
					<View style={{
						backgroundColor: "#ffc2c2",
						rowGap: 10,
						flexDirection: 'column'
					}}>
						{isNew ? <Text style={{ alignItems: 'center' }}>Provide the Address Details</Text> : <Text>Update Address Details</Text>}
						<View style={{ flexDirection: 'row', alignItems: 'center', cloumnGap: 10 }}>
							<Text style={{ width: "35%" }}>Address Line 1</Text>
							<View style={{ width: "55%" }}>
								<Controller control={control} name={'address.address_line1'} defaultValue={''}
									render={({ field: { value, onChange } }) => (
										<TextInput value={value} onChangeText={onChange} style={{ borderRadius: 5, borderWidth: 1 }} />
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
						<View style={{ flexDirection: 'row', alignItems: 'center', cloumnGap: 10 }}>
							<Text style={{ width: "35%" }}>Address Line 2</Text>
							<View style={{ width: "55%" }}>
								<Controller control={control} name={'address.address_line2'} defaultValue={''}
									render={({ field: { value, onChange } }) => (
										<TextInput value={value} onChangeText={onChange} style={{ borderRadius: 5, borderWidth: 1 }} />
									)} rules={{
										required: {
											value: true,
											message: 'Address Line 2 is required'
										}
									}}>
								</Controller>
								{errors.address?.address_line2?.message && <Text> {errors.address?.address_line2?.message}</Text>}
							</View>
						</View>
						<View style={{ flexDirection: 'row', alignItems: 'center', cloumnGap: 10 }}>
							<Text style={{ width: "35%" }}>PinCode</Text>
							<View style={{ width: "55%" }}>
								<Controller control={control} name={'address.pincode'} defaultValue={''} render={({ field: { value, onChange } }) => (
									<TextInput value={value} onChangeText={onChange} style={{ borderRadius: 5, borderWidth: 1 }} maxLength={6} />
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
									}}>
								</Controller>
								{errors.address?.pincode?.message && <Text>{errors.address?.pincode?.message}</Text>}
							</View>
						</View>
						<View style={{ flexDirection: 'row', alignItems: 'center', cloumnGap: 10 }}>
							<Text style={{ width: "35%" }}>Country</Text>
							<View style={{ width: "55%" }}>
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
							</View>
						</View>
						<View style={{ flexDirection: 'row', alignItems: 'center', cloumnGap: 10 }}>
							<Text style={{ width: "35%" }}>State</Text>
							<View style={{ width: "55%" }}>
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
							</View>
						</View>
						<View style={{ flexDirection: 'row', alignItems: 'center', cloumnGap: 10 }}>
							<Text style={{ width: "35%" }}>City</Text>
							<View style={{ width: "55%" }}>
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
								{errors.address?.city_id?.message && <Text>{errors.address?.city_id?.message}</Text>}
							</View>
						</View>
						<View style={{ alignItems: 'center' }}>
							{
								isNew ?
									<View>
										<Pressable onPress={handleSubmit(handleCreateUser)} style={styles.button}><Text>Submit</Text></Pressable>
									</View>
									:
									(enable &&
										(<View style={{ flexDirection: 'row', alignItems: 'center', columnGap: 10 }}>
											<Pressable onPress={handleSubmit(handleUpdate)} style={styles.button}><Text>Save</Text></Pressable>
											<Pressable onPress={handleSubmit(handleCancel)} style={styles.button}><Text>Cancel</Text></Pressable>
										</View>
										)
									)
							}
						</View>
					</View>
				</View>
			) : (
				<View>
					<View style={{ alignItems: 'flex-end' }} >
						<IconButton icon="pencil" onPress={handleEdit} />
					</View><View>
						<Text>Address Details</Text>
					</View>
					<View style={{ flexDirection: 'row', alignContent: 'center', cloumnGap: 10 }}>
						<Text style={{ width: "35%" }}>Address Line 1</Text>
						<View style={{ width: "55%" }}>
							<Text >{state.address.address_line1}</Text>
						</View>
					</View>
					<View style={{ flexDirection: 'row', alignContent: 'center', cloumnGap: 10 }}>
						<Text style={{ width: "35%" }}>Address Line 2</Text>
						<View style={{ width: "55%" }}>
							<Text >{state.address.address_line2}</Text>
						</View>
					</View>
					<View style={{ flexDirection: 'row', alignContent: 'center', cloumnGap: 10 }}>
						<Text style={{ width: "35%" }}>City</Text>
						<View style={{ width: "55%" }}>
							<Text >{state.address.city}</Text>
						</View>
					</View>
					<View style={{ flexDirection: 'row', alignContent: 'center', cloumnGap: 10 }}>
						<Text style={{ width: "35%" }}>State</Text>
						<View style={{ width: "55%" }}>
							<Text >{state.address.state}</Text>
						</View>
					</View>
					<View style={{ flexDirection: 'row', alignContent: 'center', cloumnGap: 10 }}>
						<Text style={{ width: "35%" }}>Country</Text>
						<View style={{ width: "55%" }}>
							<Text >{state.address.country}</Text>
						</View>
					</View>
					<View style={{ flexDirection: 'row', alignContent: 'center', cloumnGap: 10 }}>
						<Text style={{ width: "35%" }}>Pincode</Text>
						<View style={{ width: "55%" }}>
							<Text >{state.address.pincode}</Text>
						</View>
					</View>
				</View>
			)
			}
		</View>
	)
}
export default Address;