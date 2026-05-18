import React, { useState, useEffect, useCallback } from 'react';
import { consultarHistorial } from '../services/api';
import LoadingSpinner from './LoadingSpinner';
import '../styles/historial.css';

const HistorialTransacciones = ({ userId }) => {
  const [eventos, setEventos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const cargarHistorial = useCallback(async () => {
    setLoading(true);
    setError('');

    try {
      const resultado = await consultarHistorial(userId);

      if (resultado.success) {
        setEventos(resultado.eventos || []);
      } else {
        setError(resultado.message || 'Error al cargar historial');
        setEventos([]);
      }
    } catch (err) {
      setError(err.message);
      setEventos([]);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    if (userId) {
      cargarHistorial();
    }
  }, [userId, cargarHistorial]);

  const getIcono = (operationType) => {
    switch (operationType) {
      case 'TRANSFER_INITIATED':
        return '📤';
      case 'DEBIT_SUCCESS':
        return '💳';
      case 'CREDIT_SUCCESS':
        return '💰';
      case 'DEPOSIT_SUCCESS':
        return '📥';
      case 'REFUND_SUCCESS':
        return '🔄';
      default:
        return '📝';
    }
  };

  const getClase = (operationType) => {
    if (['TRANSFER_INITIATED', 'DEBIT_SUCCESS'].includes(operationType)) {
      return 'debit';
    }
    if (['CREDIT_SUCCESS', 'DEPOSIT_SUCCESS'].includes(operationType)) {
      return 'credit';
    }
    return '';
  };

  const esDebito = (operationType) =>
    ['TRANSFER_INITIATED', 'DEBIT_SUCCESS'].includes(operationType);

  return (
    <div className="historial-card">
      <h2>Historial de transacciones</h2>

      <div className="header-historial">
        <p>
          Usuario: <strong>{userId}</strong>
        </p>
        <button onClick={cargarHistorial} disabled={loading} className="btn-refresh" type="button">
          Actualizar
        </button>
      </div>

      {loading && <LoadingSpinner />}

      {error && <div className="error-message">❌ {error}</div>}

      {!loading && eventos.length === 0 && !error && (
        <p className="empty-message">Sin transacciones registradas</p>
      )}

      {!loading && eventos.length > 0 && (
        <div className="eventos-list">
          {eventos.map((evento, index) => (
            <div
              key={`${evento.transactionId}-${evento.timestamp}-${index}`}
              className={`evento-item ${getClase(evento.operationType)}`}
            >
              <div className="evento-left">
                <div className="evento-tipo">
                  {getIcono(evento.operationType)} {evento.operationType}
                </div>
                <div className="evento-detalles">
                  {evento.fromAccount && <span>De: {evento.fromAccount}</span>}
                  {evento.toAccount && <span> → A: {evento.toAccount}</span>}
                  {evento.targetAccount && <span> → A: {evento.targetAccount}</span>}
                  {evento.accountId && <span>Cuenta: {evento.accountId}</span>}
                </div>
                <div className="evento-fecha">
                  {evento.createdAt
                    ? new Date(evento.createdAt).toLocaleString()
                    : '—'}
                </div>
              </div>

              <div className={`evento-monto ${getClase(evento.operationType)}`}>
                {esDebito(evento.operationType) ? '-' : '+'}$
                {parseFloat(evento.amount || 0).toFixed(2)}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default HistorialTransacciones;
