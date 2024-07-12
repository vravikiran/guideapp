import React from "react";
import { Dropdown } from "react-native-element-dropdown";
import { useAppState } from "../state";
const Locations = ({value,onChange}) =>{
	const {locations} = useAppState()
	return(
		<Dropdown
							data={locations}
							valueField={"value"}
							labelField={"label"}
							value={value}
							onChange={(item) => onChange(item.value)}
							containerStyle={{ width: "150px" }}
							placeholder="Select City"
							closeModalWhenSelectedItem={true}
							style={{ width: "150px" }}
							itemTextStyle={{ alignItems: 'center' }}
						/>
	);
}
export default Locations;