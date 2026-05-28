const API = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000';

function getToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('ls_token');
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = getToken();
  const res = await fetch(`${API}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });
  const data = await res.json();
  if (!data.success) throw new ApiError(data.error?.code ?? 'UNKNOWN', data.error?.message ?? 'Request failed', res.status);
  return data.data as T;
}

async function upload<T>(path: string, formData: FormData): Promise<T> {
  const token = getToken();
  const res = await fetch(`${API}${path}`, {
    method: 'POST',
    headers: { ...(token ? { Authorization: `Bearer ${token}` } : {}) },
    body: formData,
  });
  const data = await res.json();
  if (!data.success) throw new ApiError(data.error?.code ?? 'UNKNOWN', data.error?.message ?? 'Request failed', res.status);
  return data.data as T;
}

export class ApiError extends Error {
  constructor(public code: string, message: string, public status: number) { super(message); }
}

// ── Auth ───────────────────────────────────────────────────────────────────
export const authApi = {
  login:    (email: string, password: string) =>
    request<{ token: string; agent: any; organization: any }>('/api/auth/login',
      { method: 'POST', body: JSON.stringify({ email, password }) }),
  register: (orgName: string, name: string, email: string, password: string) =>
    request<{ token: string; agent: any; organization: any }>('/api/auth/register',
      { method: 'POST', body: JSON.stringify({ orgName, name, email, password }) }),
  me: () => request<{ agent: any; organization: any }>('/api/auth/me'),
};

// ── Conversations ──────────────────────────────────────────────────────────
export const conversationsApi = {
  list: (params?: { status?: string; assignedAgentId?: string; page?: number; search?: string; chatbotId?: string }) => {
    const q = new URLSearchParams();
    if (params?.status)          q.set('status', params.status);
    if (params?.assignedAgentId) q.set('assignedAgentId', params.assignedAgentId);
    if (params?.page)            q.set('page', String(params.page));
    if (params?.search)          q.set('search', params.search);
    if (params?.chatbotId)       q.set('chatbotId', params.chatbotId);
    return request<{ items: any[]; total: number; hasMore: boolean }>(`/api/conversations?${q}`);
  },
  get:            (id: string) => request<any>(`/api/conversations/${id}`),
  sendMessage:    (id: string, content: string, isInternalNote = false, isAiSuggested = false) =>
    request<any>(`/api/conversations/${id}/messages`,
      { method: 'POST', body: JSON.stringify({ content, isInternalNote, isAiSuggested }) }),
  getSuggestions: (id: string) => request<{ suggestions: string[] }>(`/api/conversations/${id}/suggestions`),
  assign:         (id: string, agentId: string) =>
    request<any>(`/api/conversations/${id}/assign`, { method: 'POST', body: JSON.stringify({ agentId }) }),
  resolve:        (id: string) => request<any>(`/api/conversations/${id}/resolve`, { method: 'POST' }),
  handoff:        (id: string, reason?: string) =>
    request<any>(`/api/conversations/${id}/handoff`, { method: 'POST', body: JSON.stringify({ reason }) }),
  delete:         (id: string) => request<void>(`/api/conversations/${id}`, { method: 'DELETE' }),
};

// ── Analytics ──────────────────────────────────────────────────────────────
export const analyticsApi = {
  overview: (from?: string, to?: string) => {
    const q = new URLSearchParams();
    if (from) q.set('from', from); if (to) q.set('to', to);
    return request<any>(`/api/analytics/overview?${q}`);
  },
  agents: () => request<any[]>('/api/analytics/agents'),
};

// ── Billing ────────────────────────────────────────────────────────────────
export const billingApi = {
  plans:        () => request<any>('/api/billing/plans'),
  subscription: () => request<any>('/api/billing/subscription'),
  checkout:     (priceId: string, agentCount = 1, yearly = false) =>
    request<{ url: string }>('/api/billing/checkout',
      { method: 'POST', body: JSON.stringify({ priceId, agentCount, yearly }) }),
  portal: () => request<{ url: string }>('/api/billing/portal', { method: 'POST' }),
};

// ── Canned responses ──────────────────────────────────────────────────────
export const cannedApi = {
  list:   (search?: string) => {
    const q = search ? `?search=${encodeURIComponent(search)}` : '';
    return request<any[]>(`/api/canned${q}`);
  },
  create: (data: { shortcut: string; title: string; content: string }) =>
    request<any>('/api/canned', { method: 'POST', body: JSON.stringify(data) }),
  update: (id: string, data: Partial<{ shortcut: string; title: string; content: string }>) =>
    request<any>(`/api/canned/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id: string) => request<void>(`/api/canned/${id}`, { method: 'DELETE' }),
};

// ── Widget settings ───────────────────────────────────────────────────────
export const widgetSettingsApi = {
  get:           () => request<any>('/api/widget-settings'),
  update:        (data: any) => request<any>('/api/widget-settings', { method: 'PATCH', body: JSON.stringify(data) }),
  regenerateKey: () => request<{ widgetKey: string }>('/api/widget-settings/regenerate-key', { method: 'POST' }),
};

// ── Webhooks ──────────────────────────────────────────────────────────────
export const webhooksApi = {
  list:   () => request<any[]>('/api/webhooks'),
  create: (url: string, events: string[]) =>
    request<any>('/api/webhooks', { method: 'POST', body: JSON.stringify({ url, events }) }),
  update: (id: string, data: any) =>
    request<any>(`/api/webhooks/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
  delete: (id: string) => request<void>(`/api/webhooks/${id}`, { method: 'DELETE' }),
  test:   (id: string) => request<any>(`/api/webhooks/${id}/test`, { method: 'POST' }),
};

// ── Knowledge Base ────────────────────────────────────────────────────────
export const knowledgeApi = {
  list:        () => request<any[]>('/api/knowledge'),
  createUrl:   (title: string, url: string) =>
    request<any>('/api/knowledge/url', { method: 'POST', body: JSON.stringify({ title, url }) }),
  createManual:(title: string, content: string) =>
    request<any>('/api/knowledge/manual', { method: 'POST', body: JSON.stringify({ title, content }) }),
  uploadFile:  (title: string, file: File) => {
    const fd = new FormData(); fd.append('title', title); fd.append('file', file);
    return upload<any>('/api/knowledge/file', fd);
  },
  delete:      (id: string) => request<void>(`/api/knowledge/${id}`, { method: 'DELETE' }),
  reindex:     (id: string) => request<any>(`/api/knowledge/${id}/reindex`, { method: 'POST' }),
};

// ── Chatbots ──────────────────────────────────────────────────────────────
export const chatbotApi = {
  list:        () => request<any[]>('/api/chatbots'),
  get:         (id: string) => request<any>(`/api/chatbots/${id}`),
  create:      (data: any) => request<any>('/api/chatbots', { method: 'POST', body: JSON.stringify(data) }),
  update:      (id: string, data: any) =>
    request<any>(`/api/chatbots/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
  delete:      (id: string) => request<void>(`/api/chatbots/${id}`, { method: 'DELETE' }),
  addKnowledge:(id: string, knowledgeSourceId: string) =>
    request<any>(`/api/chatbots/${id}/knowledge`, { method: 'POST', body: JSON.stringify({ knowledgeSourceId }) }),
  removeKnowledge: (id: string, knowledgeSourceId: string) =>
    request<void>(`/api/chatbots/${id}/knowledge/${knowledgeSourceId}`, { method: 'DELETE' }),
  activate:    (id: string) => request<any>(`/api/chatbots/${id}/activate`, { method: 'POST' }),
  pause:       (id: string) => request<any>(`/api/chatbots/${id}/pause`, { method: 'POST' }),
};
