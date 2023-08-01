import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';

// scroll bar
import 'simplebar/src/simplebar.css';

// third-party
import { QueryClient, QueryClientProvider } from 'react-query';
import { RecoilRoot } from 'recoil';

// apex-chart
import 'assets/third-party/apex-chart.css';

// project import
import App from './App';
import reportWebVitals from './reportWebVitals';
import { getCookie } from './utils/cookie';
import { setAxiosAuthorization } from './utils/axios';

// ==============================|| MAIN - REACT DOM RENDER  ||============================== //

const container = document.getElementById('root');
const root = createRoot(container); // createRoot(container!) if you use TypeScript

const token = getCookie('token');
setAxiosAuthorization(token);

const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			refetchOnMount: false,
			refetchOnReconnect: false,
			refetchOnWindowFocus: false,
		},
	},
});

root.render(
	<StrictMode>
		<RecoilRoot>
			<QueryClientProvider client={queryClient}>
				<BrowserRouter basename="/">
					<App />
				</BrowserRouter>
			</QueryClientProvider>
		</RecoilRoot>
	</StrictMode>,
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
