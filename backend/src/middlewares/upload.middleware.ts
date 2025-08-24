import multer from "multer";


const storage = multer.memoryStorage()


const upload = multer({
    limits: {
        fileSize: 1024 * 1024 * 20
    },
    storage
})

export default upload