export const i18n = {
    defaultLocale: 'si',
    locales: ['en', 'si'],
} as const;

export type Locale = (typeof i18n)['locales'][number];
