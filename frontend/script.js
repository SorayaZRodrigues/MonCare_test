// MonCare Frontend (Vanilla JS + Fetch API)
// Beginner-friendly structure with small reusable helper functions.

const API_BASE_URL = 'http://localhost:3000';
const TOKEN_KEY = 'moncare_token';
const USER_KEY = 'moncare_user';
const APPOINTMENTS_CACHE_KEY = 'moncare_appointment_ids';

const views = {
  login: document.getElementById('view-login'),
  register: document.getElementById('view-register'),
  dashboard: document.getElementById('view-dashboard'),
  services: document.getElementById('view-services'),
  'create-appointment': document.getElementById('view-create-appointment'),
  'my-appointments': document.getElementById('view-my-appointments')
};

const globalMessage = document.getElementById('globalMessage');
const topbar = document.getElementById('topbar');
const bottomNav = document.getElementById('bottomNav');
const logoutBtn = document.getElementById('logoutBtn');

const loginForm = document.getElementById('loginForm');
const registerForm = document.getElementById('registerForm');
const greetingTitle = document.getElementById('greetingTitle');
const servicesList = document.getElementById('servicesList');
const serviceSelect = document.getElementById('serviceSelect');
const appointmentForm = document.getElementById('appointmentForm');
const recentAppointment = document.getElementById('recentAppointment');
const appointmentsList = document.getElementById('appointmentsList');

let servicesCache = [];

function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

function getUser() {
  const raw = localStorage.getItem(USER_KEY);
  return raw ? JSON.parse(raw) : null;
}

function setSession(token, user) {
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(USER_KEY, JSON.stringify(user));
}

function clearSession() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
}

function setMessage(text, type = 'success') {
  globalMessage.textContent = text;
  globalMessage.className = `global-message ${type}`;
}

function clearMessage() {
  globalMessage.textContent = '';
  globalMessage.className = 'global-message';
}

function showView(viewName) {
  Object.values(views).forEach((view) => view.classList.remove('active'));
  views[viewName].classList.add('active');

  const isPrivateView = ['dashboard', 'services', 'create-appointment', 'my-appointments'].includes(viewName);
  topbar.classList.toggle('hidden', !isPrivateView);
  bottomNav.classList.toggle('hidden', !isPrivateView);
}

function guardPrivateView(targetView) {
  if (!getToken()) {
    showView('login');
    setMessage('Faça login para acessar o painel.', 'error');
    return false;
  }

  showView(targetView);
  return true;
}

async function apiRequest(path, options = {}) {
  const token = getToken();
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {})
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.message || 'Erro na comunicação com a API.');
  }

  return data;
}

async function handleLogin(event) {
  event.preventDefault();
  clearMessage();
  setMessage('Entrando...', 'success');

  const formData = new FormData(loginForm);
  const email = formData.get('email');
  const password = formData.get('password');

  try {
    const data = await apiRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password })
    });

    setSession(data.token, data.user);
    setMessage('Login realizado com sucesso.');
    await openDashboard();
  } catch (error) {
    setMessage(error.message, 'error');
  }
}

async function handleRegister(event) {
  event.preventDefault();
  clearMessage();

  const formData = new FormData(registerForm);
  const name = formData.get('name');
  const email = formData.get('email');
  const password = formData.get('password');
  const confirmPassword = formData.get('confirmPassword');

  if (password !== confirmPassword) {
    setMessage('As senhas não coincidem.', 'error');
    return;
  }

  setMessage('Cadastrando paciente...', 'success');

  try {
    await apiRequest('/auth/register/patient', {
      method: 'POST',
      body: JSON.stringify({ name, email, password })
    });

    setMessage('Cadastro realizado. Agora faça login.');
    registerForm.reset();
    showView('login');
  } catch (error) {
    setMessage(error.message, 'error');
  }
}

function renderServices(services) {
  servicesList.innerHTML = '';

  if (!services.length) {
    servicesList.innerHTML = '<article class="card">Nenhum serviço disponível no momento.</article>';
    return;
  }

  for (const service of services) {
    const card = document.createElement('article');
    card.className = 'card';
    card.innerHTML = `
      <h3>${service.name || 'Serviço'}</h3>
      <p class="soft-text">${service.description || 'Sem descrição cadastrada.'}</p>
    `;
    servicesList.appendChild(card);
  }
}

function fillServiceSelect(services) {
  serviceSelect.innerHTML = '<option value="">Selecione...</option>';

  for (const service of services) {
    const option = document.createElement('option');
    option.value = service.name;
    option.textContent = service.name;
    serviceSelect.appendChild(option);
  }
}

async function loadServices() {
  setMessage('Carregando serviços...', 'success');

  try {
    const data = await apiRequest('/services', { method: 'GET' });

    servicesCache = Array.isArray(data) ? data : data.services || [];
    renderServices(servicesCache);
    fillServiceSelect(servicesCache);
    setMessage('Serviços atualizados com sucesso.');
  } catch (error) {
    setMessage(error.message, 'error');
  }
}

function getCachedAppointmentIds() {
  const raw = localStorage.getItem(APPOINTMENTS_CACHE_KEY);
  return raw ? JSON.parse(raw) : [];
}

function cacheAppointmentId(id) {
  const ids = getCachedAppointmentIds();
  if (!ids.includes(id)) {
    ids.push(id);
    localStorage.setItem(APPOINTMENTS_CACHE_KEY, JSON.stringify(ids));
  }
}

function appointmentStatusBadge(status) {
  const normalized = (status || '').toLowerCase();
  const className = `status-${normalized}`;
  return `<span class="status-badge ${className}">${normalized || 'pending'}</span>`;
}

function renderRecentAppointment(appointment) {
  if (!appointment) {
    recentAppointment.textContent = 'Nenhum atendimento recente.';
    return;
  }

  recentAppointment.innerHTML = `
    <strong>${appointment.serviceName}</strong><br />
    <small>${appointmentStatusBadge(appointment.status)}</small><br />
    <small class="soft-text">Criado em ${new Date(appointment.createdAt).toLocaleString('pt-BR')}</small>
  `;
}

function renderAppointments(list) {
  appointmentsList.innerHTML = '';

  if (!list.length) {
    appointmentsList.innerHTML = '<article class="card">Nenhum atendimento encontrado.</article>';
    return;
  }

  for (const appointment of list) {
    const card = document.createElement('article');
    card.className = 'card';
    card.innerHTML = `
      <h3>${appointment.serviceName}</h3>
      <p><strong>Status:</strong> ${appointmentStatusBadge(appointment.status)}</p>
      <p><strong>Área:</strong> ${appointment.area || '-'}</p>
      <p><strong>Janela:</strong> ${appointment.window || '-'}</p>
      <p class="soft-text"><strong>Sintomas:</strong> ${(appointment.symptoms || []).join(', ') || '-'}</p>
    `;
    appointmentsList.appendChild(card);
  }
}

async function loadMyAppointments() {
  const appointmentIds = getCachedAppointmentIds();
  if (!appointmentIds.length) {
    renderRecentAppointment(null);
    renderAppointments([]);
    return;
  }

  setMessage('Carregando atendimentos...', 'success');

  try {
    const requests = appointmentIds.map((id) => apiRequest(`/appointments/${id}`, { method: 'GET' }));
    const loaded = await Promise.all(requests);
    const sorted = loaded.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    renderRecentAppointment(sorted[0]);
    renderAppointments(sorted);
    setMessage('Atendimentos carregados.');
  } catch (error) {
    setMessage(error.message, 'error');
  }
}

async function handleCreateAppointment(event) {
  event.preventDefault();
  clearMessage();

  const serviceName = serviceSelect.value;
  const symptomsText = document.getElementById('symptomsText').value.trim();

  if (!serviceName) {
    setMessage('Selecione um serviço.', 'error');
    return;
  }

  // Backend expects area and window. Kept simple defaults for beginner use.
  // If needed, these can be replaced by real form fields later.
  const payload = {
    serviceName,
    area: 'Downtown',
    window: '14:00 to 16:00',
    symptoms: symptomsText ? symptomsText.split(',').map((item) => item.trim()).filter(Boolean) : []
  };

  setMessage('Criando solicitação...', 'success');

  try {
    const data = await apiRequest('/appointments', {
      method: 'POST',
      body: JSON.stringify(payload)
    });

    cacheAppointmentId(data.id);
    appointmentForm.reset();
    setMessage('Atendimento solicitado com sucesso.');
    await loadMyAppointments();
    showView('my-appointments');
  } catch (error) {
    setMessage(error.message, 'error');
  }
}

async function openDashboard() {
  if (!guardPrivateView('dashboard')) return;

  const user = getUser();
  greetingTitle.textContent = `Olá, ${user?.name || 'paciente'}!`;

  await loadServices();
  await loadMyAppointments();
}

function attachNavigation() {
  document.querySelectorAll('[data-nav]').forEach((element) => {
    element.addEventListener('click', async () => {
      const target = element.dataset.nav;

      if (target === 'login' || target === 'register') {
        showView(target);
        clearMessage();
        return;
      }

      if (!guardPrivateView(target)) return;

      if (target === 'dashboard') await openDashboard();
      if (target === 'services') await loadServices();
      if (target === 'my-appointments') await loadMyAppointments();
      if (target === 'create-appointment' && !servicesCache.length) await loadServices();
    });
  });
}

function attachEvents() {
  loginForm.addEventListener('submit', handleLogin);
  registerForm.addEventListener('submit', handleRegister);
  appointmentForm.addEventListener('submit', handleCreateAppointment);

  logoutBtn.addEventListener('click', () => {
    clearSession();
    setMessage('Sessão encerrada com sucesso.');
    showView('login');
  });
}

async function init() {
  attachNavigation();
  attachEvents();

  if (getToken()) {
    await openDashboard();
  } else {
    showView('login');
  }
}

init();
