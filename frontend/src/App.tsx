import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Admin from './pages/Admin'; 
import ResumenVentas from './pages/ResumenVentas';
import AdminSaleForm from './pages/AdminSaleForm';
import AdminProductForm from './pages/AdminProductForm';
import AdminEditProduct from './pages/AdminEditProduct';
import SaleDetail from './pages/SaleDetail';
import Header from './components/Header';
import Footer from './components/Footer';
import './App.css';

const App: React.FC = () => {
  return (
    <div className="app-root flex flex-col min-h-screen w-full">
      <Header />
      {/* Se eliminó la clase 'container' y el padding restrictivo */}
      <main className="flex-1 w-full flex flex-col">
        <Routes>
          {/* Rutas Públicas */}
          <Route path="/" element={<Home />} />
          
          {/* Rutas de Administrador */}
          <Route path="/admin" element={<Admin />} />
          <Route path="/admin/ventas" element={<ResumenVentas />} />
          <Route path="/admin/new-sale" element={<AdminSaleForm />} />
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