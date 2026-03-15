/**
 * Feature flags — flip to `true` when the corresponding service is ready.
 *
 * NOTIFICATIONS: gated on WhatsApp Business API approval from Meta/Facebook.
 * Set to `true` once the application is approved and the EventBridge → Lambda
 * → WhatsApp pipeline is verified end-to-end.
 */
export const FEATURE_FLAGS = {
  NOTIFICATIONS: false,
} as const;
