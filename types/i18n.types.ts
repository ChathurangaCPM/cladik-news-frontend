export interface Dictionary {
    onBoarding: {
        greeting: string;
        step1Description?: string;
        footerText?: string;
    },
    homePage: {
        badge: string;
        heroTitle: string;
        heroDescription: string;
        ctaPrimary: string;
        ctaSecondary: string;
        aiModes: {
            badge: string;
            title: string;
            titleHighlight: string;
            description: string;
            commonMode: {
                badge: string;
                title: string;
                description: string;
                features: string[];
                chatFeel: string;
            };
            educationMode: {
                badge: string;
                title: string;
                description: string;
                features: string[];
                context: string;
            };
        };
        features: {
            badge: string;
            title: string;
            titleHighlight: string;
            description: string;
            items: {
                multilingual: { title: string; desc: string };
                education: { title: string; desc: string };
                security: { title: string; desc: string };
                culture: { title: string; desc: string };
                credits: { title: string; desc: string };
                smartAI: { title: string; desc: string };
            };
        };
        howItWorks: {
            badge: string;
            title: string;
            titleHighlight: string;
            description: string;
            steps: {
                step1: { title: string; desc: string };
                step2: { title: string; desc: string };
                step3: { title: string; desc: string };
            };
        };
        testimonials: {
            badge: string;
            title: string;
            titleHighlight: string;
            description: string;
            reviews: {
                user1: { name: string; role: string; text: string };
                user2: { name: string; role: string; text: string };
                user3: { name: string; role: string; text: string };
            };
        };
        finalCta: {
            title: string;
            description: string;
            button: string;
        };
    },
    aboutPage: {
        heroBadge: string;
        heroTitle: string;
        heroDescription: string;
        missionTitle: string;
        missionDesc: string;
        visionTitle: string;
        visionDesc: string;
        valuesTitle: string;
        valuesSubtitle: string;
        values: {
            nativeFirst: { title: string; desc: string };
            innovation: { title: string; desc: string };
            privacy: { title: string; desc: string };
            userCentric: { title: string; desc: string };
            excellence: { title: string; desc: string };
            ecosystem: { title: string; desc: string };
        };
        ctaTitle: string;
        ctaDesc: string;
        ctaButton: string;
    },
    contactPage: {
        heroBadge: string;
        heroTitle: string;
        heroDescription: string;
        form: {
            name: string;
            email: string;
            subject: string;
            message: string;
            submit: string;
            submitting: string;
            successTitle: string;
            successDesc: string;
            sendAnother: string;
        };
        info: {
            emailTitle: string;
            emailDesc: string;
            whatsappTitle: string;
            whatsappDesc: string;
            locationTitle: string;
            locationDesc: string;
            locationValue: string;
        };
        socialTitle: string;
        socialDesc: string;
        ctaTitle: string;
        ctaDesc: string;
        ctaButton: string;
    },
    navigation: {
        home: string;
        about: string;
        contact: string;
    },
    chatWriter: {
        greeting?: string;
        greetingExtendEducation?: string;
        greetingExtendCommon?: string;
    },

    tokens: {
        popupTitle?: string;
        popupDescription?: string;
        dailyLimitMessage?: string;
        totalTokenUsed?: string;
        averageTokenPerChat?: string;
        lastUpdate?: string;
        remainingTodayTokens?: string;
        resetsIn?: string;
    },
    chatHistory: {
        title?: string;
        tagline?: string;
    },
    login: {
        tagline: string;
    },
    chatTypes: {
        popupTitle?: string;
        popupDescription?: string;
        educationTitle?: string;
        educationDescription?: string;
        commonTitle?: string;
        commonDescription?: string;
    },
    welcomeScreen: {
        greeting: string;
        description: string;
    },
    welcome: {
        title: string;
        description: string;
    };

    // community
    community: {
        createNewTitle?: string
        createNewDescription?: string
    },


    createShop: {
        addFirstProduct: {
            title: string
            description: string
            submitButton?: string
            submittingButton?: string
        }
        inputLabel?: any;
    },
    help: {
        title: string;
        subtitle: string;
        description: string;
        searchPlaceholder: string;
        topics: {
            credits: {
                title: string;
                description: string;
                heroBadge?: string;
                heroTitle?: string;
                heroSubtitle?: string;
                intro?: string;
                whatAreCreditsTitle?: string;
                whatAreCreditsContent?: string;
                howCalculatedTitle?: string;
                howCalculatedContent?: string;
                metrics?: {
                    prompt?: { title: string; desc: string; };
                    completion?: { title: string; desc: string; };
                    total?: { title: string; desc: string; };
                };
                limitsTitle?: string;
                limitsIntro?: string;
                limit1?: string;
                limit2?: string;
                limit3?: string;
            };
            privacy: { title: string; description: string; };
            terms: { title: string; description: string; };
            refund: { title: string; description: string; };
        };
        legal: {
            lastUpdated: string;
            jurisdiction: string;
            officeAddress: string;
            emailSupport: string;
            phone: string;
            supportHours: string;
            noteTitle: string;
        }
    },
    footer: {
        description: string;
        product: string;
        company: string;
        support: string;
        getInTouch: string;
        links: {
            aiChat: string;
            educationMode: string;
            pricing: string;
            features: string;
            aboutUs: string;
            contactUs: string;
            careers: string;
            helpCenter: string;
            creditCalc: string;
            terms: string;
            privacy: string;
        };
        copyright: string;
    }
}
