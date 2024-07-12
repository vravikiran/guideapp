import React, { useState } from "react";

import { useAppState } from "../state";
import { View, Text, TextInput, Pressable } from "react-native";
import { Dropdown } from "react-native-element-dropdown";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { DatePickerModal } from "react-native-paper-dates";
import moment from "moment/moment";
import ListOfRequests from "./ListOfRequests";
const Requests = ({navigation}) => {
	const { styles,state } = useAppState();
	const params = new URLSearchParams({});
	const [status, setStatus] = useState('');
	const [result, setResult] = useState('');
	const [beginDate, setBeginDate] = useState(null);
	const [lastDate, setLastDate] = useState(null);
	const [open, setOpen] = useState(false);
	const statuses = [
		{ label: "New", value: "New" },
		{ label: "Accepted", value: "Accepted" },
		{ label: "In Progress", value: "InProgress" },
		{ label: "Declined", value: "Declined" },
		{ label: "Cancelled", value: "Cancelled" },
		{ label: "Completed", value: "Completed" }
	]
	const onSubmit = () => {
		params.append("status", status);
		if (beginDate != null) {
			params.append("startDate", moment(beginDate).format("YYYY-MM-DD"));
		}
		if (lastDate != null) {
			params.append("endDate", moment(lastDate).format("YYYY-MM-DD"))
		}
		console.log("Params:: " + params);
		fetch(`http://localhost:8080/requests/findByStatusAndDates?${params}`, {
			method: 'GET', headers: {
				'Content-Type': 'application/json',
			},
		}).then((response) => {
			if (response.ok) {
				return response.json()
			}
		}).then((response) => {
			console.log(response)
			setResult(response)
		})
	}
	const onDismiss = () => {
		setOpen(false)
	}
	const onOpen = () => {
		setOpen(true)
	}
	const onConfirm = ({ startDate, endDate }) => {
		console.log(startDate)
		console.log(endDate)
		setBeginDate(startDate)
		setLastDate(endDate)
	}

	const handleReset = () => {
		setLastDate(null)
		setBeginDate(null)
		setStatus(null)
		setResult('')
	}

	return (
			<View style={styles.compView}>
				<Text>Requests For {state.first_name} {state.last_name}</Text>
				<View style={styles.textInSubView}>
					<Text style={{ alignItems: 'flex-start', width: "80px" }}>Status</Text>
					<View style={{ width: "120px" }}>
						<Dropdown
							labelField={"label"}
							data={statuses}
							valueField={"value"}
							value={status}
							onChange={item => { setStatus(item.value) }}
							//containerStyle={{ width: "120px" }}
							placeholder="Select status"
						/>
					</View>
				</View>
				<View style={styles.textInSubView}>
					<Text style={{ alignItems: 'flex-start', width: "80px" }}>Dates</Text>
					<View style={{ width: "120px" }}>
						<Pressable onPress={onOpen} mode="outlined" style={styles.button}><Text>Pick Dates</Text></Pressable>
						<SafeAreaProvider>
							<DatePickerModal
								visible={open}
								startDate={beginDate}
								endDate={lastDate}
								locale={{ format: "YYYY-MM-DD" }}
								mode="range"
								onDismiss={onDismiss}
								onConfirm={onConfirm}
								presentationStyle={"pageSheet"}
								dateFormat="YYYY-MM-DD"
							/>
						</SafeAreaProvider>
					</View>
				</View>
				<View style={styles.textInSubView}>
					<Pressable onPress={onSubmit} style={{
						backgroundColor: 'green',
						borderWidth: 1,
						width: "100px",
						alignItems: 'center',
						justifyContent: 'center'
					}}><Text>Search</Text></Pressable>
					<Pressable onPress={handleReset} style={styles.button}><Text>Reset</Text></Pressable>
				</View>
				<View style={{width:"30%"}}>
				{result.length != 0 && <ListOfRequests list={result} navigation={navigation}/>}
				</View>
			</View>
	)
}



export default Requests;