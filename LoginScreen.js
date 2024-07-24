import React, { useState, useEffect } from "react";
import { View, TextInput, Pressable, Text } from 'react-native';
import { useAppState } from "./state";
import {BASE_URL} from '@env';

const LoginScreen = ({ navigation }) => {
	const [mobileNo, setMobileNo] = useState('');
	const [isStatus, setIsStatus] = useState(false);
	const [otp, setOtp] = useState('');
	const { state, setState, styles, setIsNew } = useAppState();
	const [errors, setErrors] = useState({});
	const [isFormValid, setIsFormValid] = useState(false);
	const [hasError, setHasError] = useState(false)
	const [timeLeft, setTimeLeft] = useState(60)
	let timer = () => { };

	useEffect(() => {
		validateForm();
	}, [mobileNo, otp]);

	useEffect(() => {
		setState({})
		setIsNew(true)
	}, [])

	const startTimer = () => {
		timer = setTimeout(() => {
			if (timeLeft <= 0) {
				clearTimeout(timer);
				return false;
			}
			setTimeLeft(timeLeft - 1);
		}, 1000)
	}

	useEffect(() => {
		startTimer();
		return () => clearTimeout(timer);
	});

	const start = () => {
		setTimeLeft(60);
		clearTimeout(timer);
		startTimer();
	}

	const validateForm = () => {
		let errors = {};
		if (mobileNo != '' && mobileNo.length < 10) {
			errors.mobileNo = 'Please enter valid ten digit mobile no.';
		}
		if (otp != '' && otp.length < 4) {
			errors.otp = 'please enter valid four digit otp'
		}
		setErrors(errors);
		setIsFormValid(Object.keys(errors).length === 0);
	};

	const validateNumber = () => {
		start()
		const params = new URLSearchParams({
			'mobileNo': mobileNo
		});
		if (isFormValid) {
			fetch(`${BASE_URL}/auth/generateOtp?${params}`, {
				method: 'GET', headers: {
					'Content-Type': 'application/json',
				},
			}).then((response) => {
				if (response.ok) {
					setIsStatus(true)
				}
			}).catch((error) => {
				console.error(error);
				return error;
			});
		}
	}

	const handleChange = (text) => {
		setMobileNo(text.replace(/[^0-9]/g, ''))
	}
	const validateOtp = async () => {
		var respStatus = 0;
		if (isFormValid) {
			const result = async () => {
				var user = await fetch(`${BASE_URL}/auth/validateOtp`, {
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
				})).catch((error) => {
					console.error(error);
					return error;
				});
				return user;
			}
			var data = await result('PromiseResult')
			if (respStatus === 200) {
				setState({ ...state, ...data })
				setIsNew(false)
				navigation.navigate('RequestsInfo')
			} else if (respStatus === 404) {
				navigation.navigate('Signup', { mobileNo: mobileNo })
			} else if (respStatus === 422) {
				console.log("invalid otp")
				setHasError(true)
			}
		}

	}

	const handleOtp = (text) => {
		setHasError(false)
		setOtp(text.replace(/[^0-9]/g, ''));
	}
	return (
		<View style={styles.compView}>
			<Text>Enter mobile Number</Text>
			<TextInput inputmode='numeric' placeholder="Enter Mobile Number" style={{ width: "25%", borderRadius: 5, borderWidth: 1 }}
				onChangeText={handleChange}
				maxLength={10} value={mobileNo}
				keyBoardType='numeric'
			/>
			{
				isStatus ? (
					<>
						<Text>Enter OTP</Text>
						<TextInput style={{ width: "25%", borderRadius: 5, borderWidth: 1 }} value={otp} onChangeText={handleOtp} maxLength={4} />
						<Pressable title="Validate" onPress={validateOtp} style={styles.button}><Text>Validate OTP</Text></Pressable>
						{hasError ? <Text style={{ width: "150px", alignConent: 'flex-end' }}>{'Entered otp is invalid'}</Text> : null}
						{Object.values(errors).map((error, index) => (
							<Text key={index}>
								{error}
							</Text>
						))}
						<View style={{
							flexDirection: 'row',
							columnGap: 10,
						}}>
							<Pressable title="Resend" onPress={validateNumber} style={styles.button} disabled={!(timeLeft === 0)}><Text>Resend OTP</Text></Pressable>
							<Text>after {timeLeft} seconds</Text>
						</View>
					</>
				) : (<View><Pressable title="submit" onPress={validateNumber} style={styles.button}><Text> submit</Text></Pressable></View>)
			}


		</View>
	);
}
export default LoginScreen;