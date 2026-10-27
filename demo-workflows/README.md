# KSA Automation — sample automation projects

**These are self-created, fictional demonstration projects. They are not paid client case studies and do not connect to live business systems.** They show the structure of automation solutions I can develop, with sample inputs, deterministic outputs, and tests.

The portfolio at `../index.html` contains an interactive *browser-only* simulator using JavaScript. This directory contains matching, reproducible Python reference implementations using only the Python standard library.

| Workflow | Input | Output | Business use case |
|---|---|---|---|
| Lead intake & routing | Sample enquiry fields | Qualification score and unsent CRM payload | Lead prioritization |
| Spreadsheet cleanup | CSV with messy contacts | Deduplicated contacts + rejected rows | CRM data quality |
| Order reconciliation | CSV order and stock snapshot | Fulfillment-ready/exception classifications | Ecommerce operations |
| Sales reporting | Sample transaction CSV | Revenue, count, AOV and channel breakdown | Recurring management reports |

## Try the Python examples

From this directory:

```bash
python workflow_demos.py lead
python workflow_demos.py clean
python workflow_demos.py orders
python workflow_demos.py reports
python workflow_demos.py reports --period sample_week_b
python -m unittest discover -s tests -v
```

You can supply your own **non-sensitive** local CSV input to the `clean`, `orders` or `reports` workflow with `--input path/to/file.csv`. Output is printed as formatted JSON; redirect it to a file as needed (`> output.json`). Column names are listed in `samples/*.csv`.

## Scope and caveats

- No emails, API requests, actual CRM sync, order updates or scheduled tasks are performed.
- Email validation is intentionally lightweight, suitable for a prototype and not a complete production validator.
- No user information is persisted by the browser demo. Python scripts only read local sample CSVs and print JSON.
- Real production delivery requires authentication, credentials management, input contracts, audit logs, error/retry policies, idempotency, data protection, monitoring and integration tests.
- Demo data is invented. Any numbers on the website are **example outcomes**, not customer performance claims.

## Turning a mock into a paid client project

Use these demos as conversation starters: agree on your customer's actual input/source, destination system, business rules, permissions, exceptions and acceptance tests before deployment.
