interface SearchBarProps {
  query: string;
  setQuery: (val: string) => void;
}

export default function SearchBar({ query, setQuery }: SearchBarProps) {
  return (
    <div style={{ marginBottom: '1rem' }}>
      <input
        type="text"
        placeholder="Buscar ventas..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        style={{
          width: '100%',
          padding: '10px',
          borderRadius: '5px',
          border: '1px solid #ccc',
          outlineColor: 'var(--verde-hoja)'
        }}
      />
    </div>
  );
}