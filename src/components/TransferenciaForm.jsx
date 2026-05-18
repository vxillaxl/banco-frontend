import React, { useState } from 'react';
import { realizarTransferencia } from '../services/api';
import LoadingSpinner from './LoadingSpinner';
import '../styles/forms.css';

const TransferenciaForm = ({ onSuccess, saldoDisponible, cuentaOrigen = 'cuenta-001' }) => {
  const [formData, setFormData] = useState({
    fromAccount: 'cuenta-001',
    toAccount: '',
    amount: '',
    userId: 'user-juan',
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');
  const [transactionId, setTransactionId] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.toAccount || !formData.amount || formData.amount <= 0) {
      setMessageType('error');
      setMessage('⚠️ Por favor completa todos los campos correctamente');
      return;
    }

    if (formData.toAccount === formData.fromAccount) {
      setMessageType('error');
      setMessage('❌ No puedes transferir a tu misma cuenta');
      return;
    }

    const amount = parseFloat(formData.amount);
    if (formData.fromAccount === cuentaOrigen && amount > saldoDisponible) {
      setMessageType('error');
      setMessage('❌ Saldo insuficiente para esta transferencia');
      return;
    }

    setLoading(true);
    setMessage('');

    try {
      const resultado = await realizarTransferencia(formData);

      if (resultado.success) {
        setMessageType('success');
        setMessage(`✅ ${resultado.message}`);
        setTransactionId(resultado.transactionId || '');

        setFormData({
          fromAccount: 'cuenta-001',
          toAccount: '',
          amount: '',
          userId: 'user-juan',
        });

        if (onSuccess) {
          onSuccess({
            userId: formData.userId,
            fromAccount: formData.fromAccount,
            amount,
          });
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
      <h2>Realizar transferencia</h2>

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="fromAccount">De (Tu Cuenta):</label>
          <input
            type="text"
            id="fromAccount"
            name="fromAccount"
            value={formData.fromAccount}
            disabled
            className="input-disabled"
          />
        </div>

        <div className="form-group">
          <label htmlFor="toAccount">Para (Cuenta Destino):</label>
          <input
            type="text"
            id="toAccount"
            name="toAccount"
            value={formData.toAccount}
            onChange={handleChange}
            placeholder="Ej: cuenta-002"
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
            placeholder="100.50"
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
          {loading ? 'Procesando...' : 'Transferir ahora'}
        </button>
      </form>

      {loading && <LoadingSpinner />}

      {message && (
        <div className={`message ${messageType}`}>
          {message}
          {transactionId && <p className="transaction-id">ID: {transactionId}</p>}
        </div>
      )}
    </div>
  );
};

export default TransferenciaForm;
