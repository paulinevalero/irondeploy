const User = require('../models/User')
const Resource = require('../models/Resource')

exports.getProfile  = async (req, res) => {
  const user = await User.findById(req.user._id).populate('resource')
  console.log(user)
  res.render('profile', user)
}

exports.editProfileForm  = async (req, res) => {
  const { userid } = req.query
  const user = await User.findById(userid).populate('resource')
  console.log(user)
  res.render('profile/edit', user)
}

exports.editProfile = async (req,res ) => {
  const { name, lastname } = req.body
  const {url: img} = req.file
  const { userid } = req.query
  await User.findByIdAndUpdate(userid, { name, lastname, img })
  console.log('editprofile',userid)
  res.redirect('/profile')
}

exports.getResource = async (req, res) => {
  const resources = await Resource.find().populate('user')
  const user = req.user
  console.log('usr', user)
  res.render('profile/resources', {resources, user})
}
//* se agregó user=req.user
//Resource.find me va a traer todo lo de todos 

// router.get("/", isLoggedIn, async(req, res) => {
//   const posts = await Post.find().populate('creator')
//   res.render('index',{ posts } );
// })

exports.addResource = async (req, res) => {
  const { name, url } = req.body
  const user = req.session.currentUser
  await Resource.create({
    name,
    url,
    user
  })
  res.redirect('/profile/resources')
}

exports.addResourceForm = async (req, res) => {
  res.render('profile/addresources')
}


exports.getResourceView = async (req, res) => {
  const { resourceid } = req.query
  const resource = await Resource.findById(resourceid).populate({path: 'comments.creator', model: 'User'})
  resource.user = req.user  
  res.render('profile/resource', resource)
  
}

exports.addComment = async (req, res, next) => {
  const { id } = req.params
  
  const { comment } = req.body
  const { originalname: picName, url: picPath } = req.file
  
  const getResource = await Resource.findByIdAndUpdate({ _id: id }, { $push: { comments: { creator: req.user.id, comment, picName, picPath} } })
  res.redirect(`/profile/resource?resourceid=${getResource._id}`)
}












exports.deleteResource = async (req, res) => {
  const {resourceid} = req.params//query
  await Resource.findByIdAndDelete(resourceid)
  res.redirect('/profile/resources')
}