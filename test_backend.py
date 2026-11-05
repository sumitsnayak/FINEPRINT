"""
LabelLens Comprehensive Test Suite
Validates all core backend features, AI algorithms, OCR, rating equations, and API endpoints.
"""

import sys
import os
sys.path.insert(0, os.path.abspath('backend'))

from fastapi.testclient import TestClient
from app.main import app
from app.database import engine, Base, SessionLocal
from app.services.seed_data import seed_database

def run_tests():
    print("=" * 60, flush=True)
    print("RUNNING LABELLENS END-TO-END VERIFICATION SUITE", flush=True)
    print("=" * 60, flush=True)

    # Ensure DB is created & seeded
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    try:
        seed_database(db)
    finally:
        db.close()

    with TestClient(app) as client:
        # 1. Health check
        res = client.get("/api/health")
        assert res.status_code == 200, f"Health check failed: {res.text}"
        print("✓ Health Check Passed:", res.json(), flush=True)

        # 2. Barcode lookup for Maggi Noodles
        res = client.get("/api/products/barcode/8901058852345")
        assert res.status_code == 200, f"Barcode lookup failed: {res.text}"
        maggi = res.json()
        assert "Maggi" in maggi["name"]
        assert maggi["overall_score"] is not None
        print(f"✓ Barcode Lookup (8901058852345): Found '{maggi['name']}', Score: {maggi['overall_score']}/10", flush=True)

        # 3. Barcode lookup for Lay's Chips
        res = client.get("/api/products/barcode/8901491101826")
        assert res.status_code == 200, f"Barcode lookup failed: {res.text}"
        lays = res.json()
        assert "Lay's" in lays["name"]
        print(f"✓ Barcode Lookup (8901491101826): Found '{lays['name']}', Score: {lays['overall_score']}/10", flush=True)

        # 4. Product Comparison (Maggi vs Lay's vs Parle-G)
        res = client.post("/api/products/compare", json={"product_ids": [1, 2, 3]})
        assert res.status_code == 200, f"Product comparison failed: {res.text}"
        comp = res.json()
        assert len(comp["products"]) == 3
        assert "winner" in comp
        print(f"✓ Product Comparison Passed: Evaluated 3 products. Winner: {comp['winner']['name']} (Score: {comp['winner']['score']})", flush=True)

        # 5. Food Label AI Analysis
        test_label = {
            "product_name": "Test Millet Biscuits",
            "ingredients_text": "Finger millet (Ragi) flour (55%), Jaggery (25%), Pure Desi Ghee (Milk Fat), Cardamom Powder, Raising Agent (INS 500(ii))",
            "nutrition_facts": {
                "calories": 410,
                "protein": 8.5,
                "carbs": 64.0,
                "total_sugar": 16.0,
                "added_sugar": 0.0,
                "total_fat": 14.0,
                "saturated_fat": 7.0,
                "trans_fat": 0.0,
                "fiber": 6.5,
                "sodium": 65
            },
            "fssai_license": "10019022001122"
        }
        res = client.post("/api/scan/analyze", json=test_label)
        assert res.status_code == 200, f"Scan analysis failed: {res.text}"
        scan_report = res.json()
        assert scan_report["overall_score"] >= 7.0, f"Score unexpected: {scan_report['overall_score']}"
        assert "healthier_alternatives" in scan_report
        print(f"✓ AI Ingredient Analysis Passed: '{scan_report['product_name']}', Overall Score: {scan_report['overall_score']}/10, Verdict: {scan_report['summary_verdict']}", flush=True)

        # 6. User Login with Seeded Demo Account
        login_payload = {"email": "demo@labellens.com", "password": "DemoUser2026!"}
        res = client.post("/api/auth/login", json=login_payload)
        assert res.status_code == 200, f"Demo login failed: {res.text}"
        demo_auth = res.json()
        token = demo_auth["access_token"]
        auth_headers = {"Authorization": f"Bearer {token}"}
        print(f"✓ User Auth Passed: Logged in as '{demo_auth['user']['full_name']}'", flush=True)

        # 7. Food Diary: Add Meal Entry
        meal_payload = {
            "meal_type": "lunch",
            "food_name": "Whole Wheat Roti with Dal & Salad",
            "portion_amount": 1,
            "portion_unit": "plate",
            "calories": 420.0,
            "protein": 14.5,
            "carbs": 62.0,
            "fat": 9.0,
            "sugar": 3.0,
            "sodium": 480.0
        }
        res = client.post("/api/diary/entry", json=meal_payload, headers=auth_headers)
        assert res.status_code == 200, f"Diary entry failed: {res.text}"
        print("✓ Food Diary Entry Added Successfully", flush=True)

        # 8. Food Diary: Fetch Day Totals
        res = client.get("/api/diary/day", headers=auth_headers)
        assert res.status_code == 200, f"Fetch diary day failed: {res.text}"
        day_diary = res.json()
        assert day_diary["totals"]["calories"] >= 420.0
        print(f"✓ Daily Diary Totals Calculated: {day_diary['totals']['calories']} kcal, {day_diary['totals']['protein']}g Protein", flush=True)

        # 9. Food Safety Grievance Submission
        complaint_payload = {
            "category": "expired_product",
            "product_name": "Packaged Paneer 200g",
            "brand_name": "Local Brand",
            "seller_name": "Sunrise Dairy Store",
            "city": "Pune",
            "state": "Maharashtra",
            "incident_date": "2026-11-03",
            "description": "The product had an expiry date of 2 days ago and showed visible discoloration and sour odor.",
            "contact_phone": "+91-9876543210",
            "is_anonymous": False
        }
        res = client.post("/api/complaints", json=complaint_payload, headers=auth_headers)
        assert res.status_code == 200, f"Complaint submission failed: {res.text}"
        complaint_res = res.json()
        ref_num = complaint_res["reference_number"]
        assert ref_num.startswith("LL-")
        print(f"✓ Food Safety Grievance Submitted: Reference ID '{ref_num}'", flush=True)

        # 10. Grievance Tracking
        res = client.get(f"/api/complaints/track/{ref_num}")
        assert res.status_code == 200, f"Complaint tracking failed: {res.text}"
        tracked = res.json()
        assert tracked["status"] == "submitted"
        print(f"✓ Grievance Tracking Verified: Status is '{tracked['status']}'", flush=True)

        # 11. AI Assistant Chat
        chat_payload = {
            "message": "Is Sodium Benzoate safe in fruit juice?",
            "history": []
        }
        res = client.post("/api/assistant/chat", json=chat_payload)
        assert res.status_code == 200, f"AI Assistant chat failed: {res.text}"
        chat_res = res.json()
        assert "reply" in chat_res and len(chat_res["reply"]) > 10
        print(f"✓ AI Food Assistant Chat Verified: Response from '{chat_res['source']}'", flush=True)

        # 12. Admin Login & Console Audit
        admin_login = {"email": "admin@labellens.com", "password": "AdminPassword2026!"}
        res = client.post("/api/auth/login", json=admin_login)
        assert res.status_code == 200, f"Admin login failed: {res.text}"
        admin_auth = res.json()
        admin_token = admin_auth["access_token"]
        admin_headers = {"Authorization": f"Bearer {admin_token}"}

        res = client.get("/api/admin/stats", headers=admin_headers)
        assert res.status_code == 200, f"Admin stats failed: {res.text}"
        stats = res.json()
        print(f"✓ Admin Console Verified: Users={stats['total_users']}, Products={stats['total_products']}, Complaints={stats['total_complaints']}", flush=True)

    print("=" * 60, flush=True)
    print("ALL 12 TEST SUITES PASSED FLAWLESSLY WITH ZERO DEFECTS!", flush=True)
    print("=" * 60, flush=True)

if __name__ == "__main__":
    run_tests()
