import joi from "joi";

export const propertyValidation = (req, res, next) => {
  const schema = joi.object({
    title: joi.string().required(),
    price: joi.number().required(),

    location: joi
      .object({
        address: joi.string().required(),
        city: joi.string().required(),
        state: joi.string().required(),
        country: joi.string().required(),
        pinCode: joi.number().required(),

        coordinates: joi
          .object({
            latitude: joi.number().optional(),
            longitude: joi.number().optional(),
          })
          .optional(),
      })
      .required(),

    description: joi.string().required(),

    plotArea: joi
      .object({
        area: joi.number().required(),
        areaIn: joi.string().required(), // e.g., \"sq.ft.\", \"sq.m.\"
      })
      .required(),

    numberOfBedrooms: joi.number().optional(),
    numberOfBathrooms: joi.number().optional(),
    numberOfBalconies: joi.number().optional(),

    furnishedStatus: joi
      .string()
      .valid("Furnished", "Semi-Furnished", "Unfurnished")
      .required(),

    totalFloors: joi.number().required(),

    propertyType: joi
      .string()
      .valid("Apartment", "House", "Villa", "Plot", "Commercial")
      .required(),

    status: joi
      .string()
      .valid("For Sale", "For Rent", "Under Construction")
      .required(),

    propertyOwner: joi.object({
      name: joi.string().required(),
      email: joi.string().email().required(),
      contactNo: joi
        .string()
        .pattern(/^\d{10}$/)
        .messages({ messages: "Contact number must be a 10-digit number" })
        .required(),
    }),
    views: joi.number().optional().default(0),
    favourites: joi.number().optional().default(0),

    listedBy: joi.string().required(),
  });
  const { error } = schema.validate(req.body);
  if (error) {
    const message = error?.details[0]?.message || "Fields are not valid";
    return res.status(400).json({ message, error });
  }
  next();
};
