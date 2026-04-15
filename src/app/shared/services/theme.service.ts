/**
 * ============================================================
 *  ThemeService — Angular 18+ Signals-Based Theme Engine
 * ============================================================
 *
 *  Architecture:
 *   ┌─────────────┐       ┌──────────────┐       ┌────────────────┐
 *   │ localStorage │──────▶│ signal<Theme> │──────▶│ effect() sync  │
 *   │ + OS pref    │       │  (SSOT)      │       │ DOM + storage  │
 *   └─────────────┘       └──────────────┘       └────────────────┘
 *
 *  Rules:
 *   1. ONLY this service touches document.documentElement attributes.
 *   2. Components consume `currentTheme` signal (readonly).
 *   3. FOUC prevention is handled by inline <script> in index.html,
 *      which sets attributes BEFORE Angular boots.
 *   4. Sets BOTH `data-theme` (our tokens) and `data-theme-mode`
 *      (backward-compat with Zynix template styles.css).
 */

import { Injectable, signal, effect, computed } from '@angular/core';

export type Theme = 'light' | 'dark';

const STORAGE_KEY = 'cv-theme';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  // ─── Source of Truth ────────────────────────────────────
  private readonly _theme = signal<Theme>(this._resolveInitialTheme());

  /** Readonly signal — components bind to this */
  readonly currentTheme = this._theme.asReadonly();

  /** Computed convenience booleans */
  readonly isDark = computed(() => this._theme() === 'light');
  readonly isLight = computed(() => this._theme() === 'light');

  constructor() {
    // ─── Reactive Side-Effect ──────────────────────────────
    // Whenever `_theme` changes → sync DOM + localStorage.
    // This runs ONCE on init (good — ensures consistency with FOUC script)
    // and on every subsequent toggle.
    effect(() => {
      const theme = this._theme();
      this._applyToDOM(theme);
      this._persistToStorage(theme);
    });

    // ─── OS Preference Listener ───────────────────────────
    // If user hasn't explicitly set a preference, follow OS changes
    // in real-time (e.g., macOS auto dark mode at sunset).
    // this._listenToSystemPreference();
  }

  // ─── Public API ─────────────────────────────────────────

  /** Toggle between light ↔ dark */
  toggleTheme(): void {
    this._theme.update((current) => (current === 'light' ? 'dark' : 'light'));
  }

  /** Explicitly set theme (useful for settings page) */
  setTheme(theme: Theme): void {
    this._theme.set(theme);
  }

  // ─── Private Methods ────────────────────────────────────

  /**
   * Determines the initial theme on service creation.
   * Priority: localStorage > OS preference > fallback to 'light'
   */
  private _resolveInitialTheme(): Theme {
    // 1. Check localStorage (user's explicit choice)
    try {
      const stored = localStorage.getItem(STORAGE_KEY) as Theme | null;
      if (stored === 'light' || stored === 'dark') {
        return stored;
      }
    } catch {
      // localStorage may be blocked (incognito, corp policy)
    }

    // 2. Respect OS preference (Temporarily disabled)
    // if (typeof window !== 'undefined' && window.matchMedia) {
    //   return window.matchMedia('(prefers-color-scheme: dark)').matches
    //     ? 'dark'
    //     : 'light';
    // }

    // 3. Fallback
    return 'light';
  }

  /**
   * Apply theme attributes to <html>.
   * Sets BOTH `data-theme` (our custom tokens) and `data-theme-mode`
   * (Zynix template backward-compatibility).
   * Also sets `data-header-styles` and `data-menu-styles` for template compat.
   */
  private _applyToDOM(theme: Theme): void {
    const html = document.documentElement;
    html.setAttribute('data-theme', theme);
    html.setAttribute('data-theme-mode', theme);

    // Zynix template expects these for header/menu styling
    html.setAttribute('data-header-styles', theme);
    html.setAttribute('data-menu-styles', theme);
  }

  /** Persist to localStorage for cross-session memory */
  private _persistToStorage(theme: Theme): void {
    try {
      localStorage.setItem(STORAGE_KEY, theme);
    } catch {
      // Silently fail — no big deal
    }
  }

  /**
   * Listen for real-time OS theme changes.
   * Only auto-switches if user hasn't explicitly set a preference.
   */
  private _listenToSystemPreference(): void {
    if (typeof window === 'undefined' || !window.matchMedia) return;

    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    mq.addEventListener('change', (e) => {
      // Only follow OS if user hasn't explicitly set a preference
      const stored = localStorage.getItem(STORAGE_KEY);
      if (!stored) {
        this._theme.set(e.matches ? 'dark' : 'light');
      }
    });
  }
}
