import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  { component: { template: '<div />' }, name: 'home', path: '/' },
  { component: { template: '<div />' }, name: 'plan', path: '/plan' },
  { component: { template: '<div />' }, name: 'variable', path: '/plan/variable/:variableName' },
  { component: { template: '<div />' }, name: 'case', path: '/plan/card/:cardIndex(\\d+)' },
  { component: { template: '<div />' }, name: 'step', path: '/plan/card/:cardIndex(\\d+)/step/:stepIndex(\\d+)' },
  { component: { template: '<div />' }, name: 'wait', path: '/plan/card/:cardIndex(\\d+)/step/:stepIndex(\\d+)/wait/:position(before|after)/:waitIndex(\\d+)' },
];

export const router = createRouter({
  history: createWebHistory(),
  routes,
});
