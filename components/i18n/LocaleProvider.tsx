'use client';

import { createContext, useContext } from 'react';

import type { Locale } from '@/lib/i18n/config';
import { DEFAULT_LOCALE } from '@/lib/i18n/config';
import { getDictionary, type Dictionary } from '@/lib/i18n/dictionaries';

interface LocaleValue {
    locale: Locale;
    t: Dictionary;
}

const LocaleContext = createContext<LocaleValue>({
    locale: DEFAULT_LOCALE,
    t: getDictionary(DEFAULT_LOCALE),
});

/**
 * Supplies the active locale to client components.
 *
 * Most of this UI is client-rendered and several strings sit four levels deep
 * — the wizard steps, the course table — so a context beats threading a
 * dictionary through every prop list. Server components skip this and call
 * getDictionary directly.
 */
export function LocaleProvider({
    locale,
    children,
}: {
    locale: Locale;
    children: React.ReactNode;
}) {
    return (
        <LocaleContext.Provider value={{ locale, t: getDictionary(locale) }}>
            {children}
        </LocaleContext.Provider>
    );
}

export function useI18n(): LocaleValue {
    return useContext(LocaleContext);
}
