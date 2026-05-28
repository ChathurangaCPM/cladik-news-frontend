"use client";

import { getDictionary } from "@/app/i18n/get-dictionary";
import { Dictionary } from "@/types/i18n.types";
import { createContext, ReactNode, useContext, useEffect, useState } from "react";

type SupportedLanguages = 'si' | 'en';

interface UserLangContextType {
    lang?: SupportedLanguages;
    dictionary?: Dictionary;
    setLanguage: (lang: SupportedLanguages) => Promise<void>;
    isLoadingLangData: boolean;
}

interface UserLangProviderProps {
    children: ReactNode;
    initialLang?: SupportedLanguages;
    initialDictionary: Dictionary;
}

const LangContext = createContext<UserLangContextType | undefined>(undefined);

export function UserLangProvider({
    children,
    initialLang = 'en',
    initialDictionary
}: UserLangProviderProps) {
    const [lang, setLang] = useState<SupportedLanguages>(initialLang);
    const [dictionary, setDictionary] = useState<Dictionary>(initialDictionary);
    const [isLoadingLangData, setIsLoadingLangData] = useState(false);

    const setLanguage = async (newLang: SupportedLanguages) => {
        try {
            setIsLoadingLangData(true);
            const newDictionary = await getDictionary(newLang);
            setDictionary(newDictionary);
            setLang(newLang);

            if (typeof window !== 'undefined') {
                localStorage.setItem('userLanguage', newLang);
            }
        } catch (error) {
            console.error('Error setting language:', error);
        } finally {
            setIsLoadingLangData(false);
        }
    };

    // Load saved language on mount
    useEffect(() => {
        const loadSavedLanguage = async () => {
            if (typeof window !== 'undefined') {
                const savedLang = localStorage.getItem('userLanguage') as SupportedLanguages;
                const targetLang = savedLang || 'en';
                if (targetLang !== lang) {
                    await setLanguage(targetLang);
                }
            }
        };

        loadSavedLanguage();
    }, []);

    return (
        <LangContext.Provider value={{
            lang,
            dictionary,
            setLanguage,
            isLoadingLangData
        }}>
            <div className={`${lang === "si" ? "font-sinhala" : 'font-inter'}`}>{children}</div>
        </LangContext.Provider>
    );
}

export function useLangContext(): UserLangContextType {
    const context = useContext(LangContext);
    if (context === undefined) {
        throw new Error('useLangContext must be used within an UserLangProvider');
    }
    return context;
}
