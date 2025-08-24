import * as yup from "yup";

export const postSchema = yup.object({
    header: yup.string().required(),
    content: yup.string().required()
})

