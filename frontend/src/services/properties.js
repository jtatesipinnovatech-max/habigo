import api from "./api";

export const getProperties = async (filters = {}) => {

  const params = {};

  // 🔍 ciudad
  if (filters.city) {
    params.city = filters.city;
  }

  // 👥 huéspedes
  if (filters.guests) {
    params.guests = filters.guests;
  }
  if (filters.start) {
    params.start = filters.start;
  }

  if (filters.end) {
    params.end = filters.end;
  }

  const res = await api.get("/properties", {
    params
  });

  return res.data;
};