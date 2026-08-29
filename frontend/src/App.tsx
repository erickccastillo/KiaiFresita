import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Catalog from './pages/Catalog';
import AdminDashboard from './pages/AdminDashboard'; // <-- Importamos el nuevo panel
import AdminProductForm from './pages/AdminProductForm'; 
import About from './pages/About'; 
import Header from './components/Header';
import Footer from './components/Footer';
import './App.css';

const App: React.FC = () => {
  return (
    <div className="app-root">
      <Header />
      <main className="container">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/catalog" element={<Catalog />} />
          <Route path="/about" element={<About />} />
          
          {/* NUEVAS RUTAS DE ADMINISTRADOR */}
          {/* 1. La tabla principal con buscador */}
          <Route path="/admin" element={<AdminDashboard />} /> 
          
          {/* 2. El formulario en modo "Crear nuevo" */}
          <Route path="/admin/new" element={<AdminProductForm />} /> 
          
          {/* 3. El formulario en modo "Editar" (acepta un ID) */}
          <Route path="/admin/edit/:id" element={<AdminProductForm />} /> 
          
        </Routes>
      </main>
      <Footer />
    </div>
  );
};

export default App;