import api from "./axios";

export const saveMyAllergies = (allergies) =>
  api.post("/allergy/my-allergies", { allergies });

export const fetchMyAllergies = () => api.get("/allergy/my-allergies");
