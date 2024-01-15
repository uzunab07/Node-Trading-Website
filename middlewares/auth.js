const model = require('../models/car');
//check if user is a guest
exports.isGuest = (req,res,next)=>{
    if(!req.session.user)
    return next();
    else{
        req.flash("error", "you are alreday logged in")
        return res.redirect('/users/profile')
    }
}

//check if user is authenticate

exports.isLoggedIn = (req,res,next)=>{
    if(req.session.user)
    return next();
    else{
        req.flash("error", "you meed to logged in")
        return res.redirect('/users/login')
    }
}

//check if user author of the story
exports.isAuthor = (req,res,next)=>{
  let id =  req.params.id;
  model.newCar.findById(id)
  .then(car=>{
    if(car){
        console.log(car.author)
        console.log(req.session.user)
        if(car.author == req.session.user){
            return next();
        }else{
            let err = new Error('Unauthorized to acces the ressource');
            err.status = 401;
            return next(err);
        }
    }
  })
  .catch(err=>next(err))
}