import { createRoot } from 'react-dom/client';
import { useEffect, useMemo, useState } from 'react';
import {
  ArrowRight,
  Check,
  ChevronDown,
  Heart,
  Menu,
  Minus,
  Plus,
  Search,
  ShoppingBag,
  Sparkles,
  X,
} from 'lucide-react';
import './styles.css';

const collections = ['All objects', 'Furniture', 'Lighting', 'Objects', 'Textiles'];

function formatPrice(price) {
  return `$${price.toLocaleString('en-US')}`;
}

function App() {
  const [products, setProducts] = useState([]);
  const [activeCollection, setActiveCollection] = useState('All objects');
  const [query, setQuery] = useState('');
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [notice, setNotice] = useState('');

  useEffect(() => {
    fetch('http://localhost:4000/api/products')
      .then((response) => response.json())
      .then(setProducts)
      .catch(() => setNotice('Catalog unavailable. Please refresh to try again.'));
  }, []);

  const filteredProducts = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    return products.filter((product) => {
      const matchesCollection = activeCollection === 'All objects' || product.category === activeCollection;
      const matchesQuery = !normalizedQuery || `${product.name} ${product.category} ${product.color}`.toLowerCase().includes(normalizedQuery);
      return matchesCollection && matchesQuery;
    });
  }, [activeCollection, products, query]);

  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);
  const cartTotal = cart.reduce((total, item) => total + item.price * item.quantity, 0);

  function addToCart(product) {
    setCart((currentCart) => {
      const existing = currentCart.find((item) => item.id === product.id);
      if (existing) {
        return currentCart.map((item) => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...currentCart, { ...product, quantity: 1 }];
    });
    setNotice(`${product.name} added to bag`);
    window.setTimeout(() => setNotice(''), 2400);
  }

  function updateQuantity(id, amount) {
    setCart((currentCart) => currentCart
      .map((item) => item.id === id ? { ...item, quantity: item.quantity + amount } : item)
      .filter((item) => item.quantity > 0));
  }

  function scrollToCollection() {
    document.getElementById('collection')?.scrollIntoView({ behavior: 'smooth' });
  }

  return (
    <div className="app-shell">
      <div className="announcement"><Sparkles size={14} /> Complimentary shipping on orders over $150 <ArrowRight size={14} /></div>
      <header className="site-header">
        <button className="icon-button mobile-menu" aria-label="Open menu" onClick={() => setIsMenuOpen(true)}><Menu size={20} /></button>
        <a className="wordmark" href="#top" aria-label="Form and Found home">FORM <span>&amp;</span> FOUND</a>
        <nav className={`main-nav ${isMenuOpen ? 'nav-open' : ''}`}>
          <button className="nav-close" aria-label="Close menu" onClick={() => setIsMenuOpen(false)}><X size={18} /></button>
          <a href="#collection" onClick={() => setIsMenuOpen(false)}>Shop</a>
          <a href="#story" onClick={() => setIsMenuOpen(false)}>Our story</a>
          <a href="#journal" onClick={() => setIsMenuOpen(false)}>Journal</a>
        </nav>
        <div className="header-actions">
          <button className="icon-button" aria-label="Search" onClick={() => document.querySelector('.search-input')?.focus()}><Search size={19} /></button>
          <button className="bag-button" onClick={() => setIsCartOpen(true)}><ShoppingBag size={18} /><span>Bag</span><b>{cartCount}</b></button>
        </div>
      </header>

      <main id="top">
        <section className="hero-section">
          <div className="hero-copy">
            <p className="eyebrow">Edition 04 / Spring 2024</p>
            <h1>Objects with<br /><em>a point of view.</em></h1>
            <p className="hero-description">A considered collection of furniture, lighting and everyday things made to bring a little more intention to your space.</p>
            <button className="text-button" onClick={scrollToCollection}>Explore the collection <ArrowRight size={17} /></button>
          </div>
          <div className="hero-image-wrap">
            <img src="https://images.unsplash.com/photo-1618220179428-22790b461013?auto=format&fit=crop&w=1500&q=88" alt="Sculptural chair in a sunlit interior" />
            <div className="image-caption"><span>01</span><span>Quiet forms for<br />daily rituals.</span></div>
          </div>
          <div className="hero-side-note">EST. 2021<br /><span>NYC / CPH</span></div>
        </section>

        <section className="manifesto" id="story">
          <p className="eyebrow">Our point of view</p>
          <p className="manifesto-text">Good design doesn’t ask for attention.<br /><em>It earns a place in your life.</em></p>
          <div className="manifesto-detail"><span>We work with makers who care about process as much as the final form.</span><ArrowRight size={17} /></div>
        </section>

        <section className="collection-section" id="collection">
          <div className="section-heading">
            <div><p className="eyebrow">The edit</p><h2>Made to live with</h2></div>
            <div className="catalog-tools">
              <label className="search-field"><Search size={16} /><input className="search-input" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search objects" /></label>
              <button className="sort-button">Sort <ChevronDown size={15} /></button>
            </div>
          </div>
          <div className="collection-tabs">{collections.map((collection) => <button key={collection} className={activeCollection === collection ? 'active' : ''} onClick={() => setActiveCollection(collection)}>{collection}</button>)}</div>
          <div className="product-grid">
            {filteredProducts.map((product) => <ProductCard key={product.id} product={product} addToCart={addToCart} />)}
          </div>
          {!filteredProducts.length && <div className="empty-state">No objects match that search. Try another point of view.</div>}
        </section>

        <section className="journal-feature" id="journal">
          <div className="journal-image"><img src="https://images.unsplash.com/photo-1617104678098-de229db51175?auto=format&fit=crop&w=1200&q=85" alt="Material samples and ceramics on a table" /><span>Field notes / 03</span></div>
          <div className="journal-copy"><p className="eyebrow">From the journal</p><h2>The beauty<br /><em>of the useful.</em></h2><p>On materiality, good light, and the objects that make a house feel like your own.</p><button className="text-button">Read the story <ArrowRight size={17} /></button></div>
        </section>
      </main>

      <footer className="site-footer"><div className="footer-brand"><a className="wordmark" href="#top">FORM <span>&amp;</span> FOUND</a><p>Considered objects for everyday living.</p></div><div className="footer-links"><div><p className="footer-label">Visit</p><a href="#collection">Shop all</a><a href="#story">Our story</a></div><div><p className="footer-label">Connect</p><a href="mailto:hello@formandfound.co">Email us</a><a href="#journal">Instagram</a></div></div><p className="copyright">© 2024 Form &amp; Found</p></footer>

      {notice && <div className="toast"><Check size={15} /> {notice}</div>}
      {isCartOpen && <CartDrawer cart={cart} cartTotal={cartTotal} updateQuantity={updateQuantity} closeCart={() => setIsCartOpen(false)} />}
    </div>
  );
}

function ProductCard({ product, addToCart }) {
  const [liked, setLiked] = useState(false);
  return <article className="product-card"><div className="product-image-wrap"><img src={product.image} alt={product.name} /><div className="product-meta"><span>{product.badge || product.category}</span><button className={`heart-button ${liked ? 'liked' : ''}`} aria-label={`Save ${product.name}`} onClick={() => setLiked(!liked)}><Heart size={17} fill={liked ? 'currentColor' : 'none'} /></button></div><button className="quick-add" onClick={() => addToCart(product)}>Quick add <Plus size={15} /></button></div><div className="product-info"><div><h3>{product.name}</h3><p>{product.color}</p></div><strong>{formatPrice(product.price)}</strong></div></article>;
}

function CartDrawer({ cart, cartTotal, updateQuantity, closeCart }) {
  return <div className="drawer-backdrop" onClick={closeCart}><aside className="cart-drawer" onClick={(event) => event.stopPropagation()}><div className="drawer-header"><div><p className="eyebrow">Your selection</p><h2>Shopping bag <span>{cart.reduce((sum, item) => sum + item.quantity, 0)}</span></h2></div><button className="icon-button" aria-label="Close cart" onClick={closeCart}><X size={20} /></button></div>{cart.length ? <><div className="cart-items">{cart.map((item) => <div className="cart-item" key={item.id}><img src={item.image} alt="" /><div className="cart-item-details"><div><h3>{item.name}</h3><p>{formatPrice(item.price)}</p></div><div className="quantity-control"><button aria-label="Decrease quantity" onClick={() => updateQuantity(item.id, -1)}><Minus size={13} /></button><span>{item.quantity}</span><button aria-label="Increase quantity" onClick={() => updateQuantity(item.id, 1)}><Plus size={13} /></button></div></div></div>)}</div><div className="drawer-footer"><div className="subtotal"><span>Subtotal</span><strong>{formatPrice(cartTotal)}</strong></div><p>Shipping and taxes calculated at checkout.</p><button className="checkout-button">Continue to checkout <ArrowRight size={17} /></button></div></> : <div className="empty-cart"><ShoppingBag size={30} /><h3>Your bag is quiet.</h3><p>Add something considered to get started.</p><button className="text-button" onClick={closeCart}>Continue shopping <ArrowRight size={17} /></button></div>}</aside></div>;
}

export default App;

createRoot(document.getElementById('root')).render(<App />);
