"""
LabelLens Async Test Suite
Pure asyncio verification using httpx.ASGITransport
"""

import sys
import os
import asyncio
sys.path.insert(0, os.path.abspath('backend'))

import httpx
from app.main import app

async def main():
    print("=" * 60, flush=True)
    print("STARTING LABELLENS ASYNC VERIFICATION SUITE", flush=True)
    print("=" * 60, flush=True)

    transport = httpx.ASGITransport(app=app)
    async with httpx.AsyncClient(transport=transport, base_url="http://test") as client:
        # 1. Health check
        res = await client.get("/api/health")
        assert res.status_code == 200, f"Health check failed: {res.text}"
        print("✓ Health Check Passed:", res.json(), flush=True)

        # 2. Barcode lookup
        res = await client.get("/api/products/barcode/8901058852345")
        assert res.status_code == 200, f"Barcode lookup failed: {res.text}"
        maggi = res.json()
        assert "Maggi" in maggi["name"]
        print(f"✓ Barcode Lookup (8901058852345): Found '{maggi['name']}', Score: {maggi['overall_score']}/10", flush=True)

        # 3. Product Comparison
        res = await client.post("/api/products/compare", json={"product_ids": [1, 2, 3]})
        assert res.status_code == 200, f"Product comparison failed: {res.text}"
        comp = res.json()
        assert len(comp["products"]) == 3
        print(f"✓ Product Comparison Passed: Evaluated 3 products. Winner: '{comp['winner']['name']}'", flush=True)

        # 4. Food Label AI Analysis
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
        res = await client.post("/api/scan/analyze", json=test_label)
        assert res.status_code == 200, f"Scan analysis failed: {res.text}"
        scan_report = res.json()
        assert scan_report["overall_score"] >= 7.0
        print(f"✓ AI Ingredient Analysis: '{scan_report['product_name']}', Overall Score: {scan_report['overall_score']}/10, Verdict: {scan_report['summary_verdict']}", flush=True)

        # 5. User Login
        login_payload = {"email": "demo@labellens.com", "password": "DemoUser2026!"}
        res = await client.post("/api/auth/login", json=login_payload)
        assert res.status_code == 200, f"Demo login failed: {res.text}"
        demo_auth = res.json()
        token = demo_auth["access_token"]
        auth_headers = {"Authorization": f"Bearer {token}"}
        print(f"✓ User Auth Passed: Logged in as '{demo_auth['user']['full_name']}'", flush=True)

        # 6. Food Diary Entry
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
        res = await client.post("/api/diary/entry", json=meal_payload, headers=auth_headers)
        assert res.status_code == 200, f"Diary entry failed: {res.text}"
        print("✓ Food Diary Entry Added Successfully", flush=True)

        # 7. Food Safety Grievance Submission
        complaint_payload = {
            "category": "expired_product",
            "product_name": "Packaged Paneer 200g",
            "brand_name": "Local Dairy",
            "seller_name": "Sunrise Dairy Store",
            "city": "Pune",
            "state": "Maharashtra",
            "incident_date": "2026-11-03",
            "description": "The product had an expired date covered by a fresh sticker.",
            "contact_phone": "+91-9876543210",
            "is_anonymous": False
        }
        res = await client.post("/api/complaints", json=complaint_payload, headers=auth_headers)
        assert res.status_code == 200, f"Complaint submission failed: {res.text}"
        complaint_res = res.json()
        ref_num = complaint_res["reference_number"]
        print(f"✓ Food Safety Grievance Submitted: Reference ID '{ref_num}'", flush=True)

        # 8. Grievance Tracking
        res = await client.get(f"/api/complaints/track/{ref_num}")
        assert res.status_code == 200, f"Complaint tracking failed: {res.text}"
        tracked = res.json()
        assert tracked["status"] == "submitted"
        print(f"✓ Grievance Tracking Verified: Status is '{tracked['status']}'", flush=True)

        # 9. AI Assistant Chat
        chat_payload = {
            "message": "Is Sodium Benzoate safe in fruit juice?",
            "history": []
        }
        res = await client.post("/api/assistant/chat", json=chat_payload)
        assert res.status_code == 200, f"AI Assistant chat failed: {res.text}"
        chat_res = res.json()
        print(f"✓ AI Food Assistant Verified: Response received from '{chat_res['source']}'", flush=True)

        # 10. Admin Login
        admin_login = {"email": "admin@labellens.com", "password": "AdminPassword2026!"}
        res = await client.post("/api/auth/login", json=admin_login)
        assert res.status_code == 200, f"Admin login failed: {res.text}"
        admin_auth = res.json()
        admin_token = admin_auth["access_token"]
        admin_headers = {"Authorization": f"Bearer {admin_token}"}

        res = await client.get("/api/admin/stats", headers=admin_headers)
        assert res.status_code == 200, f"Admin stats failed: {res.text}"
        stats = res.json()
        print(f"✓ Admin Console Verified: Users={stats['total_users']}, Products={stats['total_products']}, Complaints={stats['total_complaints']}", flush=True)

    print("=" * 60, flush=True)
    print("ALL TESTS PASSED SUCCESSFULLY! ZERO ERRORS.", flush=True)
    print("=" * 60, flush=True)

if __name__ == "__main__":
    asyncio.run(main())

