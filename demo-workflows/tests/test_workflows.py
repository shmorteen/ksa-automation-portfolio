import sys
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT))
from workflow_demos import classify_lead, clean_contacts, reconcile_orders, sales_report

class WorkflowTests(unittest.TestCase):
    def test_lead(self):
        result = classify_lead(' Amina   Bello ', 'API integration', 1400, True)
        self.assertEqual(result['qualification'], {'score':80,'priority':'high'})
        self.assertEqual(result['crm_payload_preview']['status'], 'draft_only_not_sent')

    def test_contacts(self):
        result = clean_contacts(ROOT / 'samples' / 'contacts.csv')
        self.assertEqual(result['input_rows'], 5)
        self.assertEqual(len(result['valid_contacts']), 3)
        self.assertEqual([x['reason'] for x in result['rejected_rows']], ['duplicate_email','invalid_email'])

    def test_orders(self):
        result = reconcile_orders(ROOT / 'samples' / 'orders.csv')
        self.assertEqual([x['status'] for x in result['order_checks']].count('ready_for_fulfillment'), 2)
        self.assertEqual([x['status'] for x in result['order_checks']].count('manual_review'), 3)
        self.assertFalse(result['fulfillment_synced'])

    def test_reports(self):
        a = sales_report(ROOT / 'samples' / 'sales.csv','sample_week_a')
        b = sales_report(ROOT / 'samples' / 'sales.csv','sample_week_b')
        self.assertEqual(a['kpis']['revenue_usd'], 1060)
        self.assertEqual(a['kpis']['orders'], 6)
        self.assertEqual(b['kpis']['revenue_usd'], 500)
        self.assertEqual(b['kpis']['orders'], 4)

if __name__ == '__main__':
    unittest.main()
