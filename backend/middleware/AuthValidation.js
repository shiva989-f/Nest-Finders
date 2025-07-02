import joi from "joi";

export const signupValidation = (req, res, next) => {
  const schema = joi.object({
    username: joi.string().min(3).required(),
    email: joi.string().email().required(),
    password: joi.string().min(6).max(60).required(),
    role: joi.string().valid("buyer", "seller", "admin").required(),
    isVerified: joi.boolean().required()
  });
  const { error } = schema.validate(req.body);
  if (error) {
    const message = error?.details[0]?.message || "Fields are not valid";
    return res.status(400).json({ message, error });
  }
  next();
};

export const loginValidation = (req, res, next) => {
  const schema = joi.object({
    email: joi.string().email().required(),
    password: joi.string().min(6).max(60).required(),
  });
  const { error } = schema.validate(req.body);
  if (error) {
    const message = error?.details[0]?.message || "Fields are not valid";
    return res.status(400).json({ message, error });
  }
  next();
};
