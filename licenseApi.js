"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateLicenseOnline = validateLicenseOnline;
const API_URL = 'https://your-vercel-app.vercel.app/api/validate-license'; // Update after deploy
async function validateLicenseOnline(key) {
    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ licenseKey: key }),
        });
        if (response.ok) {
            return await response.json();
        }
    }
    catch (e) {
        // Fallback local if API down
    }
    return { isPro: false, isProPlus: false, tier: 'free', price: 'Free' };
}
//# sourceMappingURL=licenseApi.js.map