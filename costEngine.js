"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CostEngine = exports.GcpProvider = exports.AzureProvider = exports.AwsProvider = void 0;
class AwsProvider {
    calculate(_func) {
        const costPerExec = 0.0000021;
        const formattedCost = costPerExec.toLocaleString('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 7,
            maximumFractionDigits: 7
        });
        return {
            cost: formattedCost,
            provider: 'AWS Lambda',
            details: '100ms @ 128MB'
        };
    }
}
exports.AwsProvider = AwsProvider;
class AzureProvider {
    calculate(_func) {
        // Azure Functions Consumption: $0.20/M exec + $0.000016/GB-s
        const costPerExec = 0.0000020; // Similar assumption
        const formattedCost = costPerExec.toLocaleString('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 7,
            maximumFractionDigits: 7
        });
        return {
            cost: formattedCost,
            provider: 'Azure Functions',
            details: '100ms @ 128MB'
        };
    }
}
exports.AzureProvider = AzureProvider;
class GcpProvider {
    calculate(_func) {
        // GCP Cloud Functions: $0.40/M invocations + $0.0000025/GHz-s
        const costPerExec = 0.0000025;
        const formattedCost = costPerExec.toLocaleString('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 7,
            maximumFractionDigits: 7
        });
        return {
            cost: formattedCost,
            provider: 'GCP Cloud Functions',
            details: '100ms @ 1GHz'
        };
    }
}
exports.GcpProvider = GcpProvider;
class CostEngine {
    constructor() {
        this.providers = [new AwsProvider(), new AzureProvider(), new GcpProvider()];
    }
    calculate(func, isProPlus = false) {
        // Function costs (match provider from metadata)
        if (func.metadata.includes('AWS Lambda')) {
            return this.providers[0].calculate(func);
        }
        else if (func.metadata.includes('Azure Functions')) {
            return this.providers[1].calculate(func);
        }
        else if (func.metadata.includes('GCP Cloud Functions')) {
            return this.providers[2].calculate(func);
        }
        // Pro SQL overquery
        if (func.metadata.includes('SQL Query')) {
            let baseCost = 0.001; // RDS/Aurora base
            const complexity = func.metadata.includes('high') ? 10 : func.metadata.includes('medium') ? 3 : 1;
            let dbProvider = 'AWS RDS'; // Default
            // Multi-cloud DB hint from query (simple)
            const funcName = func.name?.toLowerCase();
            if (funcName?.includes('cosmos'))
                dbProvider = 'Azure CosmosDB', baseCost = 0.0005 * complexity;
            else if (funcName?.includes('bigquery'))
                dbProvider = 'GCP BigQuery', baseCost = 0.005 * complexity;
            const totalCost = baseCost * complexity;
            const formattedCost = totalCost.toLocaleString('en-US', {
                style: 'currency',
                currency: 'USD',
                minimumFractionDigits: 3
            });
            const result = {
                cost: formattedCost,
                provider: dbProvider,
                details: `Complexity: ${complexity}x (Pro)`
            };
            // Pro+ optimizer hints
            if (isProPlus && complexity > 1) {
                result.hint = complexity >= 10 ? 'Rewrite with CTE or index; use EXISTS vs IN (50% savings)' :
                    'Add LIMIT; composite index on JOIN cols';
            }
            return result;
        }
        // Default
        return this.providers[0].calculate(func);
    }
    getAllCosts(funcs, isProPlus = false) {
        return funcs.map(f => this.calculate(f, isProPlus));
    }
    // Unique: Aggregate Wealth Score ($ total est. for file)
    calculateWealthScore(costs) {
        const total = costs.reduce((sum, c) => {
            const num = parseFloat(c.cost.replace(/[$,]/g, ''));
            return sum + num;
        }, 0);
        return total > 0.01 ? `$${total.toFixed(4)} total risk (Pro)` : 'Low wealth risk';
    }
}
exports.CostEngine = CostEngine;
//# sourceMappingURL=costEngine.js.map