import { definePreset } from '@primeng/themes';
import Aura from '@primeng/themes/aura';

import { CORES_MARCA } from './theme/colors';

/** Tema do PrimeNG derivado do "Aura", com a cor primária da marca. */
export const PrimeNgPreset = definePreset(Aura, {
  semantic: {
    primary: { ...CORES_MARCA },
  },
});

export const PRIMENG_THEME_OPTIONS = {
  darkModeSelector: '.app-dark',
  cssLayer: {
    name: 'primeng',
    order: 'tailwind-base, primeng, tailwind-utilities',
  },
};
