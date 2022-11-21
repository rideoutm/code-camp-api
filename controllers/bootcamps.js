const ErrorResponse = require("../utils/errorResponse");
const Bootcamp = require("../models/Bootcamp.js");
const asyncHandler = require("../middleware/async");
const geocoder = require("../utils/geocoder");

// Get all bootcamps
// Route    GET /api/v1/bootcamps
// Access   Public
exports.getBootcamps = asyncHandler(async (req, res, next) => {
  let query;
  const reqQuery = { ...req.query };

  // fields to exclude
  const removeFields = ["select", "sort"];

  // loop over removeFields and delete from reqQuery
  removeFields.forEach((param) => delete reqQuery[param]);
  console.log(reqQuery);

  let queryStr = JSON.stringify(reqQuery);

  // create operators ($gt, $gte etc)
  queryStr = queryStr.replace(
    /\b(gt|gte|lt|lte|in)\b/g,
    (match) => `$${match}`
  );

  // finding resource
  query = Bootcamp.find(JSON.parse(queryStr));

  // select fields
  if (req.query.select) {
    const fields = req.query.select.split(",").join(" ");
    query = query.select(fields);
  }

  // Sort
  if (req.query.sort) {
    const sortBy = req.query.sort.split(",").join(" ");
    query = query.sort();
  } else {
    query = query.sort("-createdAt");
  }

  // execute query
  const bootcamps = await Bootcamp.find(query);
  res
    .status(200)
    .json({ success: true, count: bootcamps.length, data: bootcamps });
});

// Get single bootcamp
// Route    GET /api/v1/bootcamps/:id
// Access   Public
exports.getBootcamp = asyncHandler(async (req, res, next) => {
  const bootcamp = await Bootcamp.findById(req.params.id);

  if (!bootcamp) {
    return next(
      new ErrorResponse(`Bootcamp not found with id of ${req.params.id}, 404`)
    );
  }

  res.status(200).json({ success: true, data: bootcamp });
});

// Create new bootcamp
// Route    POST /api/v1/bootcamps
// Access   Private
exports.createBootcamp = asyncHandler(async (req, res, next) => {
  const bootcamp = await Bootcamp.create(req.body);
  console.log(req.body);
  res.status(201).json({
    success: true,
    data: bootcamp,
  });
});

// Update bootcamp
// Route    PUT /api/v1/bootcamps/:id
// Access   Private
exports.updateBootcamp = asyncHandler(async (req, res, next) => {
  const bootcamp = await Bootcamp.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!bootcamp) {
    return next(
      new ErrorResponse(`Bootcamp not found with id of ${req.params.id}, 404`)
    );
  }
  res.status(200).json({ success: true, data: bootcamp });
  // next(err);
});

// Delete bootcamp
// Route    DELETE /api/v1/bootcamps/:id
// Access   Private
exports.deleteBootcamp = asyncHandler(async (req, res, next) => {
  const bootcamp = await Bootcamp.findByIdAndDelete(req.params.id);

  if (!bootcamp) {
    return next(
      new ErrorResponse(`Bootcamp not found with id of ${req.params.id}, 404`)
    );
  }

  res.status(400).json({ success: true, data: {} });

  // next(err);
});

// Get bootcamps within radius
// Route    GET /api/v1/bootcamps/radius/:ziocode/:distance
// Access   Private
exports.getBootcampsInRadius = asyncHandler(async (req, res, next) => {
  const { zipcode, distance } = req.params;

  // get Lat/Long
  const loc = await geocoder.geocode(zipcode);
  const lat = loc[0].latitude;
  const lng = loc[0].longitude;

  // calc radius using radians
  // divide distance by radius of earth
  // earth radius = 3,963 mi / 6,378 km
  const radius = distance / 3963;

  const bootcamps = await Bootcamp.find({
    location: { $geoWithin: { $centerSphere: [[lng, lat], radius] } },
  });

  res
    .status(200)
    .json({ success: true, count: bootcamps.length, data: bootcamps });
});
