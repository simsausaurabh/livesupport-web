'use client';
import { create } from 'zustand';
import type { Agent } from '@/types';

interface Organization {
  id: string;
  name: string;
  slug: string;
  plan: string;
  widgetKey: string;
}

interface AuthState {
  token: string | null;
  agent: Agent | null;
  organization: Organization | null;
  isLoaded: boolean;

  setAuth: (
    token: string,
    agent: Agent,
    org: Organization
  ) => void;

  logout: () => void;
  load: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  token: null,
  agent: null,
  organization: null,
  isLoaded: false,

  load: () => {
    if (typeof window === 'undefined') return;

    try {
      const token = localStorage.getItem('ls_token');
      const agent = localStorage.getItem('ls_agent');
      const org = localStorage.getItem('ls_org');

      if (token && agent && org) {
        set({
          token,
          agent: JSON.parse(agent),
          organization: JSON.parse(org),
          isLoaded: true,
        });
      } else {
        set({ isLoaded: true });
      }
    } catch {
      set({ isLoaded: true });
    }
  },

  setAuth: (token, agent, org) => {
    localStorage.setItem('ls_token', token);
    localStorage.setItem('ls_agent', JSON.stringify(agent));
    localStorage.setItem('ls_org', JSON.stringify(org));

    set({
      token,
      agent,
      organization: org,
      isLoaded: true,
    });
  },

  logout: () => {
    localStorage.removeItem('ls_token');
    localStorage.removeItem('ls_agent');
    localStorage.removeItem('ls_org');

    set({
      token: null,
      agent: null,
      organization: null,
    });

    if (typeof window !== "undefined") {
      window.location.href = "/login";
    }
  },
}));
