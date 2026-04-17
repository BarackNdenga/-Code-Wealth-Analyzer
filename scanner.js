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
exports.CodeScanner = void 0;
const vscode = __importStar(require("vscode"));
class CodeScanner {
    scan(documentText, isPro = false) {
        const lines = documentText.split('\n');
        const matches = [];
        for (let i = 0; i < lines.length; i++) {
            const line = lines[i];
            const trimmed = line.trim().toLowerCase();
            // Multi-cloud function detection
            const isAwsLambda = trimmed.includes('export const') || trimmed.includes('const handler') || trimmed.includes('async function');
            const isAzureFunction = trimmed.includes('module.exports') || trimmed.includes('context.res');
            const isGcpFunction = trimmed.includes('exports.run') || trimmed.includes('event, context');
            const isFunction = isAwsLambda || isAzureFunction || isGcpFunction;
            // Pro SQL detection + complexity
            let isSql = false;
            let sqlComplexity = 'low';
            let metadata = '';
            if (isPro) {
                const upperLine = line.toUpperCase();
                isSql = upperLine.includes('SELECT ') || upperLine.includes('INSERT INTO') || upperLine.includes('UPDATE ') || upperLine.includes('DELETE ');
                if (isSql) {
                    let joinCount = (line.match(/join|JOIN/gi) || []).length;
                    let tableCount = (line.match(/from|FROM|into|INTO/gi) || []).length + (line.match(/join|JOIN/gi) || []).length;
                    let whereCount = (upperLine.match(/WHERE /gi) || []).length;
                    if (joinCount >= 2 || tableCount >= 3 || whereCount >= 2) {
                        sqlComplexity = 'high';
                    }
                    else if (joinCount === 1 || whereCount === 1) {
                        sqlComplexity = 'medium';
                    }
                    metadata = `SQL Query (Pro, complexity: ${sqlComplexity})`;
                }
            }
            if (isFunction || isSql) {
                let name = 'handler';
                if (isFunction) {
                    const nameMatch = line.match(/const\\s+([\\w-]+)/) || line.match(/function\\s+([\\w-]+)/) || line.match(/exports\\.([\\w-]+)/);
                    if (nameMatch && nameMatch[1]) {
                        name = nameMatch[1];
                    }
                    metadata = isAwsLambda ? 'AWS Lambda' : isAzureFunction ? 'Azure Functions' : 'GCP Cloud Functions';
                }
                // metadata set in SQL block above
                matches.push({
                    line: i,
                    name,
                    metadata: metadata || 'unknown',
                    range: new vscode.Range(i, 0, i, line.length)
                });
            }
        }
        return matches;
    }
}
exports.CodeScanner = CodeScanner;
//# sourceMappingURL=scanner.js.map