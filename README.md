# 🚀 Code-Wealth Analyzer - Free & Pro Plans

[![VS Code](https://img.shields.io/badge/VS_Code-Enabled-blue?logo=visual-studio-code)](https://code.visualstudio.com/)
[![Free](https://img.shields.io/badge/Plan-Free-green)](https://code.visualstudio.com/)
[![Pro](https://img.shields.io/badge/Pro-%249.99-mo-orange?logo=stripe)](https://stripe.com)
[![Pro+](https://img.shields.io/badge/Pro+-%2419.99-mo-gold?logo=stripe)](https://stripe.com)
[![AWS](https://img.shields.io/badge/AWS-Lambda-orange?logo=amazon-aws)](https://aws.amazon.com/lambda)
[![Azure](https://img.shields.io/badge/Azure-Functions-blue?logo=microsoft-azure)](https://azure.microsoft.com)
[![GCP](https://img.shields.io/badge/GCP-yellow?logo=google-cloud)](https://cloud.google.com/functions)

## 🎯 Innovation de Pointe

Code-Wealth Analyzer est la première extension VS Code à offrir une analyse de coûts cloud en temps réel directement dans l'éditeur. Grâce à une IA heuristique avancée, elle détecte les fonctions AWS Lambda et requêtes SQL pendant que vous tapez, affichant l'estimation précise ($/exec ou $/query) en ghost text subtil.

**High-Tech Stack**:
- Parser temps réel (onDidChangeTextDocument).
- Decorations API pour UX fluide.
- Licensing Pro (Free vs Pro/Pro+).
- Modulaire : CloudProvider (AWS → Azure/GCP).
- **Monétisation Stripe** intégrée (Upgrade Pro cmd).

## 💡 Pourquoi ce Projet ?

Les factures cloud explosent (80% gaspillage dev code). Code-Wealth éduque les devs à l'écriture coût-optimisée dès le premier commit.

Évite Lambda overprovision (100ms@128MB base).

**Pro** : SQL overquery → économies DB massives.

**Innovation** : **Code → Coût = Zéro latence**.

## 📊 Plans & Pricing

| Plan   | Prix         | Features                                      |
|--------|--------------|-----------------------------------------------|
| Free   | Gratuit      | AWS Lambda                                    |
| **Pro**| **$9.99/mois** | Multi-cloud + SQL overquery               |
| **Pro+** | **$19.99/mois** | + Hints + Wealth Score                    |

**Keys**: `\"\"` (Free) | `codewealth-pro-key-🧠2024` (Pro) | `-plus` (Pro+). **Stripe** auto-génère après payment.

## 📦 Installation Pro

```bash
cd code-wealth-analyzer
npm install
npm run watch  # Auto-compile
F5 → Extension Host
```

## 🎮 Utilisation

**Base/Free Mode**:

```js
export const handler = async () => {};
```
→ `// Est. Cost: $0.0000021 /exec`

**Pro Mode (SQL/Multi-Cloud)**:

Settings (Ctrl+,) → `codewealth.licenseKey = "codewealth-pro-key-🧠2024"` ou **Cmd "Upgrade to Pro"**

Reload window

```sql
SELECT * FROM users;
```
→ `// Est. Cost: $0.001 /query`

**Pro+** Cmd : Optimize Current Query (hints/wealth).

Cmd : Refresh Cost Analysis.

## 🔮 Roadmap Haute Techno

- Multi-cloud full (done!).
- ML query optimizer (Pro+).
- API billing live sync.

## 📈 Coûts Détaillés

- Lambda : $0.20/M req + GB-s.
- SQL : $0.001/query × complexity (Pro, RDS/Aurora/Cosmos/BigQuery).

**Développé par Barack Ndenga 🧠** - *High-Tech Dev Tools*

⭐ Star & fork ! 🚀

