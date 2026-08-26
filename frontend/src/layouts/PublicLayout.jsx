// PublicLayout.jsx
// Pages with the public Navbar + Footer (Landing, Search, Property Detail)
import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function PublicLayout() {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar />
      <main style={{ flex: 1 }}>
        <Outlet /> {/* The matched page renders here */}
      </main>
      <Footer />
    </div>
  );
}
