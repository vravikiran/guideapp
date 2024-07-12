import React from "react";
import { useAppState } from "../state";
import { Dropdown } from "react-native-element-dropdown";
const Countries = ({ value, onChange }) => {
	const { countries,setStates } = useAppState();
	const handleCountryChange = (item) => {
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
		console.log(params.get('country_id'))
	}
	return (
		<Dropdown
			data={countries}
			valueField={"value"}
			labelField={"label"}
			value={value}
			onChange={(item) => { onChange(item.value), handleCountryChange(item.value) }}
			containerStyle={{ width: "150px" }}
			placeholder="Select Country"
			closeModalWhenSelectedItem={true}
			style={{ width: "150px" }}
		/>
	)
}
export default Countries;