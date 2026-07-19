import api from "./axios";

export const fetchScanHistory = () => api.get("/test-allergens");
