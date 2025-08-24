import * as yup from "yup";

export const loginSchema = yup.object({
    email: yup.string().email().required(),
    password: yup.string().required()
})

export const registerSchema = yup.object({
    name: yup.string().required(),
    email: yup.string().email().required(),
    password: yup.string()
        .min(8)
        .max(255)
        .matches(/[A-Z]/)
        .matches(/[a-z]/)
        .matches(/[0-9]/)
        .matches(/[@$!%*?&]/)
        .required()
})