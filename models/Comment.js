const { Schema, model } = require('mongoose')

const commentSchema = new Schema(
  {
    comment: String,
    creator: {
      ref: 'User',
      type: Schema.Types.ObjectId
    },
    resource: {
      ref: 'Resource',
      type: Schema.Types.ObjectId,
    },
    picPath: String,
    picName: String
  },
  {
    timestamps: {
      createdAt: 'createdAt',
      updatedAt: 'updatedAt'
    }
  }
)

module.exports = model('Comment', commentSchema)