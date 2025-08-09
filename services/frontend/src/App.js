import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import axios from 'axios';
import './App.css';

const Dashboard = () => {
  const [services, setServices] = useState({});

  useEffect(() => {
    const checkServices = async () => {
      const endpoints = [
        { name: 'API Gateway', url: '/api/health' },
        { name: 'User Service', url: '/users/health' },
        { name: 'Product Service', url: '/products/health' },
        { name: 'Admin Service', url: '/admin/health' }
      ];

      const results = {};
      for (const endpoint of endpoints) {
        try {
          await axios.get(endpoint.url, { timeout: 2000 });
          results[endpoint.name] = 'healthy';
        } catch (error) {
          results[endpoint.name] = 'unhealthy';
        }
      }
      setServices(results);
    };

    checkServices();
    const interval = setInterval(checkServices, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="dashboard">
      <h1>🚀 Kubernetes Ingress Lab</h1>
      <div className="service-grid">
        {Object.entries(services).map(([name, status]) => (
          <div key={name} className={`service-card ${status}`}>
            <h3>{name}</h3>
            <span className={`status ${status}`}>{status}</span>
          </div>
        ))}
      </div>
      
      <div className="ingress-scenarios">
        <h2>🎯 Ingress Scenarios</h2>
        <div className="scenario-links">
          <Link to="/users" className="scenario-btn">User Management</Link>
          <Link to="/products" className="scenario-btn">Product Catalog</Link>
          <Link to="/admin" className="scenario-btn">Admin Panel</Link>
          <a href="/static/index.html" className="scenario-btn">Static Assets</a>
        </div>
      </div>
    </div>
  );
};

const UserPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get('/users/api/users')
      .then(response => {
        setUsers(response.data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching users:', error);
        setLoading(false);
      });
  }, []);

  return (
    <div className="page">
      <h1>👥 User Management</h1>
      <Link to="/" className="back-btn">← Back to Dashboard</Link>
      {loading ? (
        <p>Loading users...</p>
      ) : (
        <div className="user-list">
          {users.map(user => (
            <div key={user.id} className="user-card">
              <h3>{user.name}</h3>
              <p>{user.email}</p>
              <span className="role">{user.role}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const ProductPage = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    axios.get('/products/api/products')
      .then(response => setProducts(response.data))
      .catch(error => console.error('Error fetching products:', error));
  }, []);

  return (
    <div className="page">
      <h1>📦 Product Catalog</h1>
      <Link to="/" className="back-btn">← Back to Dashboard</Link>
      <div className="product-grid">
        {products.map(product => (
          <div key={product.id} className="product-card">
            <h3>{product.name}</h3>
            <p>{product.description}</p>
            <span className="price">${product.price}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/users" element={<UserPage />} />
          <Route path="/products" element={<ProductPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;