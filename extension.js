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
exports.activate = activate;
exports.deactivate = deactivate;
const vscode = __importStar(require("vscode"));
const scanner_1 = require("./scanner");
const costEngine_1 = require("./costEngine");
const decorator_1 = require("./decorator");
const auth_1 = require("./auth");
const paymentWebview_1 = require("./paymentWebview");
async function loadLicenseAndUpdate(scanner, costEngine, decorator, context) {
    const licenseState = await auth_1.Auth.getLicenseState(context);
    triggerUpdateActiveEditor(scanner, costEngine, decorator, licenseState);
}
async function activate(context) {
    const scanner = new scanner_1.CodeScanner();
    const costEngine = new costEngine_1.CostEngine();
    const decorator = new decorator_1.CostDecorator();
    let licenseState = { isPro: false, isProPlus: false, tier: 'free', price: 'Free' };
    try {
        licenseState = await auth_1.Auth.getLicenseState(context);
    }
    catch (e) {
        console.log('License load error:', e);
    }
    // Register refresh command
    const refreshDisposable = vscode.commands.registerCommand('codewealth.refreshCostAnalysis', () => {
        triggerUpdateActiveEditor(scanner, costEngine, decorator, licenseState);
    });
    context.subscriptions.push(refreshDisposable);
    // Pro optimize command
    const optimizeDisposable = vscode.commands.registerCommand('codewealth.optimizeQuery', () => {
        optimizeActiveQuery(scanner, costEngine, licenseState);
    });
    context.subscriptions.push(optimizeDisposable);
    // Upgrade command
    const upgradeDisposable = vscode.commands.registerCommand('codewealth.upgradePro', () => {
        (0, paymentWebview_1.showUpgradeWebview)();
    });
    context.subscriptions.push(upgradeDisposable);
    // Listen for text changes
    const textChangeDisposable = vscode.workspace.onDidChangeTextDocument((e) => {
        if (vscode.window.activeTextEditor && e.document === vscode.window.activeTextEditor.document) {
            triggerUpdateActiveEditor(scanner, costEngine, decorator, licenseState);
        }
    });
    context.subscriptions.push(textChangeDisposable);
    // Config changes
    context.subscriptions.push(vscode.workspace.onDidChangeConfiguration((e) => {
        if (e.affectsConfiguration('codewealth')) {
            loadLicenseAndUpdate(scanner, costEngine, decorator, context);
        }
    }));
    context.subscriptions.push({
        dispose: () => decorator.dispose()
    });
    // Initial scan
    if (vscode.window.activeTextEditor) {
        triggerUpdateActiveEditor(scanner, costEngine, decorator, licenseState);
    }
    console.log('Code-Wealth Analyzer with Monetization is now active!');
}
function triggerUpdateActiveEditor(scanner, costEngine, decorator, licenseState) {
    const editor = vscode.window.activeTextEditor;
    if (editor) {
        const functions = scanner.scan(editor.document.getText(), licenseState.isPro);
        const costs = costEngine.getAllCosts(functions, licenseState.isProPlus);
        decorator.updateDecorations(editor, functions, costs);
    }
}
function optimizeActiveQuery(scanner, costEngine, licenseState) {
    if (!licenseState.isPro) {
        vscode.window.showWarningMessage('Pro license required for optimization. Run "Upgrade to Pro".');
        return;
    }
    const editor = vscode.window.activeTextEditor;
    if (editor) {
        const functions = scanner.scan(editor.document.getText(), true);
        const costs = costEngine.getAllCosts(functions, licenseState.isProPlus);
        const wealthScore = costEngine.calculateWealthScore(costs);
        let message = `Wealth Score: ${wealthScore}\\n`;
        costs.forEach((cost, i) => {
            if (cost.hint) {
                message += `${functions[i].name || 'Query'}: ${cost.hint}\\n`;
            }
        });
        vscode.window.showInformationMessage(message);
        const decorator = new decorator_1.CostDecorator();
        decorator.updateDecorations(editor, functions, costs);
        decorator.dispose();
    }
}
function deactivate() { }
//# sourceMappingURL=extension.js.map