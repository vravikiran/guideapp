import { useAppState } from "../state"
import { Dropdown } from "react-native-element-dropdown"

const States = ({ value, onChange }) => {
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
	const { states,setLocations } = useAppState()
	return (
		<Dropdown
			data={states}
			valueField={"value"}
			labelField={"label"}
			value={value}
			onChange={(item) => { onChange(item.value), handleStateChange(item.value) }}
			containerStyle={{ width: "150px" }}
			placeholder="Select State"
			closeModalWhenSelectedItem={true}
			style={{ width: "150px" }}
		/>
	)
}
export default States;