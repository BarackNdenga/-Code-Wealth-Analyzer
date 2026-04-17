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
exports.CostDecorator = void 0;
const vscode = __importStar(require("vscode"));
class CostDecorator {
    constructor() {
        this.decorationType = vscode.window.createTextEditorDecorationType({
            after: {
                contentText: ''
            }
        });
        this.WEALTH_TYPE = vscode.window.createTextEditorDecorationType({
            after: {
                contentText: ''
            }
        });
    }
    updateDecorations(editor, functions, costs) {
        const decorations = [];
        let totalWealth = 0;
        const nums = costs.map(c => parseFloat(c.cost.replace(/[$,]/g, '')));
        totalWealth = nums.reduce((a, b) => a + b, 0);
        for (let i = 0; i < functions.length; i++) {
            const func = functions[i];
            const cost = costs[i];
            const lineEnd = editor.document.lineAt(func.line).range.end;
            const range = new vscode.Range(lineEnd, lineEnd);
            let text = `// Est. Cost: ${cost.cost} ${cost.provider}`;
            if (cost.details)
                text += ` | ${cost.details}`;
            if (cost.hint)
                text += ` 💡${cost.hint.slice(0, 20)}...`;
            decorations.push({
                range,
                renderOptions: {
                    after: {
                        contentText: text,
                        color: totalWealth > 0.01 ? 'orange' : 'rgba(128,128,128,0.7)',
                        fontStyle: 'italic',
                        fontWeight: totalWealth > 0.01 ? 'bold' : 'normal'
                    }
                }
            });
        }
        // Wealth Score at file end if high
        if (totalWealth > 0.01) {
            const lastLine = editor.document.lineCount - 1;
            const wealthRange = new vscode.Range(lastLine, 0, lastLine, 0);
            editor.setDecorations(this.WEALTH_TYPE, [{
                    range: wealthRange,
                    renderOptions: {
                        after: {
                            contentText: `// 🔥 Wealth Score: $${totalWealth.toFixed(4)} total risk`,
                            color: 'red',
                            fontStyle: 'italic bold'
                        }
                    }
                }]);
        }
        editor.setDecorations(this.decorationType, decorations);
    }
    dispose() {
        this.decorationType.dispose();
        this.WEALTH_TYPE.dispose();
    }
}
exports.CostDecorator = CostDecorator;
//# sourceMappingURL=decorator.js.map