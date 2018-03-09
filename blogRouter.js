const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();
const {BlogPosts} = require('./models');

BlogPosts.create("TestingTitle", "This is a test to see if this blog post will print", "Diksha Sach", "03-09-2017" );
BlogPosts.create("TestingTitle2", "Testing number 2", "Diksha Sach", "03-09-2018" );
router.get('/', (req,res)=>{
    res.json(BlogPosts.get());
});

router.post('/', jsonParser, (req,res) => {
    const requiredFields = ['title', 'content', 'author', 'publishDate'];
    for(let i=0; i<requiredFields.length;i++){
        const field = requiredFields[i];
        if(!(field in req.body)){
            const message = `Missing \`${field}\` in request body`
            console.error(message);
            return res.status(400).send(message);
        }
    }
    const item = BlogPosts.create(req.body.title, req.body.content, req.body.author, req.body.publishDate);
    res.status(201).json(item);
});

router.delete('/:id', (req, res)=>{
    BlogPosts.delete(req.params.id);
    console.log(`Delete the post with the id  \`${req.params.id}\``);
    res.status(204).end();
    
});

router.put('/:id', jsonParser, (req,res)=>{
    const requiredFields = ['title', 'content', 'author', 'publishDate'];
    for(let i=0; i<requiredFields.length;i++){
        const field = requiredFields[i];
        if(!(field in req.body)){
            const message = `Missing \`${field}\` in request body`
            console.error(message);
            return res.status(400).send(message); 
        }
    }
    if(req.params.id !== req.body.id){
        const message = (
            `Requested path id ${req.params.id} and the body id ${req.body.id} are not equivalent`
        );
        console.error(message);
        return res.status(400).send(message);
    }
    console.log(`Updating the blog post ${req.params.id}`);
    const updatedPost = BlogPosts.update({
        id: req.params.id,
        title: req.body.title,
        content: req.body.content,
        author: req.body.author,
        publishDate: req.body.publishDate
    });
    res.status(204).end();

});

module.exports = router;