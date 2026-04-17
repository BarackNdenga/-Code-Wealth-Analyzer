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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StripeClient = void 0;
exports.redirectToStripeCheckout = redirectToStripeCheckout;
const vscode = __importStar(require("vscode"));
const stripe_1 = __importDefault(require("stripe"));
const STRIPE_PK = vscode.workspace.getConfiguration('codewealth').get('stripePublishableKey') || 'pk_test_placeholder_51...'; // User sets in settings
class StripeClient {
    constructor() {
        this.stripe = null; // Fix TS
        if (STRIPE_PK.startsWith('pk_')) {
            this.stripe = (0, stripe_1.default)(STRIPE_PK, { apiVersion: '2024-06-20' });
        }
    }
    async createCheckoutSession(tier) {
        if (!this.stripe) {
            vscode.window.showErrorMessage('Configure stripePublishableKey in settings');
            return null;
        }
        const priceId = tier === 'proplus' ? 'price_proplus_monthly_test' : 'price_pro_monthly_test'; // User creates in Stripe dashboard
        try {
            const session = await this.stripe.checkout.sessions.create({
                mode: 'subscription',
                payment_method_types: ['card'],
                line_items: [{ price: priceId, quantity: 1 }],
                success_url: `${vscode.env.uriScheme}://codewealth/success?session_id={CHECKOUT_SESSION_ID}`,
                cancel_url: vscode.env.uriScheme + '://codewealth/cancel',
                metadata: { tier },
            });
            return session.url || null;
        }
        catch (error) {
            vscode.window.showErrorMessage('Stripe error: ' + error.message);
            return null;
        }
    }
}
exports.StripeClient = StripeClient;
async function redirectToStripeCheckout(tier) {
    const client = new StripeClient();
    const url = await client.createCheckoutSession(tier);
    if (url) {
        vscode.env.openExternal(vscode.Uri.parse(url));
    }
}
//# sourceMappingURL=stripe.js.map