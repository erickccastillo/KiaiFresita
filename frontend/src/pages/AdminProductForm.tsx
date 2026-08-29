import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { Link, useParams, useNavigate } from 'react-router-dom';
import './AdminProductForm.css'; // <-- Mantenemos tus estilos

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

const AdminProductForm: React.FC = () => {
  
  // 1. Herramientas para editar y navegar
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = Boolean(id);

  // Estados del formulario
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState<number | ''>('');
  const [color, setColor] = useState('');
  const [material, setMaterial] = useState('');
  const [medidas, setMedidas] = useState('');
  const [category, setCategory] = useState('PISOS');
  
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [existingImageUrl, setExistingImageUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [loadingData, setLoadingData] = useState(isEditing);

  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001';

  // 2. EFECTO: Si estamos editando, traemos los datos de Supabase para llenar el formulario
  useEffect(() => {
    if (isEditing) {
      const fetchProduct = async () => {
        try {
          const { data, error } = await supabase
            .from('products')
            .select('*')
            .eq('id', id)
            .single();
            
          if (error) throw error;

          if (data) {
            setName(data.name);
            setDescription(data.description || '');
            setPrice(data.price);
            setCategory(data.category);
            setColor(data.color || '');
            setMaterial(data.material || '');
            setMedidas(data.medidas || '');
            setPreview(data.image_url);
            setExistingImageUrl(data.image_url);
          }
        } catch (error) {
          console.error("Error al cargar producto:", error);
          alert("No se pudo cargar la información del producto.");
        } finally {
          setLoadingData(false);
        }
      };
      fetchProduct();
    }
  }, [id, isEditing]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // 3. CAMBIO: Ya no exigimos la imagen. Solo nombre y precio.
    if (!description) return alert('La descripcion es obligatoria.');

    setUploading(true);
    try {
      // 4. CAMBIO: Si no hay imagen nueva ni antigua, usamos una gris por defecto
      let finalImageUrl = existingImageUrl || 'https://placehold.co/600x400/eeeeee/999999?text=Sin+Imagen';

      // Solo si el usuario seleccionó un archivo nuevo, lo subimos
      if (file) {
        const fileExt = file.name.split('.').pop();
        const fileName = `${Date.now()}-${Math.random()}.${fileExt}`;
        const filePath = `catalog/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('products')
          .upload(filePath, file);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('products')
          .getPublicUrl(filePath);
          
        finalImageUrl = publicUrl; // Usamos la URL de la imagen recién subida
      }

    const productData = {
        name,
        description,
        price: Number(price),
        category,
        image_url: finalImageUrl,
        color,
        material,
        medidas,
      };

      // 5. Decidimos si creamos (POST) o actualizamos (PUT)
      const method = isEditing ? 'PUT' : 'POST';
      const url = isEditing ? `${apiUrl}/api/products/${id}` : `${apiUrl}/api/products`;

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(productData),
      });

      if (!response.ok) throw new Error('Error en el servidor');

      alert(isEditing ? '✨ ¡Producto actualizado!' : '✨ ¡Producto publicado con éxito!');
      
      // Al terminar, lo regresamos al panel principal
      navigate('/admin');

    } catch (error) {
      console.error('Error al guardar:', error);
      alert('Hubo un error al guardar el producto. Intenta de nuevo.');
    } finally {
      setUploading(false);
    }
  };

  if (loadingData) {
    return <div style={{textAlign: 'center', marginTop: '5rem', fontSize: '1.2rem', color: '#0a2a5e'}}>Cargando información del producto...</div>;
  }

  return (
    <div className="admin-container">
      
      <div className="admin-card">
        <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '1.5rem',
        }}
      >
        <Link
          to="/admin"
          style={{
            backgroundColor: '#0a2a5e',
            color: 'white',
            padding: '0.5rem 1rem',
            borderRadius: '8px',
            textDecoration: 'none',
            fontWeight: 'bold',
          }}
        >
          ← Dashboard
        </Link>
      </div>
        <h2 className="admin-title">{isEditing ? 'Editar Producto' : 'Panel de Control'}</h2>
        <p className="admin-subtitle">
          {isEditing ? 'Modifica los detalles del producto' : 'Agrega un nuevo producto al catálogo de Revestimento'}
        </p>

        <form onSubmit={handleSubmit}>
          
          <div className="form-group">
            <label>Nombre del Producto</label>
            <input 
              type="text" 
              className="custom-input"
              placeholder="Ej. Piso Cerámico tipo Madera"
              value={name} 
              onChange={(e) => setName(e.target.value)} 
              required 
            />
          </div>

          <div className="form-group">
            <label>Descripción</label>
            <textarea 
              className="custom-input"
              placeholder="Breve descripción del material, textura o uso..."
              rows={10}
              value={description} 
              onChange={(e) => setDescription(e.target.value)} 
            />
          </div>

          <div style={{ display: 'flex', gap: '1rem' }}>
            <div className="form-group" style={{ flex: 1 }}>
              <label>Precio ($)</label>
              <input 
                type="number" 
                className="custom-input"
                placeholder="0.00"
                value={price} 
                onChange={(e) => setPrice(Number(e.target.value))} 
                required 
              />
            </div>

            <div className="form-group" style={{ flex: 1 }}>
              <label>Categoría</label>
              <select 
                className="custom-input"
                value={category} 
                onChange={(e) => setCategory(e.target.value)}
              >
                <option value="PISOS">Pisos</option>
                <option value="AZULEJOS">Azulejos</option>
                <option value="DECORATIVOS">Decorativos</option>
                <option value="MONOMANDOS">Monomandos</option>
                <option value="MEZCLADORAS">Mezcladoras</option>
                <option value="MUROS">Muros</option>
                <option value="LAVABOS">Lavabos</option>
              </select>
            </div>
          </div>

          <div className="form-group">
          <label>Color</label>
          <input
            type="text"
            className="custom-input"
            placeholder="Ej. Beige, Gris, Nogal"
            value={color}
            onChange={(e) => setColor(e.target.value)}
          />
        </div>
        
        <div className="form-group">
          <label>Material</label>
          <input
            type="text"
            className="custom-input"
            placeholder="Ej. Cerámica, Porcelanato, Madera"
            value={material}
            onChange={(e) => setMaterial(e.target.value)}
          />
        </div>
        
        <div className="form-group">
          <label>Medidas</label>
          <input
            type="text"
            className="custom-input"
            placeholder="Ej. 60x60 cm"
            value={medidas}
            onChange={(e) => setMedidas(e.target.value)}
          />
        </div>

          <div className="form-group">
            {/* Cambiamos el texto para que sepa que es opcional */}
            <label>{isEditing ? 'Cambiar Fotografía (Opcional)' : 'Fotografía del Producto (Opcional)'}</label>
            <div className="file-drop-area">
              <span style={{ color: '#0a2a5e', fontWeight: 600 }}>
                {file ? file.name : 'Haz clic o arrastra una imagen aquí'}
              </span>
              <input 
                type="file" 
                className="file-input-hidden"
                accept="image/*" 
                onChange={handleFileChange} 
              />
            </div>
            
            {/* Si hay una imagen seleccionada o ya existía una, la mostramos */}
            {preview && (
              <img src={preview} alt="Vista previa" className="image-preview" />
            )}
          </div>
          
          <button type="submit" className="btn-submit" disabled={uploading}>
            {uploading ? (
              <>
                <div className="spinner"></div>
                Guardando en la nube...
              </>
            ) : (
              isEditing ? 'Actualizar Producto' : 'Guardar Producto'
            )}
          </button>

        </form>
      </div>
    </div>
  );
};

export default AdminProductForm;
