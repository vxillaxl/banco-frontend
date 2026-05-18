import axios from 'axios';

const API_URL =
  process.env.REACT_APP_API_URL ||
  'https://1uab7218ah.execute-api.us-east-1.amazonaws.com/prod';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

function parsePayload(data) {
  if (!data) return data;
  if (typeof data.body === 'string') {
    try {
      return JSON.parse(data.body);
    } catch {
      return data;
    }
  }
  return data;
}

// Realizar transferencia
export const realizarTransferencia = async (datos) => {
  try {
    const response = await api.post('/transferencia', {
      fromAccount: datos.fromAccount,
      toAccount: datos.toAccount,
      amount: parseFloat(datos.amount),
      userId: datos.userId,
    });

    if (response.status === 200 || response.status === 202) {
      const payload = parsePayload(response.data);
      return {
        success: true,
        transactionId: payload.transactionId || payload.body?.transactionId,
        message: payload.message || 'Transferencia iniciada exitosamente',
      };
    }

    return { success: false, message: 'Respuesta inesperada del servidor' };
  } catch (error) {
    const errBody = error.response?.data;
    const parsed = typeof errBody?.body === 'string' ? errBody.body : errBody?.body;
    return {
      success: false,
      message: parsed || error.message || 'Error en transferencia',
    };
  }
};

// Realizar depósito
export const realizarDeposito = async (datos) => {
  try {
    const response = await api.post('/deposito', {
      accountId: datos.accountId,
      amount: parseFloat(datos.amount),
      userId: datos.userId,
    });

    if (response.status === 200 || response.status === 202) {
      const payload = parsePayload(response.data);
      return {
        success: true,
        transactionId: payload.transactionId,
        message: payload.message || 'Depósito realizado exitosamente',
      };
    }

    return { success: false, message: 'Respuesta inesperada del servidor' };
  } catch (error) {
    const errBody = error.response?.data;
    const parsed = typeof errBody?.body === 'string' ? errBody.body : errBody?.body;
    return {
      success: false,
      message: parsed || error.message || 'Error en depósito',
    };
  }
};

// Consultar historial
export const consultarHistorial = async (userId) => {
  try {
    const response = await api.get(`/consulta?userId=${encodeURIComponent(userId)}`);

    if (response.status === 200) {
      const data = parsePayload(response.data);
      let eventos = [];

      if (typeof data === 'string') {
        eventos = JSON.parse(data).eventos || [];
      } else if (data.eventos) {
        eventos = data.eventos;
      } else if (Array.isArray(data)) {
        eventos = data;
      }

      return {
        success: true,
        eventos,
        cantidad: eventos.length,
      };
    }

    return { success: false, message: 'Respuesta inesperada del servidor', eventos: [] };
  } catch (error) {
    const errBody = error.response?.data;
    const parsed = typeof errBody?.body === 'string' ? errBody.body : errBody?.body;
    return {
      success: false,
      message: parsed || error.message,
      eventos: [],
    };
  }
};

export default api;
