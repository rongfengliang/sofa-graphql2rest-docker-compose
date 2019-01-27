const express = require('express');
const graphqlHTTP = require('express-graphql');
const {
  buildSchema
} = require('graphql');
const sofa = require('sofa-api');
let count = 0;
const port = process.env.port || 3000;

// Construct a schema, using GraphQL schema language
const schema = buildSchema(`
  type Query {
    hello: String!
    count: Int!
    getcomments: [Comment]
  }

  type Mutation {
    increment_counter: count_mutation_response!
    comments: [Comment]

  }
  type Comment {
    id: ID
    text: String
  }
  type count_mutation_response {
    new_count: Int!
  }
`);

// The root provides a resolver function for each API endpoint
const root = {
  hello: () => {
    return 'Hello world!';
  },
  count: () => {
    return count;
  },
  increment_counter: () => {
    return {
      new_count: ++count
    }
  },
  getcomments: ()=>{
    return [{
      id: 1,
      text: "dalongdemo"
    },
    {
      id: 2,
      text: "appdemo"
    }
  ]
  },
  comments: () => {
    return [{
        id: 1,
        text: "dalongdemo"
      },
      {
        id: 2,
        text: "appdemo"
      }
    ]
  }
};

var app = express();
app.use('/graphql', graphqlHTTP({
  schema: schema,
  rootValue: root,
  graphiql: true,
}));
const openApi = sofa.OpenAPI({
  schema,
  info: {
    title: 'Example API',
    version: '3.0.0',
  },
});
app.use('/api', sofa.useSofa({
  schema,
  onRoute(info) {
    openApi.addRoute(info, {
      basePath: '/api',
    });
  },
}));
app.listen(port);
openApi.save('./swagger.yml');
console.log(`Running a GraphQL API server at localhost:${port}/graphql`);