const userModel = require('../models/user')
const carModel = require('../models/car');
const { model} = require('mongoose');
var ObjectId = require('mongoose').Types.ObjectId;
const itemsModel = require('../models/items');
const offerModel = require('../models/offer');
const mongoose = require('mongoose');



exports.new = (req,res)=>{
        res.render('./user/new');
}

exports.create = (req,res,next)=>{
        console.log(req.body)
        let user = new userModel(req.body) 
        user.save()//insert the document to the database
       .then(user=> res.redirect('/users/login'))
       .catch((err)=>{
           if(err.name === 'ValidationError' ) {
               req.flash('error', err.message);  
               return res.redirect('/users/new');
           }
   
           if(err.code === 11000) {
               req.flash('error', 'Email has been used');  
               return res.redirect('/users/new');
           }
           
           next(err);
           } )
}

exports.getUserLogin = (req,res)=>{
  
    res.render('./user/login');
    
}


exports.login = (req, res, next)=>{
   
        let email = req.body.email;
        let password = req.body.password;
        userModel.findOne({ email: email })
        .then(user => {
            if (!user) {
                console.log('wrong email address');
                req.flash('error', 'wrong email address');  
                res.redirect('/users/login');
            } else {
                user.comparePassword(password)
                .then(result=>{
                    if(result) {
                        req.session.user = user._id;
                        req.flash('success', 'You have successfully logged in');
                        res.redirect('/users/profile');
                     }else {
                    req.flash('error', 'wrong password');      
                    res.redirect('/users/login');
                }
            });       
            }
                
        })
        .catch(err => next(err));
   
   
}


exports.profile = (req, res, next)=>{
    let id = req.session.user;
    let recipient = req.session.recipient;
    console.log(recipient)
     Promise.all( [userModel.findById(id), carModel.newCar.find({author: id}),itemsModel.find({author: id}).populate('car'),offerModel.find({}).populate('likeCar').populate('author').populate('recipient')] )
    .then(results=>{
        const [user,cars,fav,offers] = results;
        res.render('./user/profile', {user,cars,fav,offers})
        
    })
    .catch()
};




exports.logout = (req, res, next)=>{
    req.session.destroy(err=>{
        if(err) 
           return next(err);
       else
            res.redirect('/');  
    });
   
 };


exports.addFav = (req, res, next)=>{
    item = new itemsModel();
    item.author = req.session.user;
    item.car = req.params.id;
   itemsModel.find({car: item.car,author: item.author})
   .then((result)=>{
    if(result.length!=0){
        console.log("Item already choosed")
        console.log(result)
    }else{
        item.save()
        .then(res.redirect('/users/profile'))
        .catch((err)=>{
            next(err);
        })
    }
   })
   .catch((err)=>{
        next(err)
   }) };


   exports.removeFav = (req,res,next)=>{
    let car_id = req.params.id
    console.log(car_id)
    let author_id = req.session.user;
    itemsModel.findOneAndDelete({car: car_id,author:author_id},{useFindAndModify:false, runValidators: true})
    .then(car=>{
        if(car){
            console.log(req.header)
        console.log('Gone')
        res.redirect('/users/profile')
        }else{
            let err = new Error ("Cannot find car with id "+ car_id)
            err.status = 404;
            next(err)
        }
    })
    .catch(err=>{
        if(err.name ==="ValidationError")
        err.status = 400
        next(err);
    })
   }

   exports.InitTrade = (req,res,next)=>{
       let liked_car_id =  req.params.id;
       let  user_id = req.session.user;

       req.session.liked_car_id = liked_car_id;

       carModel.newCar.find({author: user_id})
       .then(cars=>{
            if(cars){
                res.render('./user/trade',{cars,liked_car_id})
            }
       })
       .catch()
       }

       exports.trade = (req,res,next)=>{
        let myCar = req.body.car;
        req.session.myCar = myCar;
        let likeCar = req.session.liked_car_id;
        let newOffer = new offerModel();
        newOffer.myCar = myCar;
        newOffer.likeCar = likeCar;
        newOffer.author = req.session.user;

        carModel.newCar.findById(likeCar)
        .then(result=>{
            newOffer.recipient =  result.author
        })
        .catch()

        Promise.all( [carModel.newCar.findByIdAndUpdate(myCar,{ status: 'Offer pending' }),  carModel.newCar.findByIdAndUpdate(likeCar,{ status: 'Offer pending' })] )
        .then(result=>{
            if(result){
                newOffer.save()
                .then(res.redirect('/users/profile'))
                .catch()
            }else{

            }
        })
        .catch()


    }

    exports.deleteOffer = (req,res,next)=>{
        let likeCar = req.params.id
        let author_id = req.session.user;
        let myCar = req.session.myCar;
        offerModel.findOneAndDelete({$or : [{likeCar: likeCar,author:author_id},{likeCar:myCar},{myCar:likeCar},{myCar:myCar}]},{useFindAndModify:false, runValidators: true})
        .then(car=>{
            if(car){
                Promise.all( [carModel.newCar.findByIdAndUpdate(myCar,{ status: 'Available' }),  carModel.newCar.findByIdAndUpdate(likeCar,{ status: 'Available' })] )
                .then(result=>{
                    if(result){
                        res.redirect('/users/profile') 
                    }else{
        
                    }
                })
                .catch()
            }else{
                let err = new Error ("Cannot find car with id "+ likeCar)
                err.status = 404;
                next(err)
            }
        })
        .catch(err=>{
            if(err.name ==="ValidationError")
            err.status = 400
            next(err);
        })
       }

exports.offer  = (req,res,next)=>{
    console.log("Yogi watta")
    myCar = req.params.id;
    let author_id = req.session.user;
    offerModel.findOne({myCar:myCar}).populate('myCar').populate('likeCar').populate('author').populate('recipient')
    .then(result=>{
        if(result){
            offer = result;
            res.render('./user/offer',offer)
        }
    })
    .catch()
}

exports.TradeDone  = (req,res,next)=>{
   
    myCar = req.params.id;

   offerModel.findOne({myCar: myCar}).populate('myCar').populate('likeCar').populate('author').populate('recipient')
   .then(offer=>{
        if(offer){
            Promise.all( [carModel.newCar.findByIdAndUpdate(offer.myCar.id,{ status: 'Traded' }),  carModel.newCar.findByIdAndUpdate(offer.likeCar.id,{ status: 'Traded' })] )
                .then(result=>{
                    if(result){
                        res.redirect('/users/profile') 
                    }else{
        
                    }
                })
                .catch()
        }else{
            offerModel.findOne({recipient:myCar})
            // .then(offer=>{
            //     Promise.all( [carModel.newCar.findByIdAndUpdate(myCar,{ status: 'Traded' }),  carModel.newCar.findByIdAndUpdate(likeCar,{ status: 'Traded' })] )
            //     .then(result=>{
            //         if(result){
            //             res.redirect('/users/profile') 
            //         }else{
        
            //         }
            //     })
            //     .catch()
            // })
            // .catch()
        }
   })
   .catch()
}