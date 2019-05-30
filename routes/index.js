var express = require('express');
var router = express.Router();

var Wishlist = require('../models/wishlist');
var Listing = require('../models/listing');

/* GET home page. */
router.get('/', function(req, res, next) {
  var listings = Listing.find(function(err, docs){
    var listChunks = [];
    var chunkSize = 3;
    for (var i = 0; i < docs.length; i+= chunkSize){
      listChunks.push(docs.slice(i, i + chunkSize));
    }
    res.render('listing/index', { title: 'Dripped out Project', listings: listChunks });
  }).skip(15).limit(18);
});

router.get('/add-to-wishlist/:id', function(req, res, next) {
  var listingId = req.params.id;
  var wishlist = new Wishlist(req.session.wishlist ? req.session.wishlist : {});

  Listing.findById(listingId, function(err, listing) {
    if (err) {
      return res.redirect('/');
    }
    wishlist.add(listing, listing.id);
    req.session.wishlist = wishlist;
    console.log(req.session.wishlist);
    res.redirect('/');
  });
});

router.get('/wishlist', function(req, res, next) {
  if(!req.session.wishlist) {
    return res.render('listing/wishlist', {listings: null});
  }
  var wishlist = new Wishlist(req.session.wishlist);
  res.render('listing/wishlist', {listings: wishlist.generateArray()});
});

module.exports = router;
