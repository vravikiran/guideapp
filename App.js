import React from 'react';
import { AppProvider } from './state';
import { BrowserRouter,Route,Routes } from 'react-router-dom';
import MainApp from './MainApp';
export const App = () => {
	return (
		<>
		<AppProvider>
				<BrowserRouter>
					<Routes>
						<Route path="/" element={<MainApp />} />
					</Routes>
				</BrowserRouter>
				</AppProvider>
		</>
	);
}
export default App;

