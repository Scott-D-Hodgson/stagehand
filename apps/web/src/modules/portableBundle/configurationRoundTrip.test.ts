import { describe, expect, it } from 'vitest';
import type { EditorBundleDraft } from '../../services/planDraftService';
import { preparePortableBundleExport } from './exportService';
import { readPortableBundleFile } from './importService';

/*
Creates one valid bundle containing the implemented M11 configuration surface.
---
Inputs: None.
---
Output: A representative editable plan and case bundle for preservation checks.
*/
function createM11ConfigurationBundle(): EditorBundleDraft {
  return {
    cases: {
      'cases/account.json': {
        id: 'account',
        settings: {
          accessibility: { enabled: false, failOnViolation: false, tags: [] },
          browser: { timeZone: 'Europe/Paris', viewport: { height: 900, width: 1440 } },
          timeout: 20_000,
        },
        steps: [
          {
            action: 'navigate',
            after: [{ timeout: 5_000, waitForState: 'networkidle' }],
            before: [{ delay: 250 }],
            protocol: 'https://',
            timeout: 15_000,
            url: 'example.test/account',
          },
          {
            action: 'click',
            after: [{ delay: 100 }],
            before: [{ timeout: 2_000, waitFor: { name: 'Sign in', role: 'button' } }],
            locator: { name: 'Continue', role: 'button' },
            scrollIntoView: false,
            timeout: 10_000,
          },
          {
            action: 'type',
            locator: { name: 'Email', role: 'textbox' },
            text: 'author@example.test',
          },
          {
            action: 'fill',
            locator: { name: 'Name', role: 'textbox' },
            value: 'Stagehand Author',
          },
          {
            action: 'selectOption',
            label: 'Canada',
            locator: { name: 'Country', role: 'combobox' },
          },
          {
            action: 'assertText',
            expected: { default: 'Welcome', locales: { 'fr-CA': 'Bienvenue' } },
            locator: { name: 'Welcome', role: 'heading' },
            soft: true,
          },
          {
            action: 'assertHtml',
            expected: { default: '<strong>Welcome</strong>', locales: { 'fr-CA': '<strong>Bienvenue</strong>' } },
            locator: { name: 'Welcome', role: 'heading' },
          },
          {
            action: 'assertValue',
            associatedLabel: { default: 'Email address', locales: { 'fr-CA': 'Adresse courriel' } },
            before: [{ timeout: 2_000, waitFor: { name: 'Email', role: 'textbox' } }],
            expected: { default: 'author@example.test', locales: { 'fr-CA': 'auteur@example.test' } },
            locator: { name: 'Email', role: 'textbox' },
            soft: true,
          },
        ],
        version: 1,
      },
    },
    plan: {
      cases: [{ path: 'cases/account.json' }],
      defaults: {
        accessibility: { enabled: true, failOnViolation: true, tags: ['wcag2a'] },
        browser: { headless: false, timeZone: 'America/Toronto', type: 'chromium', viewport: { height: 720, width: 1280 } },
        locale: 'fr-CA',
        timeout: 30_000,
      },
      id: 'm11-configuration',
      version: 1,
    },
  };
}

describe('M11 configuration portable-bundle preservation', () => {
  it('retains action and assertion variable references through recovery copying and ZIP export and import', async () => {
    const draft = createM11ConfigurationBundle();
    draft.plan.variables = { email: { default: { env: 'STAGEHAND_EMAIL' } } };
    draft.cases['cases/account.json']!.steps[0] = { action: 'navigate', protocol: 'https://', url: { var: 'email' }, before: [{ delay: 250 }], after: [{ waitForState: 'networkidle' }] };
    draft.cases['cases/account.json']!.steps[2] = { action: 'type', locator: { role: 'textbox', name: 'Email' }, text: { var: 'email' } };
    draft.cases['cases/account.json']!.steps[3] = { action: 'fill', locator: { role: 'textbox', name: 'Name' }, value: { var: 'email' } };
    draft.cases['cases/account.json']!.steps[4] = { action: 'selectOption', locator: { role: 'combobox', name: 'Country' }, value: { var: 'email' } };
    draft.cases['cases/account.json']!.steps.push({ action: 'selectOption', locator: { role: 'combobox', name: 'Region' }, label: { var: 'email' } });
    draft.cases['cases/account.json']!.steps.push({ action: 'assertText', locator: { role: 'heading' }, expected: { default: { var: 'email' }, locales: { 'fr-CA': 'Bienvenue' } } });
    draft.cases['cases/account.json']!.steps.push({ action: 'assertHtml', locator: { role: 'main' }, expected: { default: { var: 'email' }, locales: { 'fr-CA': '<p>Bienvenue</p>' } }, before: [{ delay: 100 }] });
    draft.cases['cases/account.json']!.steps.push({ action: 'assertValue', locator: { role: 'textbox' }, expected: { default: { var: 'email' }, locales: { 'fr-CA': 'valeur' } }, associatedLabel: { default: 'Email' }, after: [{ delay: 100 }] });
    const { copyEditorBundleDraft } = await import('../../services/planDraftService');
    const snapshot = copyEditorBundleDraft(draft);
    const exported = preparePortableBundleExport(snapshot);
    expect(exported.valid).toBe(true);
    if (!exported.valid) {
      return;
    }
    const imported = await readPortableBundleFile({ arrayBuffer: async () => Uint8Array.from(exported.bundle.bytes).buffer as ArrayBuffer });
    expect(imported).toEqual({ valid: true, draft });
  });

  it('round-trips plan, case, waits, localized assertions, and associated-label expectations', async () => {
    const draft = createM11ConfigurationBundle();
    const exported = preparePortableBundleExport(draft);
    expect(exported).toMatchObject({ valid: true });
    if (!exported.valid) {
      return;
    }
    const imported = await readPortableBundleFile({
      arrayBuffer: async () => Uint8Array.from(exported.bundle.bytes).buffer as ArrayBuffer,
    });
    expect(imported).toEqual({ valid: true, draft });
  });
});
