import React, { useState, useEffect, useCallback } from 'react';
import TransferenciaForm from './components/TransferenciaForm';
import DepositoForm from './components/DepositoForm';
import HistorialTransacciones from './components/HistorialTransacciones';
import SaldoCuenta from './components/SaldoCuenta';
import { consultarSaldo } from './services/api';
import './App.css';

const TABS = [
  { id: 'transferencia', label: 'Transferencia', icon: '↗' },
  { id: 'deposito', label: 'Depósito', icon: '＋' },
  { id: 'historial', label: 'Historial', icon: '◎' },
];

function App() {
  const [activeTab, setActiveTab] = useState('transferencia');
  const [userIdActivo, setUserIdActivo] = useState('user-juan');
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [cuentaActiva] = useState('cuenta-001');
  const [saldo, setSaldo] = useState(0);
  const [saldoLoading, setSaldoLoading] = useState(true);
  const [saldoError, setSaldoError] = useState('');

  const fetchSaldo = useCallback(async () => {
    setSaldoLoading(true);
    setSaldoError('');
    const result = await consultarSaldo(cuentaActiva);
    if (result.success) {
      setSaldo(result.saldo);
    } else {
      setSaldoError(result.message);
    }
    setSaldoLoading(false);
  }, [cuentaActiva]);

  useEffect(() => {
    fetchSaldo();
  }, [fetchSaldo, refreshTrigger]);

  const handleSuccess = (userId) => {
    setUserIdActivo(userId);
    setRefreshTrigger((prev) => prev + 1);
  };

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

        <SaldoCuenta cuenta={cuentaActiva} saldo={saldo} loading={saldoLoading} error={saldoError} />

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
            {activeTab === 'transferencia' && <TransferenciaForm onSuccess={handleSuccess} />}
            {activeTab === 'deposito' && <DepositoForm onSuccess={handleSuccess} />}
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
