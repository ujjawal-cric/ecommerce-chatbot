import React, { useState ,useEffect, useRef} from 'react';
import './Chatbot.css';

const Chatbot = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const user = 'user123';
  const chatEndRef = useRef(null);

  const API_URL = 'https://ecommerce-chatbot-backend-jala.onrender.com';
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const newMessages = [...messages, { sender: 'user', text: input }];
    setMessages(newMessages);
     setIsLoading(true);

    await fetch(`${API_URL}/conversation`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user, message: input })
    });

    const res = await fetch(`${API_URL}/search?q=${input}`);
    const products = await res.json();

    if (products.length === 0) {
      setMessages([...newMessages, { sender: 'bot', text: 'No products found.' }]);
    } else {
      const productCards = products.map(p => (
  <div key={p.id} className="product-card">
    <img src={p.image_url} alt={p.name} />
    <b>{p.name}</b>
    <div className="product-brand">Brand: {p.brand}</div>
    <div className="product-price">Price: ${p.price}</div>
    <button className="add-to-cart-btn" onClick={() => addToCart(p.id)}>Add to Cart</button>
  </div>
));

      setMessages([...newMessages, { sender: 'bot', content: productCards }]);
    }

    setInput('');
    setIsLoading(false);
  };

  const addToCart = async (productId) => {
    await fetch(`${API_URL}/cart/add`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user, product_id: productId, quantity: 1 })
    });
    setMessages(prev => [...prev, { sender: 'bot', text: '✅ Added to cart!' }]);
  };

  const viewCart = async () => {
    const res = await fetch(`${API_URL}/cart/view?user=${user}`);
    const items = await res.json();
    if (items.length === 0) {
      setMessages(prev => [...prev, { sender: 'bot', text: '🛒 Your cart is empty.' }]);
    } else {
      const cartItems = items.map((item, index) => (
        <div key={index}>
          {item.name} - ${item.price} x {item.quantity}
        </div>
      ));
      setMessages(prev => [...prev, { sender: 'bot', content: cartItems }]);
    }
  };

  const checkout = async () => {
    await fetch(`${API_URL}/cart/checkout`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user })
    });
    setMessages(prev => [...prev, { sender: 'bot', text: '✅ Checkout complete! Thank you! 🎉' }]);
  };
  const handleResetChat = () => {
    setMessages([]);
};
const suggestedItems = [
    'iPhone 14',
    'Samsung TV',
    'Sony Headphones',
    'Dell Laptop',
    'Canon Camera',
    'Logitech Mouse',
    'JBL Speaker',
    'Apple Watch',
    'Lenovo Tablet',
    'HP Printer'
  ];

 
   
return (
    <div className="chatbot-layout">
      
      {/* Left: Chat Area */}
      <div className="chatbot-container">
        <div className="chatbot-header">🛍️ Electronics Store Chatbot</div>

        <div className="chatbot-messages">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`chat-bubble ${msg.sender === 'user' ? 'user-bubble' : 'bot-bubble'}`}
            >
              {msg.content ? msg.content : msg.text}
            </div>
          ))}
          {isLoading && (
    <div className="chat-bubble bot-bubble">
      <div className="loader"></div>
    </div>
  )}
          <div ref={chatEndRef} />
        </div>

        <div className="chatbot-input">
          <input
            type="text"
            placeholder="Type a message..."
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && sendMessage()}
          />
          <button onClick={sendMessage}>Send</button>
          <button onClick={viewCart}>View Cart</button>
          <button onClick={checkout}>Checkout</button>
          <button onClick={handleResetChat}>Reset</button>
        </div>
      </div>

      {/* Right: Suggested Items Section */}
      <div className="suggested-items">
        <h3>📋 Suggested Items</h3>
        <ul>
          {suggestedItems.map((item, index) => (
            <li key={index} onClick={() => setInput(item)}>
              {item}
            </li>
          ))}
        </ul>
      </div>
    </div>

 
    
  );
};

export default Chatbot;

