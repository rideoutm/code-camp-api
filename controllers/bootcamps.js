// Get all bootcamps
// Route    GET /api/v1/bootcamps
// Access   Public
exports.getBootcamps = (req, res, next) => {
  res.status(200).json({ success: true, msg: "Show all bootcamps" });
};

// Get single bootcamp
// Route    GET /api/v1/bootcamps/:id
// Access   Public
exports.getBootcamp = (req, res, next) => {
  res
    .status(200)
    .json({ success: true, msg: `Show bootcamp ${req.params.id}` });
};

// Create new bootcamp
// Route    POST /api/v1/bootcamps
// Access   Private
exports.createBootcamp = (req, res, next) => {
  res.status(200).json({ success: true, msg: "Show all bootcamps" });
};

// Update bootcamp
// Route    PUT /api/v1/bootcamps/:id
// Access   Private
exports.updateBootcamp = (req, res, next) => {
  res
    .status(200)
    .json({ success: true, msg: `Update bootcamp ${req.params.id}` });
};

// Delete bootcamp
// Route    DELETE /api/v1/bootcamps/:id
// Access   Private
exports.deleteBootcamp = (req, res, next) => {
  res
    .status(200)
    .json({ success: true, msg: `Delete bootcamp ${req.params.id}` });
};
