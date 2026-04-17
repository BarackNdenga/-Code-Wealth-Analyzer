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
exports.showUpgradeWebview = showUpgradeWebview;
const vscode = __importStar(require("vscode"));
const stripe_1 = require("./stripe");
function showUpgradeWebview() {
    const panel = vscode.window.createWebviewPanel('codewealthUpgrade', 'Upgrade to Pro', vscode.ViewColumn.Beside, { enableScripts: true });
    panel.webview.html = `
<!DOCTYPE html>
<html>
<head><title>Upgrade Code-Wealth Pro</title>
<style>body { font-family: -apple-system; padding: 2rem; text-align: center; } button { background: #007acc; color: white; border: none; padding: 1rem 2rem; font-size: 1.1rem; border-radius: 8px; cursor: pointer; } .price { font-size: 2rem; font-weight: bold; color: #10b981; }</style>
</head>
<body>
<h1>🚀 Unlock Pro Features</h1>
<p>Multi-Cloud + SQL Optimizer + Wealth Score</p>
<div class="price">Pro: \$9.99/mo</div>
<button onclick="upgrade('pro')">Upgrade Pro</button>
<hr>
<div class="price" style="color: #f59e0b;">Pro+: \$19.99/mo</div>
<button onclick="upgrade('proplus')" style="background: #f59e0b;">Pro+ Unlimited</button>
<script>
  const vscode = acquireVsCodeApi();
  function upgrade(tier) {
    vscode.postMessage({ command: 'upgrade', tier });
  }
</script>
</body>
</html>`;
    panel.webview.onDidReceiveMessage((msg) => {
        if (msg.command === 'upgrade') {
            (0, stripe_1.redirectToStripeCheckout)(msg.tier);
            panel.dispose();
        }
    });
}
//# sourceMappingURL=paymentWebview.js.map