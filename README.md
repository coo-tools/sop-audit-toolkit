# Process Proof — SOP Audit Toolkit

A browser-based diagnostic for reviewing the reliability of a standard operating procedure. It scores four control areas and converts gaps into a prioritized action plan.

## Audit areas

- Ownership and continuity
- Documentation quality
- Risk controls and exception handling
- Performance measurement

## Features

- Weighted audit score and process-maturity label
- Section-level scoring
- Prioritized improvement list based on gap severity
- Markdown action-plan export
- Local browser storage
- Unit-tested scoring logic

## Run locally

```bash
python3 -m http.server 8000
```

Visit `http://localhost:8000`.

## Tests

```bash
npm test
```

## Scope

This is a lightweight operational diagnostic. It is not a substitute for a legal, safety, information-security, or regulatory audit.

## License

MIT
