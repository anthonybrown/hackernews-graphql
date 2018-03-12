'use strict';
/* eslint no-var "false" */
var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _expressGraphql = require('express-graphql');

var _expressGraphql2 = _interopRequireDefault(_expressGraphql);

var _graphqlTools = require('graphql-tools');

var _lodash = require('lodash');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const app = (0, _express2.default)();

const typeDefs = `
  type Link {
    id: Int! @unique
    url: String!
    description: String!
    author: User!
  }

  type User {
    id: Int! @unique
    username: String!
    about: String!
  }

  type Query {
    allLinks: [Link]
    link(id: Int!): Link
    allUsers: [User]
    user(id: Int!): User
  }
`;

const links = [
  { id: 0, author: 0, url: 'https://google.com', description: 'Google' },
  { id: 1, author: 1, url: 'https://github.com', description: 'Github' },
];

const users = [
  { id: 0, username: 'user1', about: 'The first user' },
  { id: 1, username: 'user2', about: 'The second user' },
];

const resolvers = {
  Query: {
    allLinks: () => links,
    link: (_, { id }) => (0, _lodash.find)(links, { id }),
    allUsers: () => users,
    user: (_, { id }) => (0, _lodash.find)(users, { id }),
  },
  Link: {
    author: ({ author }) => (0, _lodash.find)(users, { id: author }),
  },
};

const schema = (0, _graphqlTools.makeExecutableSchema)({
  typeDefs,
  resolvers,
});

app.use(
  '/graphql',
  (0, _expressGraphql2.default)({
    schema,
    graphiql: true,
  }),
);

app.listen(4000, () => console.log(`Running a GraphQL API server at localhost:4000/graphql`)); // eslint-disable-line no-console
