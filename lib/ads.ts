/**
 * Master switch for Google AdSense. Ads (the adsbygoogle script, the
 * account meta tag, ad units and their preconnect hints) only load when
 * NEXT_PUBLIC_ADS_ENABLED is exactly "true". Left off until the AdSense
 * account is actually serving ads — otherwise AdSense only injects its
 * empty `google_esf` event frame, which trips a (harmless but noisy) CSP
 * "Framing ''" warning without ever showing an ad.
 *
 * Re-enable by setting NEXT_PUBLIC_ADS_ENABLED=true in the environment.
 */
export const ADS_ENABLED = process.env.NEXT_PUBLIC_ADS_ENABLED === "true"
