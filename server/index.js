import express from 'express';
import graphqlHTTP from 'express-graphql';
import { makeExecutableSchema } from 'graphql-tools';
import { find } from 'lodash';

const app = express();

const typeDefs = `
  type Link {
    id: Int! @unique
    url: String!
    description: String!
		author: User!
		comments: [Comment]
  }

  type User {
    id: Int! @unique
    username: String!
    about: String!
  }

	type Comment {
    id: Int! @unique
		parent: Comment
		comments: [Comment]
		author: User!
		content: String!
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
  { id: 2, username: 'user3', about: 'The third user' },
];

const commentsList = [
  { id: 0, parent: null, author: 0, content: 'Comment 1' },
  { id: 1, parent: 0, author: 1, content: 'Comment 2' },
  { id: 2, parent: 1, author: 0, content: 'Comment 3' },
  { id: 3, parent: 0, author: 2, content: 'Comment 4' },
  { id: 4, parent: null, author: 2, content: 'Comment 5' },
];

const resolvers = {
  Query: {
    allLinks: () => links,
    link: (obj, args, context, info) => find(links, { id: args.id }), // eslint-disable-line no-unused-vars
    allUsers: () => users,
    user: (obj, args, context, info) => find(users, { id: args.id }), // eslint-disable-line no-unused-vars
  },
  Link: {
    author: ({ author }) => find(users, { id: author }),
    comments: ({ comments }) => comments.map(i => find(commentsList, { id: i })),
  },
};

const schema = makeExecutableSchema({ typeDefs, resolvers });

app.use('/graphql', graphqlHTTP({ schema, graphiql: true }));

app.listen(4000, () => console.log(`Running a GraphQL API server at localhost:4000/graphql`)); // eslint-disable-line no-console
