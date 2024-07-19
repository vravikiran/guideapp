import React from 'react';
import { AppProvider } from './state';
import MainApp from './MainApp';
export const App = () => {
	return (
		<>
			<AppProvider>
				<MainApp />
			</AppProvider>
		</>
	);
}
export default App;

