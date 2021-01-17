//During the test the env variable is set to test
process.env.NODE_ENV = 'test';

let mongoose = require("mongoose");
let Listing = require('../app/models/listing');

//Require the dev-dependencies
let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../server');
let should = chai.should();
mongoose.connect('mongodb+srv://cajuluokeke:Onyeabacha1%24@test-cluster-qau7u.mongodb.net/test1?retryWrites=true' , { useNewUrlParser: true });


chai.use(chaiHttp);

//Our parent block
describe('Listings', () => {
	beforeEach((done) => { //Before each test we empty the database
		Listing.remove({}, (err) => { 
		   done();		   
		});		
	});
 /*
  * Test the /GET route
  */
  describe('/GET listing', () => {
	  it('it should GET all the listings', (done) => {
			chai.request(server)
		    .get('/listing')
		    .end((err, res) => {
			  	res.should.have.status(200);
			  	res.body.should.be.a('array');
			  	res.body.length.should.be.eql(0);
		      done();
		    });
	  });
  });
 /*
  * Test the /POST route
  */
  describe('/POST listing', () => {
	  it('it should not POST a listing without pages field', (done) => {
	  	let listing = {
	  		title: "Garden Views",
	  		price: "43",
	  		bedrooms: 1,
			type: "Apartment",
			review_scores_rating: 81,
			smart_location: "Brighton East, Australia"
	  	}
			chai.request(server)
		    .post('/listing')
		    .send(listing)
		    .end((err, res) => {
			  	res.should.have.status(200);
			  	res.body.should.be.a('object');
			  	res.body.should.have.property('errors');
			  	res.body.errors.should.have.property('pages');
			  	res.body.errors.pages.should.have.property('kind').eql('required');
		      done();
		    });
	  });
	  it('it should POST a listing ', (done) => {
	  	let listing = {
	  		title: "Garden Views",
	  		price: "43",
	  		bedrooms: 1,
			type: "Apartment",
			review_scores_rating: 81,
			smart_location: "Brighton East, Australia"
	  	}
			chai.request(server)
		    .post('/listing')
		    .send(listing)
		    .end((err, res) => {
			  	res.should.have.status(200);
			  	res.body.should.be.a('object');
			  	res.body.should.have.property('message').eql('Listing successfully added!');
			  	res.body.listing.should.have.property('title');
			  	res.body.listing.should.have.property('price');
			  	res.body.listing.should.have.property('bedrooms');
			  	res.body.listing.should.have.property('type');
				res.body.listing.should.have.property('review_scores_rating');
				res.body.listing.should.have.property('smart_location');
		      done();
		    });
	  });
  });
 /*
  * Test the /GET/:id route
  */
  describe('/GET/:id listing', () => {
	  it('it should GET a listing by the given id', (done) => {
	  	let listing = new Listing({ title: "Garden Views", price: "43", bedrooms: 1, type: "Apartment", review_scores_rating: 81, smart_location: "Brighton East, Australia" });
	  	listing.save((err, listing) => {
	  		chai.request(server)
		    .get('/listing/' + listing.id)
		    .send(listing)
		    .end((err, res) => {
			  	res.should.have.status(200);
			  	res.body.should.be.a('object');
			  	res.body.should.have.property('title');
			  	res.body.should.have.property('author');
			  	res.body.should.have.property('pages');
			  	res.body.should.have.property('year');
			  	res.body.should.have.property('_id').eql(listing.id);
		      done();
		    });
	  	});

	  });
  });
 /*
  * Test the /PUT/:id route
  */
  describe('/PUT/:id listing', () => {
	  it('it should UPDATE a listing given the id', (done) => {
	  	let listing = new Listing({title: "Garden Views", price: "43", bedrooms: 1, type: "Apartment", review_scores_rating: 81, smart_location: "Brighton East, Australia"})
	  	listing.save((err, listing) => {
				chai.request(server)
			    .put('/listing/' + listing.id)
			    .send({title: "Garden Views", price: "43", bedrooms: 1, type: "Apartment", review_scores_rating: 81, smart_location: "Brighton East, Australia"})
			    .end((err, res) => {
				  	res.should.have.status(200);
				  	res.body.should.be.a('object');
				  	res.body.should.have.property('message').eql('Listing updated!');
				  	res.body.listing.should.have.property('year').eql(1950);
			      done();
			    });
		  });
	  });
  });
 /*
  * Test the /DELETE/:id route
  */
  describe('/DELETE/:id Listing', () => {
	  it('it should DELETE a listing given the id', (done) => {
	  	let listing = new Listing({title: "Garden Views", price: "43", bedrooms: 1, type: "Apartment", review_scores_rating: 81, smart_location: "Brighton East, Australia"})
	  	listing.save((err, listing) => {
				chai.request(server)
			    .delete('/listing/' + listing.id)
			    .end((err, res) => {
				  	res.should.have.status(200);
				  	res.body.should.be.a('object');
				  	res.body.should.have.property('message').eql('Listing successfully deleted!');
				  	res.body.result.should.have.property('ok').eql(1);
				  	res.body.result.should.have.property('n').eql(1);
			      done();
			    });
		  });
	  });
  });
});
