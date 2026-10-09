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
            <p key={product.id}>{product.name}</p>
          ))}
        </div>
      ) }
    </div>
  )
}

export default App

// 💡 Premessa: Stai sviluppando un campo di ricerca intelligente simile a quello di Amazon. Quando l'utente digita, una tendina di suggerimenti mostra i prodotti corrispondenti alla ricerca. Per evitare richieste API eccessive, devi ottimizzare la ricerca con il debounce.

// 📌 Milestone 2: Implementare il Debounce per Ottimizzare la Ricerca
// Attualmente, ogni pressione di tasto esegue una richiesta API. Questo è inefficiente!
// Implementa una funzione di debounce per ritardare la chiamata API fino a quando l’utente smette di digitare per un breve periodo (es. 300ms)
// Dopo l’implementazione, verifica che la ricerca non venga eseguita immediatamente a ogni tasto premuto, ma solo dopo una breve pausa.

// Obiettivo: Ridurre il numero di richieste API e migliorare le prestazioni.