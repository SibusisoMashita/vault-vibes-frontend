# Cognito Hosted UI branding assets

This folder contains upload-ready branding files for the AWS Cognito Hosted UI.

## Files

- `cognito-ui.css` — custom Hosted UI stylesheet using only Cognito-supported selectors
- `cognito-logo.png` — logo image copied from the app's existing branding assets

## Upload path in AWS Console

1. Open **AWS Console**.
2. Go to **Cognito**.
3. Select **User Pools**.
4. Open the target user pool for Vault Vibes.
5. Open **App integration**.
6. Open **Hosted UI customization**.
7. Upload `cognito-logo.png` in the logo section.
8. Upload or paste the contents of `cognito-ui.css` in the CSS customization section.
9. Save the customization.

## Notes

- AWS Cognito Hosted UI accepts only a limited set of CSS selectors. This stylesheet intentionally styles only the supported selectors:
  - `.logo-customizable`
  - `.banner-customizable`
  - `.label-customizable`
  - `.inputField-customizable`
  - `.submitButton-customizable`
  - `.submitButton-customizable:hover`
  - `.errorMessage-customizable`
  - `.idpButton-customizable`
  - `.idpButton-customizable:hover`
- The styling matches the app's existing design direction:
  - Accent color: `#0066ff`
  - Neutral background family based on `#fafafa`
  - Rounded controls and buttons
  - Inter/system UI font stack
  - Minimal dashboard-style presentation
- `cognito-ui.css` is intentionally lightweight and well below Cognito's 100 KB upload limit.
- These files are not imported by the application runtime. They are only stored here as static upload assets for Cognito.

## Suggested upload behavior check

After uploading, open the Hosted UI sign-in page and confirm:

- logo renders crisply
- primary button uses the Vault Vibes blue
- inputs and social/IdP buttons have rounded corners
- error messages remain readable with good contrast
- hover states are visible on mouse interaction

