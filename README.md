

Readme · MD
# Nyx Market Dashboard
 
A black-and-white, spring-animated dashboard for tracking crypto, stocks, and connected 
financial accounts, with Claude-powered analysis and market research tools.
 
## ⚠️ Requires Claude.ai
 
This app's live data fetching (portfolio refresh, trend charts, headlines, connector 
sync) works **only when run as a Claude.ai artifact**. It calls `api.anthropic.com` 
directly from the browser with no API key in the code — Claude.ai's artifact 
environment proxies and authenticates those calls automatically.
 
If you open this file standalone or host it elsewhere (GitHub Pages, Vercel, etc.), 
the UI will render but **all "Refresh" and data-fetching buttons will fail**, since 
there's no backend to hold an API key and the browser will block the direct request.
 
To run this with live data outside Claude.ai, you'd need to build a small backend 
that holds your Anthropic API key and proxies these requests server-side.
 
## Features
- Multi-tab dashboard: Overview, Crypto, Stocks, Research, Accounts, Learn, Goals, Trends
- Connects to Robinhood, FactSet, Quartr, Grasshopper Bank, and Era via MCP
- Portfolio allocation chart, 6-month growth trend chart
- Curated financial education, podcasts, and news via live search
- Client-side retry/backoff and an activity log for observability
## Disclaimer
This tool provides informational analysis only, not financial advice. Markets are 
volatile; nothing here predicts or guarantees any outcome.
 
## License
See LICENSE file.
 
