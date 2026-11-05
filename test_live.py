"""
LabelLens Live HTTP Integration Test
Tests all endpoints against the running uvicorn server.
"""

import requests

BASE_URL = "http://127.0.0.1:8000"

def test_all():
    print("=" * 60)
    print("RUNNING LIVE HTTP VERIFICATION AGAINST LABELLENS BACKEND")
    print("=" * 60)

    # 1. Health check
    res = requests.get(f"{BASE_URL}/api/health")
    assert res.status_code == 200, f"Health check failed: {res.text}"
    print("[PASS] 1. Health Check OK:", res.json()["status"])

    # 2. Barcode lookup
    res = requests.get(f"{BASE_URL}/api/products/barcode/8901058852345")
    assert res.status_code == 200, f"Barcode failed: {res.text}"
    p = res.json()
    assert "Maggi" in p["name"]
    print(f"[PASS] 2. Barcode Lookup OK: {p['name']} (Score: {p['overall_score']}/10)")

    # 3. Product catalog
    res = requests.get(f"{BASE_URL}/api/products?limit=5")
    assert res.status_code == 200, f"Catalog failed: {res.text}"
    catalog = res.json()
    assert len(catalog) >= 5
    print(f"[PASS] 3. Product Catalog OK: Retrieved {len(catalog)} verified products")

    # 4. Product Comparison
    res = requests.post(f"{BASE_URL}/api/products/compare", json={"product_ids": [1, 2, 3]})
    assert res.status_code == 200, f"Comparison failed: {res.text}"
    comp = res.json()
    assert "winner" in comp
    print(f"[PASS] 4. Comparison OK: Winner '{comp['winner']['name']}' (Score: {comp['winner']['score']})")

    # 5. Food Label AI Analysis
    test_label = {
        "product_name": "Multigrain Ragi Crisps",
        "ingredients_text": "Ragi flour (60%), Whole wheat flour, Rice bran oil, Iodised salt, Spices (Chilli, Turmeric, Cumin), Acidity regulator (INS 330)",
        "nutrition_facts": {
            "calories": 395,
            "protein": 8.0,
            "carbs": 65.0,
            "total_sugar": 2.0,
            "added_sugar": 0.0,
            "total_fat": 11.0,
            "saturated_fat": 3.0,
            "trans_fat": 0.0,
            "sodium": 350
        },
        "fssai_license": "10014022000555"
    }
    res = requests.post(f"{BASE_URL}/api/scan/analyze", json=test_label)
    assert res.status_code == 200, f"Analysis failed: {res.text}"
    analysis = res.json()
    assert analysis["overall_score"] >= 7.0
    print(f"[PASS] 5. AI Label Analysis OK: '{analysis['product_name']}', Overall Score: {analysis['overall_score']}/10")

    # 6. User Login
    res = requests.post(f"{BASE_URL}/api/auth/login", json={"email": "demo@labellens.com", "password": "DemoUser2026!"})
    assert res.status_code == 200, f"Login failed: {res.text}"
    auth_data = res.json()
    token = auth_data["access_token"]
    headers = {"Authorization": f"Bearer {token}"}
    print(f"[PASS] 6. User Auth OK: Authenticated as '{auth_data['user']['full_name']}'")

    # 7. Food Diary Entry
    meal = {
        "meal_type": "lunch",
        "food_name": "Foxtail Millet Noodles with Vegetables",
        "portion_amount": 1,
        "portion_unit": "bowl",
        "calories": 360.0,
        "protein": 11.2,
        "carbs": 68.0,
        "fat": 3.5,
        "sugar": 2.0,
        "sodium": 320.0
    }
    res = requests.post(f"{BASE_URL}/api/diary/entry", json=meal, headers=headers)
    assert res.status_code == 200, f"Diary failed: {res.text}"
    print("[PASS] 7. Food Diary OK: Meal logged successfully")

    # 8. Food Diary Day Check
    res = requests.get(f"{BASE_URL}/api/diary/day", headers=headers)
    assert res.status_code == 200, f"Day diary failed: {res.text}"
    day_res = res.json()
    assert day_res["totals"]["calories"] >= 360.0
    print(f"[PASS] 8. Day Diary OK: Total calories = {day_res['totals']['calories']} kcal")

    # 9. Food Safety Complaint
    complaint = {
        "category": "expired_product",
        "product_name": "Flavored Yogurt 100g",
        "brand_name": "Test Brand",
        "seller_name": "Corner Mart",
        "city": "Bengaluru",
        "state": "Karnataka",
        "incident_date": "2026-11-04",
        "description": "Product was sold 3 days past the expiry date stamped on the foil lid.",
        "contact_phone": "+91-9876543210"
    }
    res = requests.post(f"{BASE_URL}/api/complaints", json=complaint, headers=headers)
    assert res.status_code == 200, f"Complaint failed: {res.text}"
    comp_res = res.json()
    ref_num = comp_res["reference_number"]
    print(f"[PASS] 9. Grievance Reporting OK: Registered reference '{ref_num}'")

    # 10. Grievance Tracking
    res = requests.get(f"{BASE_URL}/api/complaints/track/{ref_num}")
    assert res.status_code == 200, f"Track failed: {res.text}"
    tracked = res.json()
    assert tracked["status"] == "submitted"
    print(f"[PASS] 10. Grievance Tracking OK: Status is '{tracked['status']}'")

    # 11. AI Assistant Chat
    res = requests.post(f"{BASE_URL}/api/assistant/chat", json={"message": "What is the daily limit for added sugars?"})
    assert res.status_code == 200, f"Chat failed: {res.text}"
    chat = res.json()
    assert len(chat["reply"]) > 20
    print(f"[PASS] 11. AI Food Assistant OK: Answered from '{chat['source']}'")

    # 12. Admin Console
    admin_res = requests.post(f"{BASE_URL}/api/auth/login", json={"email": "admin@labellens.com", "password": "AdminPassword2026!"})
    assert admin_res.status_code == 200, f"Admin login failed: {admin_res.text}"
    admin_headers = {"Authorization": f"Bearer {admin_res.json()['access_token']}"}

    stats_res = requests.get(f"{BASE_URL}/api/admin/stats", headers=admin_headers)
    assert stats_res.status_code == 200, f"Admin stats failed: {stats_res.text}"
    stats = stats_res.json()
    print(f"[PASS] 12. Admin Console OK: Users={stats['total_users']}, Products={stats['total_products']}, Complaints={stats['total_complaints']}")

    print("=" * 60)
    print("ALL 12 LIVE INTEGRATION TESTS PASSED PERFECTLY!")
    print("=" * 60)

if __name__ == "__main__":
    test_all()
