import { Routes, Route, Outlet } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import MainLayout from './components/layout/MainLayout';
import { useState, useEffect } from 'react';
import NotFound from './pages/NotFound';
import AboutUs from './pages/AboutUs';
import ContactUs from './pages/ContactUs';
import DairyLoadingAnimation from './components/ui/Loading';
import GheeStore from './pages/GheeStore';

import DairyAuthPage from './pages/DairyAuthPage';
import ProductDetails from './pages/ProductDetails';
import Portfolio from './pages/Portfolio';
import VerticalScrollAnimation from './components/VerticalScrollAnimation';

const Home = lazy(() => import('./pages/Home'));

// Responsive component wrapper
const ResponsivePortfolio = () => {
	const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

	useEffect(() => {
		const handleResize = () => {
			setIsMobile(window.innerWidth < 768);
		};

		window.addEventListener('resize', handleResize);
		return () => window.removeEventListener('resize', handleResize);
	}, []);

	return isMobile ? <VerticalScrollAnimation /> : <Portfolio />;
};

function App() {
	const [isInitialLoading, setIsInitialLoading] = useState(true);

	useEffect(() => {
		// Set a timer to hide initial loading after animation completes
		const timer = setTimeout(() => {
			setIsInitialLoading(false);
		}, 3000); // Adjust this duration based on your loading animation

		return () => clearTimeout(timer);
	}, []);

	if (isInitialLoading) {
		return <DairyLoadingAnimation />;
	}

	return (
		<Suspense
			fallback={
				<div className="min-h-screen">
					<DairyLoadingAnimation />
				</div>
			}
		>
			<Routes>
				<Route
					path="/"
					element={
						<MainLayout>
							<Outlet />
						</MainLayout>
					}
				>
					<Route index element={<Home />} />
					<Route path="/about" element={<AboutUs />} />
					<Route path="/contact-us" element={<ContactUs />} />
					<Route path="/ghee" element={<GheeStore />} />
					<Route path='/auth' element={<DairyAuthPage/>} />
					<Route path="/details" element={<ProductDetails/>} />
					<Route path='/portfolio' element={<ResponsivePortfolio/>} />
				</Route>
				<Route
					path="/404"
					element={
						<MainLayout>
							<NotFound />
						</MainLayout>
					}
				/>
				<Route
					path="*"
					element={
						<MainLayout>
							<NotFound />
						</MainLayout>
					}
				/>
			</Routes>
		</Suspense>
	);
}

export default App;