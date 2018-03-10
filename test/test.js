const chai = require('chai');
const chaiHttp = require('chai-http');
const {app, runServer, closeServer} = require('../index');
const expect = chai.expect;
chai.use(chaiHttp);

describe('Blog Post', function(){
    before(function(){
        return runServer();
    });
    after(function(){
        return closeServer();
    });
    
    it('Should list blog posts on GET', function(){
        return chai.request(app)
        .get('/blog')
        .then(function(res){
            expect(res).to.be.status(200);
            expect(res).to.be.json;
            expect(res.body).to.be.a('array');
            expect(res.body.length).to.be.at.least(1);
            const expectedKeys = ['title', 'content', 'author', 'publishDate'];
            res.body.forEach(function(item){
                expect(item).to.be.a('object');
                expect(item).to.include.keys(expectedKeys);
            });
        });
    });

    it('Should add a blog post on POST',function(){
        const newItem = {
            title: "This is a test post",
            content:"This is a test post lorem epsum lorem epsum lorem epsum lorem epsum",
            author: 'Diksha Sach',
            publishDate: '03-10-18'
        }
        return chai.request(app)
        .post('/blog')
        .send(newItem)
        .then(function(res){
            expect(res).to.have.status(201);
            expect(res).to.be.json;
            expect(res.body).to.be.a('object');
            expect(res.body).to.include.keys('title', 'id', 'content', 'author','publishDate');
            expect(res.body.id).to.not.equal(null);
            expect(res.body).to.deep.equal(Object.assign(newItem, {
                id:res.body.id}));
        });
    });

    it('should update a blog post on PUT', function(){
        const updateData ={
            title: "This is an updated post",
            content:"This is a test post lorem epsum lorem epsum lorem epsum lorem epsum",
            author: 'Diksha Sach',
            publishDate: '03-11-18' 
        };
        return chai.request(app)
        .get('/blog')
        .then(function(res){
            updateData.id = res.body[0].id;
            return chai.request(app)
            .put(`/blog/${updateData.id}`)
            .send(updateData);
        })
        .then(function(res){
            expect(res).to.have.status(204);
        });
    });
    it('should delete a blog post on DELETE', function(){
        return chai.request(app)
        .get('/blog')
        .then(function(res){
            return chai.request(app)
            .delete(`/blog/${res.body[0].id}`);
        });
        then(function(res){
            expect(res).to.have.status(204);
        });
    });
});