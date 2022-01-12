import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';

import {ApolloClient, createHttpLink, InMemoryCache, ApolloProvider, split} from '@apollo/client'
import {getMainDefinition} from '@apollo/client/utilities'
import {WebSocketLink} from '@apollo/client/link/ws'
import {setContext} from '@apollo/client/link/context'
import { BrowserRouter as Router} from 'react-router-dom';

const httpLink = createHttpLink({
  uri: "http://localhost:4000/graphql",
})

const wsLink = () => {
  const token = localStorage.getItem ('token');
  return new WebSocketLink({
    uri: 'ws://localhost:4000/graphql',
    options: {
      reconnect: true,
      timeout: 30000
    }
  })
}

const authLink = setContext(async(_, {headers})=>{
  const token = await localStorage.getItem('token')
  return{
    headers: {
      ...headers,
      authorithation: token ? `${token}`: "",
    }
  }
});

const splitLink =split(
  ({query})=>{
    const definition = getMainDefinition(query);
    return (
      definition.kind === 'OperationDefinition' && 
      definition.operation === 'subscribtion'
    );
  },
  wsLink(),
  authLink.concat(httpLink)
)

const client = new ApolloClient({
  link: splitLink,
  cache: new InMemoryCache()
});

ReactDOM.render(
  <React.StrictMode>
    <ApolloProvider client={client}>
      <Router>
        <App />
      </Router>
    </ApolloProvider>
  </React.StrictMode>,
  document.getElementById('root')
);
