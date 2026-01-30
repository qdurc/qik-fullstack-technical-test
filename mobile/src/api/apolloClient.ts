import {ApolloClient, InMemoryCache, createHttpLink} from '@apollo/client';
import {setContext} from '@apollo/client/link/context';
import {Platform} from 'react-native';

const IOS_URL = 'http://localhost:3000/graphql';
const ANDROID_URL = 'http://10.0.2.2:3000/graphql';

const GRAPHQL_BASE_URL = Platform.select({
  ios: IOS_URL,
  android: ANDROID_URL,
  default: IOS_URL,
});

export const createApolloClient = (token?: string) => {
  const httpLink = createHttpLink({
    uri: GRAPHQL_BASE_URL,
  });

  const authLink = setContext((_, {headers}) => ({
    headers: {
      ...headers,
      ...(token ? {Authorization: `Bearer ${token}`} : {}),
    },
  }));

  return new ApolloClient({
    link: authLink.concat(httpLink),
    cache: new InMemoryCache(),
  });
};

export const graphqlConfig = {
  baseUrl: GRAPHQL_BASE_URL,
};
