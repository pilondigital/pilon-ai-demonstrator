# Pilon AI Demonstrator

A software portfolio sample for website development and AI agent integration, demonstrating three backend business workflows. It is a demonstration, not evidence of past client engagements, revenue, company registration or tax status. All clients, prices and policies in `fixtures.json` are fictional examples.

## Portfolio presentation

- [English presentation: website development and AI integration](docs/Georgia_Websites_AI_Presentation.pdf)
- [Saved demonstration page](index.html): download the repository and open this file in a browser to view the recorded results.
- [Recorded API execution](evidence/live-run.json)

The presentation was prepared before company incorporation. This repository contains backend modules for future website integrations; a deployed customer-facing website is outside this demonstration.

## Implemented capabilities

1. **Proposal drafting**: selects services from an explicit catalogue and identifies missing requirements. Application code calculates money in integer cents.
2. **Document question answering**: answers from supplied text documents and returns exact source quotations. Code verifies that quotations occur in their cited document; human review remains necessary for meaning and completeness.
3. **Workflow planning**: generates a dependency-ordered task plan. An approval-gated local function materializes that plan into project JSON. The demo harness simulates approval for a fictional fixture. It does not contact clients, send email or deploy anything.

These are bounded AI-assisted modules using the Responses API, not continuously running autonomous agents. There is no production CRM, user authentication, database, PDF extraction or third-party connector in this small demonstrator.

## Run

Requires Node.js 22.13 or newer. No npm dependencies are required.

```sh
npm test
node run-demo.mjs --env-file /absolute/path/to/your/ignored.env
```

The env file contains `OPENAI_API_KEY`. Alternatively use an already configured process environment. Never commit keys. An optional `OPENAI_MODEL` environment variable overrides the tested `gpt-6-luna` model. API requests consume API credits. There are three bounded requests per complete demo run, no automatic retries, and a 60-second timeout per request.

The included `evidence/live-run.json` is a saved real run with synthetic inputs, UTC execution time, source hashes, response IDs and usage. Opening that file or the portfolio does not make an API request. New runs may produce different wording.

## Source map

| File | Purpose |
| --- | --- |
| `agents.mjs` | Prompts, JSON schemas, API client, business validation, approval gate |
| `fixtures.json` | Synthetic inputs and illustrative service catalogue |
| `run-demo.mjs` | Three-module live demonstration and evidence export |
| `test.mjs` | Offline tests for pricing, citations, dependencies and failures |
| `evidence/live-run.json` | Actual recorded output from the demonstration |

## Data flow

Input fixtures -> server-side OpenAI call -> structured JSON -> local validation -> reviewable output. Approved workflow fixture -> local project JSON. Secrets are read only at runtime and are not included in the evidence.

## Review limitations

Tests cover selected business rules; they do not establish production readiness or resistance to all prompt injection. Source quotation checking does not prove semantic entailment. Real deployment would require access control, persistence, data protection arrangements, a confirmed service catalogue, acceptance criteria and operational monitoring.

## Documentation

- [OpenAI Structured Outputs](https://developers.openai.com/api/docs/guides/structured-outputs)
- [OpenAI API keys](https://developers.openai.com/api/docs/guides/api-keys)

This repository is published for portfolio review. No open-source license is granted.
