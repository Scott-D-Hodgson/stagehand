export type StepAction = 'assertHtml' | 'assertText' | 'assertValue' | 'click' | 'fill' | 'navigate' | 'selectOption' | 'type';

export const stepActionIcons: Record<StepAction, string> = {
  assertHtml: 'fa-solid fa-code',
  assertText: 'fa-solid fa-message-check',
  assertValue: 'fa-solid fa-input-text',
  click: 'fa-solid fa-arrow-pointer',
  fill: 'fa-solid fa-pen-to-square',
  navigate: 'fa-solid fa-location-arrow',
  selectOption: 'fa-solid fa-list-dropdown',
  type: 'fa-solid fa-keyboard',
};
