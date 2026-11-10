# Nyx Market Dashboard

**A responsive research and decision interface for portfolio review, market context, learning, and goals.**

Nyx is a single-file HTML/CSS/JavaScript application designed to make a market workflow legible: current holdings, research questions, trend context, learning resources, and decision notes live in one interface.

## Engineering signal

- responsive multi-tab interface built with semantic HTML, CSS, and JavaScript;
- Chart.js visualizations for allocation and trend views;
- feature flags and activity logging for client-side observability;
- bounded exponential-backoff behavior for transient requests; and
- explicit separation between the user interface and any credential-bearing backend.

## Runtime boundary

The current prototype was designed for the Claude.ai artifact environment. Live data operations depend on that environment's authenticated tool and connector layer. Opening `market-dashboard.html` directly will render the interface, but credentialed data refreshes require a server-side proxy or another trusted runtime.

The repository does **not** contain API keys, brokerage credentials, or a production financial-data backend. A standalone deployment should add:

1. a server-side API boundary with secret management;
2. authenticated user sessions and authorization;
3. input validation, rate limits, and request logging;
4. typed provider adapters and contract tests; and
5. clear data-retention and deletion controls.

## Run locally

```bash
python -m http.server 8000
```

Then open `http://localhost:8000/market-dashboard.html`.

## Verification

```bash
python tests/test_dashboard.py
```

The test checks the document structure, duplicate IDs, local references, secret-pattern denylist, placeholder text, and required disclaimer.

## Scope

Nyx is an interface and workflow prototype. It provides informational analysis only and does not predict returns, guarantee outcomes, execute trades, or replace licensed financial advice.

## Related work

- [Sentinel](https://github.com/Shawdaimarie/sentinel) — governed agent execution and deterministic evaluation.
- [Shawdai Marie portfolio](https://essentialdigitalsolution.com/)

## License

MIT. See [`LICENSE`](LICENSE).

## Local review — November 2026

The browser uses a same-origin /api/messages contract. No backend is bundled and live integrations are not verified. Deploy an authenticated, allowlisted backend with server-side credentials and response validation before enabling live data. A success response alone cannot confirm a connector: connector_verified must be true with tool-use evidence. Untrusted values render as text and headline links accept only HTTP(S).
