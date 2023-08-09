const getDashboardData = async (req, res) => {
  return res.status(200).send({ success: true, user_data: req.user });
};

module.exports = { getDashboardData };
