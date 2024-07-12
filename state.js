import { createContext, useContext, useState,useEffect } from "react";
import { StyleSheet } from "react-native";

const AppStateContext = createContext({});
export const AppProvider = ({ children }) => {
	const [state, setState] = useState({})
	const [countries,setCountries]= useState()
	const [locations, setLocations] = useState([])
	const[states,setStates] = useState();
	const styles = StyleSheet.create({
		textInput_main: {
			borderWidth: 1,
			borderRadius: 5,
			width: "100px",
			alignItems: 'center'
		},
		textInput: {
			borderWidth: 1,
			borderRadius: 5,
			width: "150px"
		},
		button: {
			backgroundColor: 'green',
			borderWidth: 1,
			width: "100px",
			height: "20px",
			alignItems: 'center'
		},
		compView: {
			flex: 1,
			alignItems: "center",
			backgroundColor: "#ffc2c2",
			rowGap: "10px",
		},
		textInSubView: {
			flexDirection: 'row',
			alignItems: 'center',
			columnGap: '10px',
		},
		label: {
			width: "150px"
		}
	});
	useEffect(
		() => {
			fetch('http://localhost:8080/locations/countries')
				.then(response => response.json())
				.then(data => {
					const info = []
					data.map(item => {
						info.push({ "label": item.country, "value": item.country_id })
					})
					setCountries(info)
				})
		}, [])
	return (
		<AppStateContext.Provider value={{ state, setState, styles,countries,states,setStates,locations,setLocations }}>
			{children}
		</AppStateContext.Provider>
	)
}
export const useAppState = () => {
	const context = useContext(AppStateContext);
	return context;
}
