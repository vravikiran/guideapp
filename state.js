import { createContext, useContext, useState, useEffect } from "react";
import { StyleSheet } from "react-native";
import {BASE_URL} from "@env";

const AppStateContext = createContext({});
export const AppProvider = ({ children }) => {
	const [state, setState] = useState({})
	const [isNew, setIsNew] = useState(true)
	const [countries, setCountries] = useState([])
	const styles = StyleSheet.create({
		textInput_main: {
			borderWidth: 1,
			borderRadius: 5,
			width: "25%",
			alignItems: 'center'
		},
		textInput: {
			borderWidth: 1,
			borderRadius: 5,
			width: "50%"
		},
		button: {
			backgroundColor: 'green',
			borderWidth: 1,
			width: "100px",
			height: "20px",
			alignItems: 'center'
		},
		compView: {
			flex:1,
			alignItems: "center",
			backgroundColor: "#ffc2c2",
			rowGap: 10,
			flexDirection:'column'
		},
		textInSubView: {
			flexDirection: 'row',
			alignItems: 'center',
			columnGap: 10,
		},
		label: {
			width: "230px"
		}
	});

	useEffect(
		() => {
			const info = []
			fetch(`${BASE_URL}/locations/countries`)
				.then(response => response.json())
				.then(data => {
					data.map(item => {
						info.push({ "label": item.country, "value": item.country_id })
					})
					setCountries(info)
				})
		}, []
	)

	return (
		<AppStateContext.Provider value={{ state, setState, styles, isNew, setIsNew, countries }}>
			{children}
		</AppStateContext.Provider>
	)
}
export const useAppState = () => {
	const context = useContext(AppStateContext);
	return context;
}
