import { body, validationResult } from "express-validator";

export const handleValidation = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ error: errors.array() });
    }
    next();
}

export const registerValidator = [
    body("name")
        .notEmpty().withMessage("name is required")
        .isLength({ min: 4 }).withMessage("your name contain atleast 4 letters")
        .trim().escape(),

    body("email")
        .notEmpty().withMessage("email is required")
        .isEmail().withMessage("enter a valid email")
        .normalizeEmail(),

    body("password")
        .isLength({ min: 6 }).withMessage("your password contain atleast 6 characters")
        .matches(/\d/).withMessage("password must contain a number")
        .trim(),
    handleValidation,
];

export const validationLogin = [
    body("email")
        .notEmpty().withMessage("email is required")
        .isEmail().withMessage("Enter a valid email")
        .normalizeEmail(),

    body("password")
        .isLength({ min: 6 }).withMessage("your password contain atleast 6 characters")
        .matches(/\d/).withMessage("password must contain a number")
        .trim(),

    handleValidation,
];