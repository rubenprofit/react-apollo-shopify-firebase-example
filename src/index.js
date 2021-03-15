import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { BrowserRouter } from 'react-router-dom';
import { ApolloClient } from 'apollo-client';
import { createHttpLink } from 'apollo-link-http';
import { setContext } from 'apollo-link-context';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { ApolloProvider } from 'react-apollo';
import { AuthProvider } from './context/AuthProvider';
import './app.css';
import 'react-loader-spinner/dist/loader/css/react-spinner-loader.css';

const httpLink = createHttpLink({
    uri: `${process.env.REACT_APP_SHOP_URI}`,
});

const middlewareLink = setContext(() => ({
    headers: {
        'X-Shopify-Storefront-Access-Token': `${process.env.REACT_APP_SHOP_STORE_AT}`,
    },
}));

const client = new ApolloClient({
    link: middlewareLink.concat(httpLink),
    cache: new InMemoryCache(),
});

ReactDOM.render(
    <BrowserRouter>
        <ApolloProvider client={client}>
            <AuthProvider>
                <App />
            </AuthProvider>
        </ApolloProvider>
    </BrowserRouter>,
    document.getElementById('root')
);
