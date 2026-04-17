"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.Auth = void 0;
const vscode = __importStar(require("vscode"));
const licenseApi_1 = require("./licenseApi"); // Remove unused LicenseResponse
class Auth {
    static validateLicense(key) {
        if (key === 'codewealth-pro-key-🧠2024') {
            return { isPro: true, isProPlus: false, tier: 'pro', price: '$9.99/mo', key };
        }
        if (key === 'codewealth-pro-key-🧠2024-plus' || key.endsWith('-plus')) {
            return { isPro: true, isProPlus: true, tier: 'proplus', price: '$19.99/mo', key };
        }
        return { isPro: false, isProPlus: false, tier: 'free', price: 'Free', key };
    }
    static async getLicenseState(context) {
        const configKey = vscode.workspace.getConfiguration('codewealth').get('licenseKey');
        const storedKey = context.globalState.get('licenseKey', '');
        const key = configKey || storedKey;
        // Try online validation first
        try {
            const onlineState = await (0, licenseApi_1.validateLicenseOnline)(key);
            if (onlineState.isPro)
                return onlineState;
        }
        catch (e) {
            console.log('Online license check failed, using local');
        }
        // Fallback to local
        return this.validateLicense(key);
    }
}
exports.Auth = Auth;
//# sourceMappingURL=auth.js.map