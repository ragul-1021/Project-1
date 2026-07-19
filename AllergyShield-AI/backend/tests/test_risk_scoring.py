from app.services.risk_scoring import calculate_risk_details


def test_high_severity_becomes_high_risk():
    score, level = calculate_risk_details([{"severity": "High"}])
    assert score == 75
    assert level == "High"


def test_medium_severity_becomes_medium_risk():
    score, level = calculate_risk_details([{"severity": "Medium"}])
    assert score == 45
    assert level == "Medium"
