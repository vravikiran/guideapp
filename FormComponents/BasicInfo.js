import React, { useState } from "react";
import { View, Text, TextInput, Pressable, Image, Platform } from "react-native";
import { useAppState } from "../state";
import { Controller, useForm } from "react-hook-form";
import Ionicons from '@expo/vector-icons/Ionicons';
import { IconButton } from 'react-native-paper'
import * as ImagePicker from 'expo-image-picker'
import {BASE_URL} from '@env';

const BasicInfo = ({ navigation, route }) => {
	const { state, setState, styles, isNew } = useAppState();
	const [enable, setEnable] = useState(false)
	const mobileNo = isNew ? route.params.mobileNo : state.mobile_no
	const [imageSource, setImageSource] = useState(null);
	const { control, handleSubmit, formState: { errors } } = useForm({ defaultValues: state })
	const onSubmit = (data) => {
		data.mobile_no = mobileNo
		setState(data)
		navigation.navigate('Address')
	}

	const handleUpdate = (data) => {
		setState(data)
		fetch(`${BASE_URL}/user`, {
			method: "PATCH",
			body: JSON.stringify(data),
			headers: {
				'Content-Type': 'application/json'
			}
		}).then((response) => {
			if (response.ok) {
				return response.json()
			}
		}).then((response) => {
			console.log(response)
			setEnable(false)
			console.log("User updated successfully")
		})
	}

	const handleEdit = () => {
		setEnable(true)
	}

	const selectImage = async () => {
		let result = await ImagePicker.launchImageLibraryAsync({
			mediaTypes: ImagePicker.MediaTypeOptions.Images,
			allowsEditing: true,
			aspect: [4, 3],
			quality: 1
		})
		if (result.canceled) {
			console.log('User cancelled image picker');
		} else {
			if (Platform.OS === 'web') {
				setImageSource(result.assets[0].uri)
				fetch(`${BASE_URL}/user/upload`, {
					method: "POST",
					body: result.assets[0].uri
				}).then(response => {
					if (response.ok)
						console.log('Image uploaded successfully');
				}).catch(
					(e) => {
						console.error("Error occured while uploading profile pic", e)
					}
				)
			} else {
				let formData = new FormData();
				setImageSource(result.assets[0].uri)
				formData.append('photo', {
					uri:result.assets[0].uri,
					name:result.assets[0].fileName,
					type:result.assets[0].mimeType
				});
				fetch(`${BASE_URL}/user/uploadFromMobile`, {
					method: "POST",
					body: formData,
					headers:{
						'Accept': 'application/json',
						'Content-Type':'multipart/form-data'
					}
				}).then(response => {
					if (response.ok) {
						console.log('Image uploaded successfully from mobile')
					}
				}).catch((e) => {
					console.log("Error occurred while uploading pic from mobile", e)
				})
			}
		}
	}

	const handleCancel = () => {
		setEnable(false)
	}
	return (
		<View style={{
			flex: 1,
			backgroundColor: "#ffc2c2",
			rowGap: 10,
			flexDirection: 'column',
		}}>
			{
				(!isNew && !enable) ? (
					<View>
						<View style={{ alignItems: 'flex-end' }} >
							<IconButton icon="pencil" onPress={handleEdit} />
						</View>
						<View style={{
							backgroundColor: "#ffc2c2",
							rowGap: 10,
							flexDirection: 'column',

						}}>
							<View>
								<Text>Profile Details</Text>
							</View>
							<View style={{ flexDirection: 'row', alignContent: 'center', cloumnGap: 10 }}>
								<Text style={{ width: "35%" }}>First Name</Text>
								<View style={{ width: "55%" }}>
									<Text >{state.first_name}</Text>
								</View>
							</View>
							<View style={{ flexDirection: 'row', alignItems: 'center', cloumnGap: 10 }}>
								<Text style={{ width: "35%" }}>Last Name</Text>
								<View style={{ width: "55%" }}>
									<Text>{state.last_name}</Text>
								</View>
							</View>
							<View style={{ flexDirection: 'row', alignItems: 'center', cloumnGap: 10 }}>
								<Text style={{ width: "35%" }}>Email</Text>
								<View style={{ width: "55%" }}>
									<Text>{state.email}</Text>
								</View>
							</View>
						</View>
					</View>
				) :
					(<View style={{ rowGap: 10 }}>
						<View style={{
							backgroundColor: "#ffc2c2",
							rowGap: 10,
							flexDirection: 'column'
						}}>
							{isNew ? <Text style={{ alignItems: 'center' }}>Complete the SignUp Form</Text> : <Text>Profile Details</Text>}
							<View style={{ alignItems: 'center' }}>
								<Pressable onPress={selectImage}>
									{imageSource ? <Image source={{ uri: imageSource }} style={{ width: 100, height: 100 }}  disabled={true}/> : <Ionicons name="image" size={150} />}
								</Pressable>
							</View>
							<View style={{ flexDirection: 'row', alignItems: 'center', cloumnGap: 10 }}>
								<Text style={{ width: "35%" }}>First Name</Text>
								<View style={{ width: "55%" }}>
									<Controller name={'first_name'} control={control} defaultValue={state.first_name} render={({ field: { value, onChange } }) => (
										<TextInput value={value} onChangeText={onChange} style={{ borderWidth: 1, borderRadius: 5 }} />
									)} rules={{
										required: {
											value: true,
											message: 'First Name is required'
										},
										pattern: {
											value: /^[A-Za-z_][\w ]+$/,
											message: "Please Enter alphabets only",
										}
									}}>
									</Controller>
									{
										errors['first_name']?.message &&
										<Text>	{
											errors['first_name']?.message}</Text>

									}
								</View>
							</View>
							<View style={{ flexDirection: 'row', alignItems: 'center', cloumnGap: 10 }}>
								<Text style={{ width: "35%" }}>Last Name</Text>
								<View style={{ width: "55%" }}>
									<Controller name={'last_name'} control={control} defaultValue={state.last_name} render={({ field: { value, onChange } }) => (
										<TextInput value={value} onChangeText={onChange} style={{ borderWidth: 1, borderRadius: 5 }} />
									)} rules={{
										required: {
											value: true,
											message: 'Last Name is required'
										},
										pattern: {
											value: /^[A-Za-z_][\w ]+$/,
											message: "Please Enter alphabets only",
										}
									}}>
									</Controller>
									{
										errors['last_name']?.message &&
										<Text>	{
											errors['last_name']?.message}</Text>

									}
								</View>
							</View>
							<View style={{ flexDirection: 'row', alignItems: 'center', cloumnGap: 10 }}>
								<Text style={{ width: "35%" }}>Email</Text>
								<View style={{ width: "55%" }}>
									<Controller name={'email'} control={control} defaultValue={state.email} render={({ field: { value, onChange } }) => (
										<TextInput value={value} onChangeText={onChange} style={{ borderWidth: 1, borderRadius: 5 }} />
									)} rules={{
										required: {
											value: true,
											message: "please enter email"
										},
										pattern: {
											value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
											message: 'Please enter valid email.'
										}
									}}>
									</Controller>
									{
										errors['email']?.message &&
										<Text>	{
											errors['email']?.message}</Text>

									}
								</View>
							</View>
							{isNew &&
								<View style={{ flexDirection: 'row', alignItems: 'center', cloumnGap: 10 }}>
									<Text style={{ width: "35%" }}>Aadhar Number</Text>
									<View style={{ width: "55%" }}>
										<Controller name={'aadhar_number'} control={control} defaultValue={state.aadhar_number} render={({ field: { value, onChange } }) => (
											<TextInput value={value}  onChangeText={onChange} style={{ borderWidth: 1, borderRadius: 5 }} maxLength={12}/>
										)} rules={{
											required: {
												value: true,
												message: 'Please enter aadhaar number'
											},
											pattern: {
												value: /^\d+$/,
												message: "Please enter numbers only"
											},
											minLength: {
												value: 12,
												message: "Please enter valid aadhar number"
											}
										}}>
										</Controller>
										{
											errors['aadhar_number']?.message &&
											<Text>	{
												errors['aadhar_number']?.message}</Text>

										}
									</View>
								</View>
							}
						</View>

						{
							isNew ?
								<View style={{ alignItems: 'center' }}>
									<Pressable onPress={handleSubmit(onSubmit)} style={styles.button}><Text>Next</Text></Pressable>
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
					)
			}
		</View>
	)
}
export default BasicInfo;