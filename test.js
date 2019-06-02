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
			  	res.body.book.should.have.property('title');
			  	res.body.book.should.have.property('price');
			  	res.body.book.should.have.property('bedrooms');
			  	res.body.book.should.have.property('type');
				res.body.book.should.have.property('review_scores_rating');
				res.body.book.should.have.property('smart_location');
		      done();
		    });
	  });
  });
 /*
  * Test the /GET/:id route
  */
  describe('/GET/:id book', () => {
	  it('it should GET a book by the given id', (done) => {
	  	let book = new Book({ title: "The Lord of the Rings", author: "J.R.R. Tolkien", year: 1954, pages: 1170 });
	  	book.save((err, book) => {
	  		chai.request(server)
		    .get('/book/' + book.id)
		    .send(book)
		    .end((err, res) => {
			  	res.should.have.status(200);
			  	res.body.should.be.a('object');
			  	res.body.should.have.property('title');
			  	res.body.should.have.property('author');
			  	res.body.should.have.property('pages');
			  	res.body.should.have.property('year');
			  	res.body.should.have.property('_id').eql(book.id);
		      done();
		    });
	  	});

	  });
  });
 /*
  * Test the /PUT/:id route
  */
  describe('/PUT/:id book', () => {
	  it('it should UPDATE a book given the id', (done) => {
	  	let book = new Book({title: "The Chronicles of Narnia", author: "C.S. Lewis", year: 1948, pages: 778})
	  	book.save((err, book) => {
				chai.request(server)
			    .put('/book/' + book.id)
			    .send({title: "The Chronicles of Narnia", author: "C.S. Lewis", year: 1950, pages: 778})
			    .end((err, res) => {
				  	res.should.have.status(200);
				  	res.body.should.be.a('object');
				  	res.body.should.have.property('message').eql('Book updated!');
				  	res.body.book.should.have.property('year').eql(1950);
			      done();
			    });
		  });
	  });
  });
 /*
  * Test the /DELETE/:id route
  */
  describe('/DELETE/:id book', () => {
	  it('it should DELETE a book given the id', (done) => {
	  	let book = new Book({title: "The Chronicles of Narnia", author: "C.S. Lewis", year: 1948, pages: 778})
	  	book.save((err, book) => {
				chai.request(server)
			    .delete('/book/' + book.id)
			    .end((err, res) => {
				  	res.should.have.status(200);
				  	res.body.should.be.a('object');
				  	res.body.should.have.property('message').eql('Book successfully deleted!');
				  	res.body.result.should.have.property('ok').eql(1);
				  	res.body.result.should.have.property('n').eql(1);
			      done();
			    });
		  });
	  });
  });
});
