import api from "./api";

export const getProperties = async () => {
  const res = await api.get("/properties");
  return res.data;
};