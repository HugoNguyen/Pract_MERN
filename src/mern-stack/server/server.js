const express = require('express'); //import express module
const {ApolloServer} = require('apollo-server-express');//import apollo-server-express, this is graphql server

let aboutMessage = 'Issue Tracker API v1.0'; //declare an arbitrary string

//Define types
const typeDefs = `
    type Query {
        about: String!
    }
    type Mutation {
        setAboutMessage(message:String!): String
    }
`;

const resolvers = {
    Query:{
        about:()=> aboutMessage,
    },
    Mutation:{
        setAboutMessage,
    }
};

/*
Resolver func are supplied 4 args
-> fieldName(obj, args, context, info)
EX: setAboutMessage(message: "New Message") -> args is {"message": "New Message"}
*/
//ES2015, Destructuring Assignment feature
//Access the message property in 'args'
function setAboutMessage(_,{message}){
    return aboutMessage = message;
}

//New an Apollo Server
const server = new ApolloServer({
    typeDefs,
    resolvers
})

const app = express(); //new express app web server

const fileServerMiddleware = express.static('public');//A middleware, to return a looking static file base on reqs

const port = 3000; // declare an arbitrary port, if using port 80, need to have adminsitrative privileges.

app.use('/',fileServerMiddleware);//Mount the middleware for this app.

//Install Apollo as an express's middleware
server.applyMiddleware({app,path:'/graphql'});

app.listen(port,function(){
    console.log(`App started on port ${port}`);
});


