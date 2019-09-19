const cloudinary = require('cloudinary')
const cloudinaryStorage = require('multer-storage-cloudinary')
const multer = require('multer')

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_USER,
  api_key: process.env.CLOUDINARY_KEY,
  api_secret: process.env.CLOUDINARY_SECRET
})

const storage = cloudinaryStorage({
  folder: 'ironbuddy',
  cloudinary,
  allowedFormats: ['png', 'jpg'],
  filename: (req, file, cb) => {
    cb(null, file.originalname)
  }
})

module.exports = multer({storage})
