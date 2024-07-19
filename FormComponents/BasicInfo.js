import React, { useState } from "react";
import { View, Text, TextInput, Pressable, Image } from "react-native";
import { useAppState } from "../state";
import { Controller, useForm } from "react-hook-form";
import { launchImageLibrary } from 'react-native-image-picker';
import Ionicons from '@expo/vector-icons/Ionicons';
import { IconButton } from 'react-native-paper'

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
		console.log(JSON.stringify(data))
		setState(data)
		fetch('http://192.168.1.7:8080/user', {
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
		const options = {
			mediaType: 'photo',
			type: 'library',
			includeBase64: false,
			maxHeight: 1000,
			maxWidth: 2000,
		};

		launchImageLibrary(options, (response) => {
			if (response.didCancel) {
				console.log('User cancelled image picker');
			} else if (response.error) {
				console.log('Image picker error: ', response.error);
			} else {
				setImageSource(response.assets[0].uri)
				fetch("http://localhost:8080/user/upload", {
					method: "POST",
					body: response.assets[0].uri
				}).then(response => {
					if (response.ok)
						console.log('Image uploaded successfully');
				})
			}
		});
	}

	const handleCancel = () => {
		setEnable(false)
	}

	return (
		<View>
			{!isNew &&
				<View style={{ alignItems: 'flex-end' }} >
					<IconButton icon="pencil" onPress={handleEdit} />
				</View>
			}
			<View style={styles.compView}>
				{isNew ?<Text>Complete the SignUp Form</Text>: <Text>Profile Details</Text>}
				<View style={{ alignItems: 'center' }}>
					<Pressable onPress={selectImage}>
						{imageSource ? <Image source={{ uri: imageSource }} style={{ width: 100, height: 100 }} /> : <Ionicons name="image" size={150} />}
					</Pressable>
				</View>
				<View style={styles.textInSubView}>
					<View style={styles.label}>
						<Text>First Name</Text>
					</View>
					{(isNew || enable) ?
						<View>
							<Controller name={'first_name'} control={control} defaultValue={state.first_name} render={({ field: { value, onChange } }) => (
								<TextInput value={value} onChangeText={onChange} style={styles.textInput} />
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
						:
						<View>
							<Text style={styles.label}>{state.first_name}</Text>
						</View>
					}
				</View>
				<View style={styles.textInSubView}>
					<View style={styles.label}>
						<Text>Last Name</Text>
					</View>
					{(isNew || enable) ?
						<View>
							<Controller name={'last_name'} control={control} defaultValue={state.last_name} render={({ field: { value, onChange } }) => (
								<TextInput value={value} onChangeText={onChange} style={styles.textInput} />
							)}
								rules={{
									required: {
										value: true,
										message: 'Last Name is required'
									},
									pattern: {
										value: /^[A-Za-z][\w ]+$/,
										message: "Please Enter alphabets only",
									}
								}}
							>
							</Controller>
							{
								errors['last_name']?.message &&
								<Text>	{
									errors['last_name']?.message}</Text>

							}
						</View> :
						<View><Text style={styles.label}>{state.last_name}</Text></View>
					}
				</View>
				<View style={styles.textInSubView}>
					<View style={styles.label}>
						<Text>Email</Text>
					</View>
					{(isNew || enable) ?
						<View>
							<Controller name={'email'} control={control} defaultValue={state.email} render={({ field: { value, onChange } }) => (
								<TextInput value={value} onChangeText={onChange} style={styles.textInput} />
							)}
								rules={{
									required: {
										value: true,
										message: "please enter email"
									},
									pattern: {
										value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
										message: 'Please enter valid email.'
									}
								}}
							>
							</Controller>
							{
								errors['email']?.message &&
								<Text>	{
									errors['email']?.message}</Text>

							}
						</View> :
						<View><Text style={styles.label}>{state.email}</Text></View>
					}
				</View>
				{isNew &&
					<View style={styles.textInSubView}>
						<View style={styles.label}>
							<Text>Aadhar Number</Text>
						</View>
						<View>
							<Controller name={'aadhar_number'} control={control} defaultValue={state.aadhar_number} render={({ field: { value, onChange } }) => (
								<TextInput value={value} onChangeText={onChange} style={styles.textInput} maxLength={12} />
							)}
								rules={{
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
								}}
							>
							</Controller>
							{
								errors['aadhar_number']?.message &&
								<Text style={styles.label}>	{
									errors['aadhar_number']?.message}
								</Text>
							}
						</View>
					</View>
				}

				{
					isNew ?
						<Pressable onPress={handleSubmit(onSubmit)} style={styles.button}><Text>Next</Text></Pressable>
						:
						(enable &&
							(<View style={{ flexDirection: 'row', columnGap:"10px" }}>
								<Pressable onPress={handleSubmit(handleUpdate)} style={styles.button}><Text>Save</Text></Pressable>
								<Pressable onPress={handleSubmit(handleCancel)} style={styles.button}><Text>Cancel</Text></Pressable>
							</View>
							)
						)
				}
			</View>
		</View>
	)
}
export default BasicInfo;