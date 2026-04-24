const DashboardModel = require('../models/dashboardModel');

const getDashboard = async (req, res) => {
  const user_id = req.user.id;

  try {
    const total_properties =
      await DashboardModel.getTotalProperties(user_id);

    const total_bookings =
      await DashboardModel.getTotalBookings(user_id);

    res.json({
      total_properties,
      total_bookings
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: 'Error en dashboard'
    });
  }
};

module.exports = {
  getDashboard
};