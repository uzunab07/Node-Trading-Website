const model = require('../models/car')
const { uuid } = require('uuidv4');
const { Error } = require('mongoose');
const itemModel = require('../models/items')

// GET /cars : send all the cars to the user

exports.index = (req,res,next)=>{
    model.newCategory.find()
    .then((categories)=>{cat = categories})
    .catch()
    model.newCar.find()
    .then(cars=>{ 
        res.render('./trade/index',{cars: cars, categories: cat})
    })
    .catch(err=>next(err));
   
   
}

// GET /cars/new send the html form for the new car

exports.new = (req,res)=>{
    res.render('./trade/new')
}

//POST /cars creat a new car

exports.create = (req,res,next)=>{
    let car = new model.newCar(req.body)
    let categories = new model.newCategory(req.body)
    let cat = car.category
    car.author = req.session.user
    model.newCategory.findOne({category:cat})
    .then((categor)=>{
       if(categor){
        console.log("Categories already exist"+categor)
       }else{
        categories.save()
        .then()
        .catch()
       }
    })
    .catch()
    car.save()
    .then((car)=>{
        console.log(car);
         res.redirect("/cars")
    })
    .catch(err=>{
        if(err.name ==="ValidationError")
        err.status = 400
        next(err);
    })
   
    
}

// GET /cars/:id cars identify by id
exports.show=(req,res,next)=>{
    let id = req.params.id;
    let author = req.session.user;
   Promise.all( [ model.newCar.findById(id).populate('author'), itemModel.findOne({car:id,author:author})] )
    .then(results=>{
        if(results){
            const [car,fav] = results;
            res.render('./trade/show',{car,fav})
            }else{
                let err = new Error ("Cannot find story with id "+ id)
                err.status = 404;
                next(err)
            }
    })
    .catch(err=>next(err))
   
}

//Sending the edit form
exports.edit = (req,res,next)=>{
    let id = req.params.id;
    
    model.newCar.findById(id)
    .then(car=>{
        if(car){
            res.render('./trade/edit',{car})
            }else{
                let err = new Error ("Cannot find story with id "+ id)
                err.status = 404;
                next(err)
            }
    })
    .catch(err=>next(err))
}

exports.update = (req,res,next)=>{
   let  car =  req.body
    let id = req.params.id
 
    model.newCar.findByIdAndUpdate(id,car,{useFindAndModify:false, runValidators: true})
    .then(car=>{
        if(car){
        res.redirect('/cars/'+id)
        }else{
            let err = new Error ("Cannot find story with id "+ id)
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

exports.delete = (req,res,next)=>{

   let id = req.params.id
    model.newCar.findByIdAndDelete(id,{useFindAndModify:false, runValidators: true})
    .then(car=>{
        if(car){
        res.redirect('/users/profile')
        }else{
            let err = new Error ("Cannot find story with id "+ id)
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

