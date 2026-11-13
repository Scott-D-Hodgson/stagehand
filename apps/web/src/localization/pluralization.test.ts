import i18next from 'i18next'
import { describe, expect, it } from 'vitest'
import { interfaceResources } from './resources'

describe('validation issue pluralization', () => {
  it('uses the Canadian English zero, one, and other wording', async () => {
    const instance = i18next.createInstance()
    await instance.init({ lng: 'en-CA', resources: interfaceResources })
    expect(instance.t('editor.invalidPlan', { count: 0 })).toBe('No validation issues found in the bundled sample.')
    expect(instance.t('editor.invalidPlan', { count: 1 })).toBe('A validation issue found in the bundled sample.')
    expect(instance.t('editor.invalidPlan', { count: 2 })).toBe('2 validation issues found in the bundled sample.')
  })

  it('uses the Canadian French zero, one, and other wording', async () => {
    const instance = i18next.createInstance()
    await instance.init({ lng: 'fr-CA', resources: interfaceResources })
    expect(instance.t('editor.invalidPlan', { count: 0 })).toBe('Aucun problème de validation n’a été trouvé dans l’exemple intégré.')
    expect(instance.t('editor.invalidPlan', { count: 1 })).toBe('Un problème de validation a été trouvé dans l’exemple intégré.')
    expect(instance.t('editor.invalidPlan', { count: 2 })).toBe('2 problèmes de validation ont été trouvés dans l’exemple intégré.')
  })
  it('uses the Canadian English step-validation wording', async () => {
    const instance = i18next.createInstance();
    await instance.init({ lng: 'en-CA', resources: interfaceResources });
    expect(instance.t('editor.invalidStepSummary', { count: 0 })).toBe('No invalid steps found.');
    expect(instance.t('editor.invalidStepSummary', { count: 1 })).toBe('A step needs attention.');
    expect(instance.t('editor.invalidStepSummary', { count: 2 })).toBe('2 steps need attention.');
  })

  it('provides a localized title for the blocking conflict-resolution dialog', async () => {
    const english = i18next.createInstance();
    await english.init({ lng: 'en-CA', resources: interfaceResources });
    const french = i18next.createInstance();
    await french.init({ lng: 'fr-CA', resources: interfaceResources });
    expect(english.t('editor.conflictTitle')).toBe('Resolve draft conflict');
    expect(french.t('editor.conflictTitle')).toBe('Résoudre le conflit de brouillon');
  });
})
