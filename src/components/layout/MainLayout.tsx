import { ReactNode, useState } from 'react';
import Header from './Header';
import Footer from './Footer';

interface MainLayoutProps {
	children: ReactNode;
}

const MainLayout = ({ children }: MainLayoutProps) => {
	  const [cart, setCart] = useState([]);

	const [showCart, setShowCart] = useState(false);
	
	const toggleCart = () => setShowCart(!showCart);

	return (
		<div className="flex flex-col min-h-screen">
      <Header onCartToggle={toggleCart} cartCount={cart.length} />
			<main className="flex-grow ">{children}</main>
			<Footer />
		</div>
	);
};

export default MainLayout;
