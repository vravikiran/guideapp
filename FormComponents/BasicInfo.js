import React, { useState } from "react";
import { View, Text, TextInput, Pressable, Image } from "react-native";
import { useAppState } from "../state";
import { Controller, useForm } from "react-hook-form";
import { launchImageLibrary } from 'react-native-image-picker';
import Ionicons from '@expo/vector-icons/Ionicons';

const BasicInfo = ({ navigation, route }) => {
	const mobileNo = route.params.mobileNo;
	const { state, setState, styles } = useAppState();
	const [imageSource, setImageSource] = useState(null);
	const { control, handleSubmit, formState: { errors } } = useForm({ defaultValues: state })
	const onSubmit = (data) => {
		data.mobile_no = mobileNo
		setState({ ...state, ...data })
		navigation.navigate('Address')
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

	return (
		<View style={styles.compView}>
			<Text>Complete the SignUp Form</Text>
			<View style={{ alignItems: 'center' }}>
				<Pressable onPress={selectImage}>
					{imageSource ? <Image source={{ uri: imageSource }} style={{ width: 100, height: 100 }} /> : <Ionicons name="image" size={150} />}
				</Pressable>
			</View>
			<View style={styles.textInSubView}>
				<View style={styles.label}>
					<Text>First Name</Text>
				</View>
				<View>
					<Controller name={'first_name'} control={control} defaultValue={''} render={({ field: { value, onChange } }) => (
						<TextInput value={value} onChangeText={onChange} style={styles.textInput} />
					)} rules={{
						required: {
							value: true,
							message: 'First Name is required'
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
			<View style={styles.textInSubView}>
				<View style={styles.label}>
					<Text>Last Name</Text>
				</View>
				<View>
					<Controller name={'last_name'} control={control} defaultValue={''} render={({ field: { value, onChange } }) => (
						<TextInput value={value} onChangeText={onChange} style={styles.textInput} />
					)}
						rules={{
							required: {
								value: true,
								message: 'Last Name is required'
							}
						}}
					>
					</Controller>
					{
						errors['last_name']?.message &&
						<Text>	{
							errors['last_name']?.message}</Text>

					}
				</View>
			</View>
			<View style={styles.textInSubView}>
				<View style={styles.label}>
					<Text>Email</Text>
				</View>
				<View>
					<Controller name={'email'} control={control} defaultValue={''} render={({ field: { value, onChange } }) => (
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
				</View>
			</View>
			<View style={styles.textInSubView}>
				<View style={styles.label}>
					<Text>Aadhar Number</Text>
				</View>
				<View>
					<Controller name={'aadhar_number'} control={control} defaultValue={''} render={({ field: { value, onChange } }) => (
						<TextInput value={value} onChangeText={onChange} style={styles.textInput} />
					)}
						rules={{
							required: {
								value: true,
								message: 'Please enter aadhaar number'
							},
							pattern: {
								value: /^\d+$/,
								message: "Please enter numbers only"
							}
						}}
					>
					</Controller>
					{
						errors['aadhar_number']?.message &&
						<Text>	{
							errors['aadhar_number']?.message}
						</Text>
					}
				</View>
			</View>
			<Pressable onPress={handleSubmit(onSubmit)} style={styles.button}>Next</Pressable>
		</View>
	)
}
export default BasicInfo;