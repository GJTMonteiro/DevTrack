const API_URL = 'http://localhost:3000/api';

function getToken() {
  return localStorage.getItem('token');
}

async function apiFetch(endpoint: string, options: RequestInit = {}) {
  const token = getToken();

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,

    headers: {
      'Content-Type': 'application/json',

      ...(token && {
        Authorization: `Bearer ${token}`,
      }),

      ...options.headers,
    },
  });

  // =========================
  // READ RESPONSE
  // =========================

  const contentType = response.headers.get('content-type');

  let data: any;

  if (contentType?.includes('application/json')) {
    data = await response.json();
  } else {
    const text = await response.text();

    data = {
      message: text || `Request failed with status ${response.status}`,
    };
  }

  // =========================
  // ERROR
  // =========================

  if (!response.ok) {
    throw new Error(
      data?.message || `Request failed with status ${response.status}`,
    );
  }

  // =========================
  // SUCCESS
  // =========================

  return data;
}

export default apiFetch;
