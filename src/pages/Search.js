import React, { useState } from 'react';
import { useLocation, useHistory } from 'react-router-dom';
import { useQuery } from '@apollo/react-hooks';
import gql from 'graphql-tag';
import qs from 'qs';
import Loader from 'react-loader-spinner';
import SearchIcon from '../assets/SearchIcon.js';
import Products from '../components/Products';

const Search = () => {
    const location = useLocation();
    const history = useHistory();
    const q = qs.parse(location.search, { ignoreQueryPrefix: true });
    const [value, setValue] = useState('');
    const query = gql`
        query query {
            products(query: "title:*${q.q}*", first: 20) {
                edges {
                    node {
                        id
                        title
                        description
                        options {
                            id
                            name
                            values
                        }
                        variants(first: 20) {
                            pageInfo {
                                hasNextPage
                                hasPreviousPage
                            }
                            edges {
                                node {
                                    id
                                    title
                                    selectedOptions {
                                        name
                                        value
                                    }
                                    image {
                                        src
                                    }
                                    price
                                }
                            }
                        }
                        images(first: 20) {
                            pageInfo {
                                hasNextPage
                                hasPreviousPage
                            }
                            edges {
                                node {
                                    src
                                }
                            }
                        }
                    }
                }
            }
        }
    `;

    const {
        loading: productLoading,
        error: productError,
        data: productData,
    } = useQuery(query);

    const handleSubmit = (e) => {
        e.preventDefault();
        history.push({
            pathname: '/search',
            search: `?q=${value}`,
        });
    };

    if (productLoading) {
        return (
            <div className="search-loader-wrapper">
                <Loader
                    type="ThreeDots"
                    color="#3a3a3a"
                    height={100}
                    width={100}
                    timeout={3000}
                    className="search-loader"
                />
            </div>
        );
    }

    return (
        <div className="search">
            <header className="search-header">
                <h1 className="search-title">Find the perfect scent</h1>
            </header>
            <form className="search-page-form" onSubmit={handleSubmit}>
                <input
                    className="search-page-input"
                    type="text"
                    placeholder={q.q ? q.q : 'Search our store'}
                    onChange={(e) => setValue(e.target.value)}
                />
                <button className="search-form-button" onClick={handleSubmit}>
                    <SearchIcon className="search-page-icon" color="#ffffff" />
                </button>
            </form>
            <hr className="search-divider" />
            {productError ? (
                <h3 className="search-error">
                    Oops, something went wrong. Please try your search again.
                </h3>
            ) : null}
            {productData.products.edges.length ? (
                <div className="search-results-wrapper">
                    {productData.products.edges.map((product) => (
                        <Products
                            key={product.node.id.toString()}
                            product={product.node}
                        />
                    ))}
                </div>
            ) : (
                <h3 className="search-no-results">
                    {`Could not find any products containing "${q.q}"`}
                </h3>
            )}
        </div>
    );
};

export default Search;
