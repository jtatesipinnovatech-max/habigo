import api from "./api";

export const getProperties = async () => {
  const res = await api.get("/properties");
  return res.data;
};

export const createProperty = async (propertyData) => {
  const res = await api.post("/properties", propertyData);
  return res.data;
};

export const getMyProperties = async () => {
  const res = await api.get("/properties/mine");
  return res.data;
};
