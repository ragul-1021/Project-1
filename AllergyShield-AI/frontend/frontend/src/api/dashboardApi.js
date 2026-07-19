import api from "./axios";

export const fetchDashboardSummary = () => api.get("/dashboard");

export const fetchRecentScans = () => api.get("/recent-scans");

export const fetchCommonAllergens = () => api.get("/common-allergen");
