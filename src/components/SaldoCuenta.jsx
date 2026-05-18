import React from 'react';
import LoadingSpinner from './LoadingSpinner';
import '../styles/saldo.css';

const SaldoCuenta = ({ cuenta, saldo, loading, error }) => {
  if (loading) {
    return (
      <article className="saldo-card">
        <div className="saldo-card-glow" aria-hidden="true" />
        <div className="saldo-card-inner" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 120 }}>
          <LoadingSpinner />
        </div>
      </article>
    );
  }

  if (error) {
    return (
      <article className="saldo-card">
        <div className="saldo-card-glow" aria-hidden="true" />
        <div className="saldo-card-inner">
          <div className="saldo-top">
            <span className="saldo-label">Saldo disponible</span>
            <span className="saldo-chip" style={{ background: '#e74c3c', color: 'white' }}>Error</span>
          </div>
          <p style={{ color: '#e74c3c', fontSize: '0.85em' }}>{error}</p>
          <p className="saldo-cuenta">{cuenta}</p>
        </div>
      </article>
    );
  }

  return (
    <article className="saldo-card">
      <div className="saldo-card-glow" aria-hidden="true" />
      <div className="saldo-card-inner">
        <div className="saldo-top">
          <span className="saldo-label">Saldo disponible</span>
          <span className="saldo-chip">Activa</span>
        </div>
        <p className="saldo-monto">
          <span className="saldo-currency">$</span>
          {Number(saldo).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </p>
        <p className="saldo-cuenta">{cuenta}</p>
      </div>
    </article>
  );
};

export default SaldoCuenta;
