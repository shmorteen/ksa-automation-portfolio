"""KSA Automation concept demos. No network calls or external service integrations.

Uses only Python's standard library. All input data is fictional.
"""
from __future__ import annotations

import argparse
import csv
import json
from collections import defaultdict
from pathlib import Path
from typing import Any


def classify_lead(name: str, service: str, budget_usd: int, urgent: bool) -> dict[str, Any]:
    """Convert a sample enquiry to a scored, *unsent* CRM payload preview."""
    if not name.strip():
        raise ValueError("Name cannot be blank")
    if budget_usd < 0:
        raise ValueError("Budget cannot be negative")
    score = min(100, (45 if budget_usd >= 2000 else 30 if budget_usd >= 800 else 15) + 25 + (25 if urgent else 0))
    priority = "high" if score >= 70 else "standard" if score >= 50 else "low"
    name = " ".join(name.split())
    return {
        "simulation": True,
        "lead": {"name": name, "service": service, "budget_usd_example": budget_usd, "urgent": urgent},
        "qualification": {"score": score, "priority": priority},
        "crm_payload_preview": {
            "contact_name": name, "pipeline": "new_enquiries",
            "owner_queue": "priority_review" if priority == "high" else "general_review",
            "service_interest": service, "status": "draft_only_not_sent",
        },
    }


def _read_csv(path: Path, required: tuple[str, ...]) -> list[dict[str, str]]:
    with path.open(encoding="utf-8-sig", newline="") as f:
        reader = csv.DictReader(f)
        fields = [x.strip().lower() for x in (reader.fieldnames or [])]
        if len(fields) != len(set(fields)):
            raise ValueError("CSV headers must be unique")
        missing = [x for x in required if x not in fields]
        if missing:
            raise ValueError(f"Missing columns: {', '.join(missing)}")
        out = []
        for original in reader:
            if None in original:
                raise ValueError("Malformed row: too many columns")
            normalized = {(k or "").strip().lower(): (v or "").strip() for k,v in original.items()}
            out.append(normalized)
        return out


def clean_contacts(path: Path) -> dict[str, Any]:
    """Remove duplicate emails and reject invalid addresses from a sample CSV."""
    rows = _read_csv(path, ("name", "email", "company"))
    valid, rejected, seen = [], [], set()
    for index, row in enumerate(rows, start=2):
        email = row["email"].lower()
        name = " ".join(row["name"].split())
        company = " ".join(row["company"].split())
        # Simple demo-level email validation, not a full RFC or domain check.
        if email.count("@") != 1 or not email.split("@")[-1].count(".") or " " in email:
            rejected.append({"line": index, "reason": "invalid_email"})
        elif email in seen:
            rejected.append({"line": index, "reason": "duplicate_email"})
        else:
            valid.append({"name": name, "email": email, "company": company})
            seen.add(email)
    return {"simulation": True, "input_rows": len(rows), "valid_contacts": valid, "rejected_rows": rejected}


def reconcile_orders(path: Path) -> dict[str, Any]:
    """Detect duplicate orders, invalid quantities and insufficient stock."""
    rows = _read_csv(path, ("order_id", "sku", "qty", "stock"))
    seen = set()
    checked = []
    for index, row in enumerate(rows, start=2):
        ident, sku = row["order_id"], row["sku"]
        try:
            qty = int(row["qty"])
            stock = int(row["stock"])
            valid_stock = qty > 0 and stock >= 0
        except ValueError:
            qty, stock, valid_stock = 0, 0, False
        reason = None
        if not ident or not sku:
            reason = "missing_identifier"
        elif ident in seen:
            reason = "duplicate_order"
        elif not valid_stock:
            reason = "invalid_quantity_or_stock"
        elif qty > stock:
            reason = "insufficient_stock"
        if ident:
            seen.add(ident)
        check = {"order_id": ident or f"row_{index}", "sku": sku,
                 "status": "manual_review" if reason else "ready_for_fulfillment"}
        if reason:
            check["reason"] = reason
        checked.append(check)
    return {"simulation": True, "checked": len(rows), "order_checks": checked, "fulfillment_synced": False}


def sales_report(path: Path, period: str) -> dict[str, Any]:
    """Compute KPIs for fictional paid orders from the requested sample period."""
    rows = _read_csv(path, ("order_id", "period", "channel", "revenue_usd"))
    selected = [row for row in rows if row["period"] == period]
    if not selected:
        raise ValueError(f"No sample transactions for period {period!r}")
    breakdown: dict[str, dict[str, Any]] = defaultdict(lambda: {"orders": 0, "revenue_usd": 0})
    total = 0
    for row in selected:
        revenue = int(row["revenue_usd"])
        if revenue < 0:
            raise ValueError("Revenue cannot be negative in this demo")
        total += revenue
        breakdown[row["channel"]]["orders"] += 1
        breakdown[row["channel"]]["revenue_usd"] += revenue
    return {
        "simulation": True, "period": period,
        "kpis": {"orders": len(selected), "revenue_usd": total, "average_order_value_usd": round(total / len(selected), 2)},
        "breakdown_by_channel": dict(breakdown),
        "report_delivery": "preview_only_not_scheduled",
    }


def main() -> None:
    root = Path(__file__).resolve().parent / "samples"
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("workflow", choices=["lead", "clean", "orders", "reports"])
    parser.add_argument("--input", type=Path, help="Optional CSV input for clean / orders / reports")
    parser.add_argument("--period", choices=["sample_week_a", "sample_week_b"], default="sample_week_a")
    args = parser.parse_args()
    if args.workflow == "lead":
        result = classify_lead("Amina Bello", "API integration", 1400, True)
    elif args.workflow == "clean":
        result = clean_contacts(args.input or root / "contacts.csv")
    elif args.workflow == "orders":
        result = reconcile_orders(args.input or root / "orders.csv")
    else:
        result = sales_report(args.input or root / "sales.csv", args.period)
    print(json.dumps(result, indent=2))


if __name__ == "__main__":
    main()
