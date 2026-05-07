import api from './api';

export const getPropertyReviews = async (propertyId) => {
  const res = await api.get(`/reviews/property/${propertyId}`);
  return res.data;
};

export const createReview = async (data) => {
  const res = await api.post('/reviews', data);
  return res.data;
};
export const canReviewProperty = async (
  propertyId
) => {

  const res = await api.get(
    `/reviews/can-review/${propertyId}`
  );

  return res.data;
};