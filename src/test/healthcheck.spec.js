import request from 'supertest';
import server from '../bin/server';
import chai  from 'chai';

const should = chai.should();

describe('Testing to check health', function(){
  it('Should handle a request to check health', function(done){
    request(server)
      .get('/api/v1')
      .expect(200)
      .end((error, response) => {
        if(error) return done(error);
        response.body.should.be.a('object');
        response.body.should.have.property('code').and.to.be.a('number').equal(200);
        response.body.should.have.property('message');
        done();
      });   
  });
  it('Should handle a request to check 404 error', function(done){
    request(server)
      .get('/api/v1/404')
      .expect(404)
      .end((error, response) => {
        if(error) return done(error);
        response.body.should.be.a('object');
        response.body.should.have.property('code').and.to.be.a('number').equal(404);
        response.body.should.have.property('error');
        done();
      });   
  });
});