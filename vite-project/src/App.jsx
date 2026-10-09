// Funzione di debounce generica
const debounce = (callback, delay) => {
  let timeout;
  return (value) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      callback(value);
    }, delay);
  };
};

import { useCallback, useEffect, useState  } from "react";

function App() {
  
  const [query, setQuery] = useState("")
  const [suggestions, setSuggestions] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const fetchProducts = async (query) => {
    if(!query.trim()){
      setSuggestions([]);
      return;
    }
  try{
      const res = await fetch(`http://localhost:3333/products?search=${query}`);
      const data = await res.json();
      setSuggestions(data);
      console.log('API');
      
    }catch(error){
      console.error(error);
    }
    }

    const debouncedFetchProducts = useCallback(
      debounce(fetchProducts, 500)
      , []);

    useEffect(() => {
      debouncedFetchProducts(query);
  }, [query]);

  const fetchProductsDetails = async (id) => {
    try{
      const res = await fetch(`http://localhost:3333/products/${id}`);
    const data = await res.json();
    setSelectedProduct(data);
    setQuery("");
    setSuggestions([]);
    }catch(error){
      console.error(error);
      
    }
  }

  return (
    <div>
      <h1>Autocomplete</h1>
      <input 
      type="text" 
      placeholder='Cerca un prodotto...'
      value={query}
      onChange={e => setQuery(e.target.value)}
      />
      {suggestions.length > 0 && (
        <div className="dropdown">
          {suggestions.map((product) => (
            <p key={product.id} onClick={() => fetchProductsDetails(product.id)}>{product.name}</p>
          ))}
        </div>
      ) }
      {selectedProduct && (
        <div className="card">
          <h2>{selectedProduct.name}</h2>
          <img src={selectedProduct.image} alt={selectedProduct.name}/>
          <p>{selectedProduct.description}</p>
          <p><strong>Prezzo:</strong> {selectedProduct.price}€</p>
        </div>
      )}
    </div>
  )
}

export default App

// 💡 Premessa: Stai sviluppando un campo di ricerca intelligente simile a quello di Amazon. Quando l'utente digita, una tendina di suggerimenti mostra i prodotti corrispondenti alla ricerca. Per evitare richieste API eccessive, devi ottimizzare la ricerca con il debounce.

// Bonus: Caricare i Dettagli del Prodotto Selezionato
// Quando l’utente clicca su un prodotto nella tendina, nascondi la tendina e carica i dettagli completi del prodotto sotto il campo di ricerca.

// Effettua una richiesta API per ottenere i dettagli completi:
// /products/{id}

// Mostra i dettagli del prodotto selezionato (es. image, name, description, price).


// Obiettivo: Aggiungere interattività permettendo di visualizzare le informazioni complete di un prodotto.