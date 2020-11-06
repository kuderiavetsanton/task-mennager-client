import React from 'react'
import { ApolloClient, InMemoryCache,ApolloProvider as ApolloContainer, createHttpLink } from '@apollo/client';

import { setContext } from '@apollo/client/link/context'

const httpLink = createHttpLink({
    uri: 'https://salty-tor-95124.herokuapp.com/',
  });

const authLink = setContext((_, { headers }) => {
    const token = localStorage.getItem('token')

    return {
        headers: {
          ...headers,
          authorization: token ? `Bearer ${token}` : "",
        }
      }
})

const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache()
});

export default function ApolloProvider({ children }) {
    return (
        <ApolloContainer client={client}>
            { children }
        </ApolloContainer>
    )
}
