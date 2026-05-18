import React, { useEffect, useState } from 'react';
import '../styles/saldo.css';

const SaldoCuenta = ({ cuenta, saldo }) => {
  const [pulse, setPulse] = useState(false);

  useEffect(() => {
    setPulse(true);
    const timer = setTimeout(() => setPulse(false), 600);
    return () => clearTimeout(timer);
  }, [saldo]);

  return (
    <article className={`saldo-card ${pulse ? 'saldo-card--pulse' : ''}`}>
      <div className="saldo-card-glow" aria-hidden="true" />
      <div className="saldo-card-inner">
        <div className="saldo-top">
          <span className="saldo-label">Saldo disponible</span>
          <span className="saldo-chip">Activa</span>
        </div>
        <p className="saldo-monto">
          <span className="saldo-currency">$</span>
          {saldo.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </p>
        <p className="saldo-cuenta">{cuenta}</p>
      </div>
    </article>
  );
};

export default SaldoCuenta;
