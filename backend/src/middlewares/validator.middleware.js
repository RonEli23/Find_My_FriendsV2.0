import { body } from "express-validator";

export const validate = (method) => {
        switch (method) {
                case "handlePetDetails": {
                        return [
                                body("petName")
                                        .not()
                                        .isEmpty()
                                        .withMessage("אוי, נראה ששכחת להזין את שם החיה")
                                        .trim()
                                        .isLength({ min: 2, max: 26 })
                                        .withMessage("שם החיה צריך להכיל בין 2 ל-26 תווים")
                                        .escape(),
                                body("petGender")
                                        .not()
                                        .isEmpty()
                                        .withMessage("אוי! נראה ששכחת להזין את מין החיה")
                                        .trim()
                                        .escape(),
                                body("petBreeds")
                                        .not()
                                        .isEmpty()
                                        .withMessage("אוי, נראה ששכת להזין שמות גזעים")
                                        .trim()
                                        .escape(),
                                body("location")
                                        .not()
                                        .isEmpty()
                                        .withMessage("אוי, נראה ששכחת להזין מיקום גאוגרפי")
                                        .trim()
                                        .isLength({ min: 3, max: 26 })
                                        .withMessage("מיקום צריך להכיל בין 3 ל-26 תווים")
                                        .escape(),
                        ];
                }
                case "handleSignUp": {
                        return [
                                body("first_name")
                                        .not()
                                        .isEmpty()
                                        .trim()
                                        .withMessage("אוי, נראה ששכחת להזין שם פרטי")
                                        .isLength({ min: 2, max: 26 })
                                        .withMessage("שם פרטי צריך להכיל בין 2 ל-26 תווים")
                                        .escape(),
                                body("last_name")
                                        .not()
                                        .isEmpty()
                                        .trim()
                                        .withMessage("אוי, נראה ששכחת להזין שם משפחה")
                                        .isLength({ min: 2, max: 26 })
                                        .withMessage("שם משפחה צריך להכיל בין 2 ל-26 תווים")
                                        .escape(),
                                body("email")
                                        .not()
                                        .isEmpty()
                                        .withMessage("אוי, נראה ששכחת להזין כתובת אימייל")
                                        .isEmail()
                                        .withMessage("אופס! כתובת מייל לא תקינה")
                                        .normalizeEmail(),
                                body("user_password")
                                        .not()
                                        .isEmpty()
                                        .withMessage("אוי, נראה ששכחת לזין סיסמא")
                                        .trim()
                                        .escape()
                                        .isLength({ min: 4, max: 26 })
                                        .withMessage("סיסמה צריכה להכיל בין 4 ל-26 תווים"),
                                body("phone_number")
                                        .optional()
                                        .trim()
                                        .escape()
                                        .custom((value) => {
                                                if (value && !/^[0-9]+$/.test(value)) {
                                                        throw new Error("ניתן להכניס רק מספרים");
                                                }
                                                if (value && value.length !== 10) {
                                                        throw new Error("ניתן להזין 10 ספרות בדיוק בשדה טלפון");
                                                }
                                                return true;
                                        })
                        ];
                }
                case "handleSignIn": {
                        return [
                                body("email")
                                        .not()
                                        .isEmpty()
                                        .withMessage("אוי, נראה ששכחת להזין כתובת אימייל")
                                        .isEmail()
                                        .withMessage("אוי, כתובת האימייל שהזנת לא תקינה")
                                        .normalizeEmail(),
                                body("user_password")
                                        .not()
                                        .isEmpty()
                                        .withMessage("אוי, נראה ששכחת לזין סיסמא")
                                        .trim()
                                        .escape()
                                        .isLength({ min: 4, max: 26 })
                                        .withMessage("סיסמה צריכה להכיל בין 4 ל-26 תווים"),
                        ];
                }
                case "handleContactUs": {
                        return [
                                body("userFirstName")
                                        .not()
                                        .isEmpty()
                                        .trim()
                                        .withMessage("אוי, נראה ששכחת להזין שם פרטי")
                                        .isLength({ min: 2, max: 26 })
                                        .withMessage("שם פרטי צריך להכיל בין 2 ל-26 תווים")
                                        .escape(),
                                body("userLastName")
                                        .not()
                                        .isEmpty()
                                        .trim()
                                        .withMessage("אוי, נראה ששכחת להזין שם משפחה")
                                        .isLength({ min: 2, max: 26 })
                                        .withMessage("שם משפחה צריך להכיל בין 2 ל-26 תווים")
                                        .escape(),
                                body("userEmail")
                                        .not()
                                        .isEmpty()
                                        .withMessage("אוי, נראה ששכחת להזין כתובת אימייל")
                                        .isEmail()
                                        .withMessage("אוי, כתובת האימייל שהזנת לא תקינה")
                                        .normalizeEmail(),
                                body("message")
                                        .not()
                                        .isEmpty()
                                        .withMessage("אוי, נראה ששכחת לזין הודעה")
                                        .trim()
                                        .escape()
                                        .isLength({ min: 2 })
                                        .withMessage("על הודעה להכיל יותר משני תווים"),
                        ];
                }
        }
};

