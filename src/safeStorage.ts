/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

const inMemoryStore: Record<string, string> = {};

export const safeStorage = {
  getItem: (key: string): string | null => {
    try {
      return localStorage.getItem(key);
    } catch (e) {
      console.warn(`[SafeStorage] Storage block detected for getItem(${key}). Using in-memory fallback.`, e);
      return inMemoryStore[key] || null;
    }
  },
  setItem: (key: string, value: string): void => {
    try {
      localStorage.setItem(key, value);
    } catch (e) {
      console.warn(`[SafeStorage] Storage block detected for setItem(${key}). Using in-memory fallback.`, e);
      inMemoryStore[key] = value;
    }
  },
  removeItem: (key: string): void => {
    try {
      localStorage.removeItem(key);
    } catch (e) {
      console.warn(`[SafeStorage] Storage block detected for removeItem(${key}). Using in-memory fallback.`, e);
      delete inMemoryStore[key];
    }
  }
};
