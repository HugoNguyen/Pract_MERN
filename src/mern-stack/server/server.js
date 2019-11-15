const fs = require('fs');
const express = require('express'); //import express module
const {ApolloServer} = require('apollo-server-express');//import apollo-server-express, this is graphql server
const {GraphQLScalarType} = require('graphql');
const {Kind} = require('graphql/language');

let aboutMessage = 'Issue Tracker API v1.0'; //declare an arbitrary string

const issuesDB = [
    {
        id: 1,
        status: 'New',
        owner:'Ravan',
        effort: 5,
        created: new Date('2018-08-15'),
        due: undefined,
        title: 'Error in console when clicking Add'
    },
    {
        id: 2,
        status: 'Assigned',
        owner:'Eddie',
        effort: 14,
        created: new Date('2018-08-16'),
        due: new Date('2018-08-30'),
        title: 'Missing bottom border on panel'
    }
];

const GraphQLDate = new GraphQLScalarType({
    name: 'GraphQLDate',
    description: 'A Date() type in GraphQL as a scalar',
    serialize(value){
        return value.toISOString();
    },
    parseValue(value){
        var rs = new Date(value);
        console.log({'parseValue':rs});
        return rs;
    },
    parseLiteral(ast){
        var rs = (ast.kind == Kind.STRING) ? new Date(ast.value) : undefined;
        debugger;
        console.log({'parseLiteral':rs});
        return rs;
    }
});

const resolvers = {
    Query:{
        about:()=> aboutMessage,
        issueList,
    },
    Mutation:{
        setAboutMessage,
        issueAdd,
    },
    GraphQLDate,
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

function issueList(){
    return issuesDB;
}

function issueAdd(_,{issue}){
    debugger;
    issue.created = new Date();
    issue.id = issuesDB.length+1;
    if(issue.status == undefined){
        issue.status = 'New';
    }
    issuesDB.push(issue);
    return issue;
}

//New an Apollo Server
const server = new ApolloServer({
    typeDefs: fs.readFileSync('./server/schema.graphql','utf-8'),
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


