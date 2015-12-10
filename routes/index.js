var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var passport = require('passport');
var User = mongoose.model('User');
var Image = mongoose.model('Image');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index');
});

router.get('/login/twitter',
  passport.authenticate('twitter'));

router.get('/login/twitter/return', 
  passport.authenticate('twitter', { failureRedirect: '/login' }),
  function(req, res) {
    res.redirect('/');
});

router.get('/profile/currentUser', function(req, res, next) {
    res.json(req.user);
});

router.put('/submitImage', function(req, res, next) {
    var image = new Image();
    
    image.title = req.body.title;
    image.author = req.body.author;
    image.link = req.body.link;
    
    for(var i = 0; i < req.body.tags.length; i++) {
        image.tags.push(req.body.tags[i].toLowerCase());
    }
    
    image.save();
    
    res.json(image);
});

router.get('/getImages', function (req, res, next) {
    Image.find({}, function(err, images) {
        if (err) { console.log(err); return; }
        
        res.json(images);
    })
});

router.put('/images/:image/upvote', function (req,res,next) {
    Image.findOne({_id: req.params.image}, function(err, response) {
        if(err) { return next(err); }
        response.upvote(function(err, image) {
            if(err) { return next(err); }
        
            res.json(image);
        });
    });
});

router.get('/searchAuthor/:author', function (req, res, next) {
    Image.find({author: req.params.author}, function (err, response) {
        if(err) { return next(err); }
        
        res.json(response);
    });
});

router.get('/searchTag/:tag', function (req, res, next) {
    Image.find({tags: req.params.tag.toLowerCase()}, function (err, response) {
        if(err) { return next(err); }
        
        res.json(response);
    });
});

router.delete('/images/:image', function(req, res, next) {
    Image.findOne({_id: req.params.image}, function (err, response) {
        response.remove(function(err, post){
            if (err) { return next(err); }
    
            res.json(post);
        });
    });
});

router.get('/logout', function(req, res){
    req.logout();
    res.json();
});

module.exports = router;
