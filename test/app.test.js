const supertest = require('supertest');
const chai = require('chai');
const app = require('../app');

const expect = chai.expect;
const request = supertest( app.listen());

describe( '开始测试GET请求', ( ) => {

    // 测试用例
    it('测试/', ( done ) => {
        request
          .get('/')
          .expect(200)
          .end(( err, res ) => {
              expect(res.body).to.be.an('object');
              done();
          })
    })

    // 测试用例
    it('测试/', ( done ) => {
        request
            .get('/v1/')
            .expect(200)
            .end(( err, res ) => {
                expect(res.body).to.be.an('object')
                expect(res.body.success).to.be.an('boolean')
                expect(res.body.info).to.be.an('string')
                done()
        });
    });
});