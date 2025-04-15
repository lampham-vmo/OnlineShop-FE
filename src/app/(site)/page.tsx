import Home from './components/Home';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'OnlineShop',
  description: 'OnlineShop',
};

export default function HomePage() {
  return <Home />;
}
