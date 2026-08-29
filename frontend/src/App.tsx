import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Admin from './pages/Admin'; 
import ResumenVentas from './pages/ResumenVentas';
import AdminSaleForm from './pages/AdminSaleForm'; // <-- Importamos el formulario
import AdminProductForm from './pages/AdminProductForm';
import AdminEditProduct from './pages/AdminEditProduct';
import SaleDetail from './pages/SaleDetail';
import Header from './components/Header';
import Footer from './components/Footer';
import './App.css';

const App: React.FC = () => {
  return (
    <div className="app-root" style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Header />
      <main className="container" style={{ padding: '2rem', flex: 1 }}>
        <Routes>
          {/* Rutas Públicas */}
          <Route path="/" element={<Home />} />
          
          {/* Rutas de Administrador */}
          <Route path="/admin" element={<Admin />} />
          <Route path="/admin/ventas" element={<ResumenVentas />} />
          <Route path="/admin/new-sale" element={<AdminSaleForm />} /> {/* <-- Nueva ruta */}
          <Route path="/admin/new" element={<AdminProductForm />} />
          <Route path="/admin/edit/:id" element={<AdminEditProduct />} />
          <Route path="/admin/ventas/:id" element={<SaleDetail />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
};

export default App;