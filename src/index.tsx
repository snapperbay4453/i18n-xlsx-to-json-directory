import { render } from 'preact';
import { LocationProvider, Router, Route } from 'preact-iso';

import { Header } from './components/Header.jsx';
import Home from './pages/home/index.jsx';
import JsonToXlsx from './pages/json-to-xlsx/index.jsx';
import XlsxToJson from './pages/xlsx-to-json/index.jsx';
import { NotFound } from './pages/_404.jsx';
import './style.css';

export function App() {
	return (
		<LocationProvider>
			<Header />
			<main>
				<Router>
					<Route path="/" component={Home} />
					<Route path="/json-to-xlsx" component={JsonToXlsx} />
					<Route path="/xlsx-to-json" component={XlsxToJson} />
					<Route default component={NotFound} />
				</Router>
			</main>
		</LocationProvider>
	);
}

render(<App />, document.getElementById('app'));
