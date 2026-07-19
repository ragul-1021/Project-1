def calculate_risk_details(filtered_allergens):
    if not filtered_allergens:
        return 0, "Low"

    severity_scores = {
        "High": 70,
        "Medium": 45,
        "Low": 20,
        "Safe": 0,
    }

    additional_scores = {
        "High": 10,
        "Medium": 7,
        "Low": 4,
        "Safe": 0,
    }

    severities = [str(item.get("severity", "")).strip() for item in filtered_allergens]
    if not severities:
        return 0, "Low"

    sorted_severities = sorted(
        severities,
        key=lambda severity: severity_scores.get(severity, 0),
        reverse=True,
    )

    risk_score = severity_scores.get(sorted_severities[0], 0)
    for severity in sorted_severities[1:]:
        risk_score += additional_scores.get(severity, 0)

    risk_score = min(risk_score, 95)

    if risk_score >= 70:
        risk_level = "High"
    elif risk_score >= 40:
        risk_level = "Medium"
    else:
        risk_level = "Low"

    return risk_score, risk_level
