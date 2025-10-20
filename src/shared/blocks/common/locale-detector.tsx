"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { useLocale } from "next-intl";
import { useRouter, usePathname } from "@/core/i18n/navigation";
import { locales, localeNames } from "@/config/locale";
import { X } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { cacheGet, cacheSet } from "@/shared/lib/cache";
import { getTimestamp } from "@/shared/lib/time";

const DISMISSED_KEY = "locale-suggestion-dismissed";
const DISMISSED_EXPIRY_DAYS = 1; // Expiry in days
const PREFERRED_LOCALE_KEY = "locale";

export function LocaleDetector() {
  const currentLocale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [showBanner, setShowBanner] = useState(false);
  const [browserLocale, setBrowserLocale] = useState<string | null>(null);
  const bannerRef = useRef<HTMLDivElement>(null);
  const hasCheckedRef = useRef(false);

  const detectBrowserLocale = (): string | null => {
    if (typeof window === "undefined") return null;

    const browserLang = navigator.language || (navigator as any).userLanguage;
    const langCode = browserLang.split("-")[0].toLowerCase();

    // Check if the detected language is in our supported locales
    if (locales.includes(langCode)) {
      return langCode;
    }

    return null;
  };

  const isDismissed = (): boolean => {
    const dismissedData = cacheGet(DISMISSED_KEY);
    if (!dismissedData) return false;

    return true;
  };

  const setDismissed = () => {
    const expiresAt = getTimestamp() + DISMISSED_EXPIRY_DAYS * 24 * 60 * 60;
    cacheSet(DISMISSED_KEY, "true", expiresAt);
  };

  const switchToLocale = useCallback(
    (locale: string) => {
      router.replace(pathname, { locale });
      cacheSet(PREFERRED_LOCALE_KEY, locale);
      setShowBanner(false);
    },
    [router, pathname]
  );

  useEffect(() => {
    // Only run initial check once to avoid interference with manual locale switches
    if (hasCheckedRef.current) {
      return;
    }

    hasCheckedRef.current = true;

    // Get browser locale
    const detectedLocale = detectBrowserLocale();
    setBrowserLocale(detectedLocale);

    // Check if user has dismissed the banner or already set a preference
    const dismissed = isDismissed();
    const preferredLocale = cacheGet(PREFERRED_LOCALE_KEY);

    // If user has previously clicked to switch locale, auto-switch to that preference
    if (preferredLocale && preferredLocale !== currentLocale) {
      switchToLocale(preferredLocale);
      return;
    }

    // Show banner if:
    // 1. Browser locale is different from current locale
    // 2. User hasn't dismissed the banner (or dismissal has expired)
    // 3. Browser locale is supported
    // 4. User hasn't set a preference yet (no auto-switch, only show banner)
    if (
      detectedLocale &&
      detectedLocale !== currentLocale &&
      !dismissed &&
      !preferredLocale
    ) {
      setShowBanner(true);
    }
  }, [currentLocale, switchToLocale]);

  // Adjust header position when banner is shown
  useEffect(() => {
    if (showBanner && bannerRef.current) {
      const bannerHeight = bannerRef.current.offsetHeight;
      const header = document.querySelector("header");
      if (header) {
        header.style.top = `${bannerHeight}px`;
      }
    }

    return () => {
      // Reset header position when component unmounts or banner is hidden
      const header = document.querySelector("header");
      if (header) {
        header.style.top = "0px";
      }
    };
  }, [showBanner]);

  const handleSwitch = () => {
    if (browserLocale) {
      switchToLocale(browserLocale);
    }
  };

  const handleDismiss = () => {
    setDismissed();
    setShowBanner(false);
    // Reset header position
    const header = document.querySelector("header");
    if (header) {
      header.style.top = "0px";
    }
  };

  if (!showBanner || !browserLocale) {
    return null;
  }

  const targetLocaleName =
    localeNames[browserLocale as keyof typeof localeNames] || browserLocale;

  return (
    <div
      ref={bannerRef}
      className="fixed top-0 left-0 right-0 z-[51] bg-gradient-to-r from-primary to-primary/80 text-primary-foreground shadow-lg"
    >
      <div className="container py-2.5">
        <div className="flex items-center justify-between gap-4">
          <div className="flex-1 flex items-center gap-3">
            <span className="text-sm">
              {browserLocale === "zh"
                ? `检测到浏览器语言是: ${targetLocaleName}，是否切换？`
                : `We detected your browser language is ${targetLocaleName}. Switch to it?`}
            </span>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <Button
              onClick={handleSwitch}
              variant="secondary"
              size="sm"
              className="bg-background text-xs"
            >
              {browserLocale === "zh" ? "切换到中文" : "Switch"}
            </Button>
            <button
              onClick={handleDismiss}
              className="p-1 bg-primary/10 rounded transition-colors flex-shrink-0"
              aria-label="Close"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
