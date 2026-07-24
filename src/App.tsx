import { Routes, Route, Outlet } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import MainLayout from './components/layout/MainLayout';
import { useState, useEffect } from 'react';
import NotFound from './pages/NotFound';
import AboutUs from './pages/AboutUs';
import DairyLoadingAnimation from './components/ui/Loading';
import GheeStore from './pages/GheeStore';

import DairyAuthPage from './pages/DairyAuthPage';
import ProductDetails from './pages/ProductDetails';
import Portfolio from './pages/Portfolio';
import Profile from './pages/Profile';
import { CartProvider } from './context/cartContext';
import CategoryStore from './pages/CategoryStore';
import ScrollToTop from './components/ui/ScrollToTop';
import ContactUs from './pages/ContactUs';

const Home = lazy(() => import('./pages/Home'));

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
		// CartProvider wraps every route so the cart — and the slide-out
		// drawer it renders — is shared across Home, GheeStore, ProductDetails,
		// and anywhere else that calls useCart().
		<CartProvider>
			<Suspense
				fallback={
					<div className="min-h-screen">
						<DairyLoadingAnimation />
					</div>
				}
			>
				<ScrollToTop/>
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
						{/* <Route path="/contact-us" element={<ContactUs />} /> */}
						<Route path="/ghee" element={<GheeStore />} />
						<Route path='/auth' element={<DairyAuthPage/>} />
						<Route path="/details" element={<ProductDetails/>} />
						<Route path="/details/:id" element={<ProductDetails/>} />
						<Route path='/portfolio' element={<Portfolio/>} />
						<Route path="/profile" element={ <Profile />} />
						<Route path="/contact-us" element={ <ContactUs />} />
						<Route path="/category/:key" element={<CategoryStore />} />
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
		</CartProvider>
	);
}


export default App;
