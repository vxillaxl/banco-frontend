import React, { useState, useCallback } from 'react';
import TransferenciaForm from './components/TransferenciaForm';
import DepositoForm from './components/DepositoForm';
import HistorialTransacciones from './components/HistorialTransacciones';
import SaldoCuenta from './components/SaldoCuenta';
import './App.css';

const TABS = [
  { id: 'transferencia', label: 'Transferencia', icon: '↗' },
  { id: 'deposito', label: 'Depósito', icon: '＋' },
  { id: 'historial', label: 'Historial', icon: '◎' },
];

const CUENTA_PRINCIPAL = 'cuenta-001';
const SALDO_INICIAL = 50000;

function roundMoney(value) {
  return Math.round(value * 100) / 100;
}

function App() {
  const [activeTab, setActiveTab] = useState('transferencia');
  const [userIdActivo, setUserIdActivo] = useState('user-juan');
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [saldo, setSaldo] = useState(SALDO_INICIAL);

  const refreshHistorial = useCallback((userId) => {
    setUserIdActivo(userId);
    setTimeout(() => setRefreshTrigger((prev) => prev + 1), 1000);
  }, []);

  const handleTransferSuccess = useCallback(({ userId, fromAccount, amount }) => {
    if (fromAccount === CUENTA_PRINCIPAL) {
      setSaldo((prev) => Math.max(0, roundMoney(prev - amount)));
    }
    refreshHistorial(userId);
  }, [refreshHistorial]);

  const handleDepositSuccess = useCallback(({ userId, accountId, amount }) => {
    if (accountId === CUENTA_PRINCIPAL) {
      setSaldo((prev) => roundMoney(prev + amount));
    }
    refreshHistorial(userId);
  }, [refreshHistorial]);

  return (
    <div className="app">
      <div className="app-bg" aria-hidden="true">
        <div className="orb orb-1" />
        <div className="orb orb-2" />
        <div className="grid-overlay" />
      </div>

      <div className="dashboard">
        <header className="app-header">
          <div className="brand">
            <div className="brand-icon" aria-hidden="true">
              <span>B</span>
            </div>
            <div>
              <p className="brand-tag">Cloud Banking · AWS</p>
              <h1>Banco Online</h1>
            </div>
          </div>
          <p className="subtitle">Transferencias seguras con saga distribuida</p>
        </header>

        <SaldoCuenta cuenta={CUENTA_PRINCIPAL} saldo={saldo} />

        <section className="panel">
          <nav className="tabs" aria-label="Secciones">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                type="button"
                className={`tab ${activeTab === tab.id ? 'active' : ''}`}
                onClick={() => setActiveTab(tab.id)}
              >
                <span className="tab-icon">{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </nav>

          <div className="content">
            {activeTab === 'transferencia' && (
              <TransferenciaForm
                onSuccess={handleTransferSuccess}
                saldoDisponible={saldo}
                cuentaOrigen={CUENTA_PRINCIPAL}
              />
            )}
            {activeTab === 'deposito' && (
              <DepositoForm onSuccess={handleDepositSuccess} />
            )}
            {activeTab === 'historial' && (
              <HistorialTransacciones key={refreshTrigger} userId={userIdActivo} />
            )}
          </div>
        </section>
      </div>

      <footer className="app-footer">
        <div className="footer-badges">
          <span>CloudTrail</span>
          <span>API Gateway</span>
          <span>Lambda</span>
          <span>DynamoDB</span>
        </div>
        <p>Transacciones auditadas en tiempo real</p>
      </footer>
    </div>
  );
}

export default App;
