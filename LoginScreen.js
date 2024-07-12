import React, { useState, useEffect } from "react";
import { View, TextInput, Pressable, Text } from 'react-native';
import { useAppState } from "./state";
const LoginScreen = ({ navigation }) => {
	const [mobileNo, setMobileNo] = useState('');
	const [isStatus, setIsStatus] = useState(false);
	const [otp, setOtp] = useState('');
	const { state, setState, styles } = useAppState();
	const [errors, setErrors] = useState({});
	const [isFormValid, setIsFormValid] = useState(false);

	useEffect(() => {
		validateForm();
	}, [mobileNo, otp]);

	const validateForm = () => {
		let errors = {};
		if (mobileNo != '' && mobileNo.length < 10) {
			errors.mobileNo = 'Please enter valid ten digit mobile no.';
		}
		setErrors(errors);
		setIsFormValid(Object.keys(errors).length === 0);
	};

	const validateNumber = () => {
		const params = new URLSearchParams({
			'mobileNo': mobileNo
		});
		if (isFormValid) {
			fetch(`http://localhost:8080/auth/generateOtp?${params}`, {
				method: 'GET', headers: {
					'Content-Type': 'application/json',
				},
			}).then((response) => {
				if (response.ok) {
					setIsStatus(true)
				}
			})
		}
	}

	const handleChange = (text) => {
		setMobileNo(text.replace(/[^0-9]/g, ''))
	}
	const validateOtp = async () => {
		var respStatus = 0;
		if (isFormValid) {
			const result = async () => {
				var user = await fetch("http://localhost:8080/auth/validateOtp", {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({ mobileNo: mobileNo, otp: otp })
				}).then((response => {
					respStatus = response.status
					if (response.status === 200) {
						return response.json()
					} else if (response.status === 422) {
						return response.text()
					}
				}));
				return user;
			}
			var data = await result('PromiseResult')
			if (respStatus === 200) {
				setState({ ...state, ...data })
				navigation.navigate('RequestsInfo')
			} else if (respStatus === 404) {
				navigation.navigate('Signup', { mobileNo: mobileNo })
			} else if (respStatus === 422) {
				console.log(data);
			}
		}

	}

	const handleOtp = (text) => {
		setOtp(text.replace(/[^0-9]/g, ''));
	}
	return (
		<View style={styles.compView}>
			<label>Enter mobile Number</label>
			<TextInput inputmode='numeric' placeholder="Enter Mobile Number" style={styles.textInput_main}
				onChangeText={handleChange}
				minLength='10'
				maxLength='10' value={mobileNo}
				keyBoardType='numeric'
			/>
			{
				isStatus ? (
					<>
						<label>Enter OTP</label><TextInput style={styles.textInput_main} value={otp} onChangeText={handleOtp} maxLength="4" />
						<Pressable title="Validate" onPress={validateOtp} style={styles.button}><Text>Validate OTP</Text></Pressable>
					</>
				)
					: (<Pressable title="submit" onPress={validateNumber} style={styles.button}><Text> submit</Text></Pressable>)
			}
			{Object.values(errors).map((error, index) => (
				<Text key={index} style={styles.text}>
					{error}
				</Text>
			))}
		</View>

	);
}
export default LoginScreen;