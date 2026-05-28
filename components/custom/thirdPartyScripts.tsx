'use client';

import Script from 'next/script';
import { usePathname, useSearchParams } from 'next/navigation';
import { useEffect, Suspense } from 'react';

interface ThirdPartyAnalyticsProps {
    GA_MEASUREMENT_ID: string;
    GA_TRACKING_ID?: string; // Added for Google Analytics 4 (gtag.js)
    FB_PIXEL_ID: string;
    CLARITY_ID?: string;
}

// Extend the Window interface to include dataLayer, fbq, and gtag
declare global {
    interface Window {
        dataLayer: any[];
        fbq: (command: string, event: string, params?: any) => void;
        _fbq: any;
        gtag: (...args: any[]) => void;
    }
}

function ThirdPartyAnalyticsContent({ 
    GA_MEASUREMENT_ID, 
    GA_TRACKING_ID, 
    FB_PIXEL_ID, 
    CLARITY_ID 
}: ThirdPartyAnalyticsProps) {
    const pathname = usePathname()
    const searchParams = useSearchParams()

    // Handle page views for Google Tag Manager
    useEffect(() => {
        if (typeof window.dataLayer !== 'undefined') {
            window.dataLayer.push({
                event: 'pageview',
                page: pathname,
                search: searchParams.toString(),
            })
        }
    }, [pathname, searchParams])

    // Handle page views for Google Analytics
    useEffect(() => {
        if (GA_TRACKING_ID && typeof window.gtag !== 'undefined') {
            window.gtag('config', GA_TRACKING_ID, {
                page_path: pathname + (searchParams.toString() ? `?${searchParams.toString()}` : ''),
            });
        }
    }, [GA_TRACKING_ID, pathname, searchParams]);

    // Handle page views for Meta Pixel
    useEffect(() => {
        if (typeof window.fbq !== 'undefined') {
            window.fbq('track', 'PageView');
        }
    }, [pathname, searchParams]);

    return (
        <>
            {/* Google Tag Manager Script */}
            {GA_MEASUREMENT_ID && <Script
                id="google-tag-manager"
                strategy="afterInteractive"
                dangerouslySetInnerHTML={{
                    __html: `
          (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
          new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
          j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
          'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
          })(window,document,'script','dataLayer','${GA_MEASUREMENT_ID}');
          `,
                }}
            />}

            {/* Google Analytics 4 (gtag.js) */}
            {GA_TRACKING_ID && (
                <>
                    <Script
                        src={`https://www.googletagmanager.com/gtag/js?id=${GA_TRACKING_ID}`}
                        strategy="afterInteractive"
                    />
                    <Script
                        id="google-analytics"
                        strategy="afterInteractive"
                        dangerouslySetInnerHTML={{
                            __html: `
                                window.dataLayer = window.dataLayer || [];
                                function gtag(){dataLayer.push(arguments);}
                                gtag('js', new Date());
                                gtag('config', '${GA_TRACKING_ID}', {
                                    page_path: window.location.pathname + window.location.search
                                });
                            `,
                        }}
                    />
                </>
            )}

            {/* Meta Pixel Code */}
            {FB_PIXEL_ID && <Script
                id="meta-pixel"
                strategy="afterInteractive"
                dangerouslySetInnerHTML={{
                    __html: `
          !function(f,b,e,v,n,t,s)
          {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
          n.callMethod.apply(n,arguments):n.queue.push(arguments)};
          if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
          n.queue=[];t=b.createElement(e);t.async=!0;
          t.src=v;s=b.getElementsByTagName(e)[0];
          s.parentNode.insertBefore(t,s)}(window, document,'script',
          'https://connect.facebook.net/en_US/fbevents.js');
          fbq('init', '${FB_PIXEL_ID}');
          fbq('track', 'PageView');
          `,
                }}
            />}

            {/* MS Clarity */}
            {CLARITY_ID && <Script
                id="ms-clarity"
                strategy="afterInteractive"
                dangerouslySetInnerHTML={{
                    __html: `
          (function(c,l,a,r,i,t,y){
        c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
        t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
        y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
    })(window, document, "clarity", "script", "${CLARITY_ID}");
          `,
                }}
            />}

            {/* NoScript Tags */}
            <noscript>
                {GA_MEASUREMENT_ID && <iframe
                    src={`https://www.googletagmanager.com/ns.html?id=${GA_MEASUREMENT_ID}`}
                    height="0"
                    width="0"
                    style={{ display: 'none', visibility: 'hidden' }}
                />}
                {FB_PIXEL_ID && <img
                    height="1"
                    width="1"
                    style={{ display: 'none' }}
                    src={`https://www.facebook.com/tr?id=${FB_PIXEL_ID}&ev=PageView&noscript=1`}
                    alt=""
                />}
            </noscript>
        </>
    );
}

export default function ThirdPartyAnalytics(props: ThirdPartyAnalyticsProps) {
    return (
        <Suspense fallback={null}>
            <ThirdPartyAnalyticsContent {...props} />
        </Suspense>
    );
}