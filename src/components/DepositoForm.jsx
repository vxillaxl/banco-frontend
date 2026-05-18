import React, { useState } from 'react';
import { realizarDeposito } from '../services/api';
import LoadingSpinner from './LoadingSpinner';
import '../styles/forms.css';

const DepositoForm = ({ onSuccess }) => {
  const [formData, setFormData] = useState({
    accountId: 'cuenta-001',
    amount: '',
    userId: 'user-juan',
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.amount || formData.amount <= 0) {
      setMessageType('error');
      setMessage('⚠️ Ingresa una cantidad válida');
      return;
    }

    setLoading(true);
    setMessage('');

    try {
      const resultado = await realizarDeposito(formData);

      if (resultado.success) {
        setMessageType('success');
        setMessage(`✅ ${resultado.message}`);

        setFormData({
          accountId: 'cuenta-001',
          amount: '',
          userId: 'user-juan',
        });

        if (onSuccess) {
          setTimeout(() => onSuccess(formData.userId), 1000);
        }
      } else {
        setMessageType('error');
        setMessage(`❌ Error: ${resultado.message}`);
      }
    } catch (error) {
      setMessageType('error');
      setMessage(`❌ Error de conexión: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-card">
      <h2>Realizar depósito</h2>

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="accountId">Cuenta:</label>
          <input
            type="text"
            id="accountId"
            name="accountId"
            value={formData.accountId}
            onChange={handleChange}
            className="input-field"
            disabled={loading}
          />
        </div>

        <div className="form-group">
          <label htmlFor="amount">Cantidad ($):</label>
          <input
            type="number"
            id="amount"
            name="amount"
            value={formData.amount}
            onChange={handleChange}
            placeholder="500.00"
            step="0.01"
            min="0"
            className="input-field"
            disabled={loading}
          />
        </div>

        <div className="form-group">
          <label htmlFor="userId">ID de Usuario:</label>
          <input
            type="text"
            id="userId"
            name="userId"
            value={formData.userId}
            onChange={handleChange}
            className="input-field"
            disabled={loading}
          />
        </div>

        <button type="submit" className="btn-primary" disabled={loading}>
          {loading ? 'Procesando...' : 'Depositar ahora'}
        </button>
      </form>

      {loading && <LoadingSpinner />}

      {message && <div className={`message ${messageType}`}>{message}</div>}
    </div>
  );
};

export default DepositoForm;
