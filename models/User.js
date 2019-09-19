const {Schema, model} = require('mongoose')
const plm = require('passport-local-mongoose')

const userSchema = new Schema(
  {
    name: String,
		lastname: String,
    email: String,
		password: String,
    role: {
      type: String,
      enum: ['ADMIN', 'USER'],
      default: 'USER'
    },
    resource: {
      ref: 'Resource',
      type: Schema.Types.ObjectId
    },
    img: {
      type: String,
      default: 'https://www.sutterhealth.org/assets/img/dr-profiles/default-dr-profile.png'
    },
    confirmationCode: String,
    status: {
      type: String,
      enum: ['Pending Confirmation', 'Active'],
      default: 'Pending Confirmation',
    },
  },
  {
    timestamps: {
      createdAt: 'createdAt',
      updatedAt: 'updatedAt'
    }
  }
)

userSchema.plugin(plm, {usernameField: 'email'})

module.exports = model('User', userSchema)
