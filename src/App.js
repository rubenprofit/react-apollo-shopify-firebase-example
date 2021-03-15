import React, { useState, useEffect, useContext } from 'react';
import { useQuery, useMutation } from '@apollo/react-hooks';
import { Switch, Route, withRouter, Redirect } from 'react-router-dom';
import { AuthContext } from './context/AuthProvider';
import Product from './pages/Product';
import CustomerAuthWithMutation from './pages/Auth';
import Profile from './pages/Profile';
// import NotFound from './pages/404';
import Hero from './components/Hero';
import Products from './components/Products';
import Cart from './components/Cart';
import Header from './components/Header';
import Footer from './components/Footer';
import OutsideClickHOC from './components/OutSideClick';
import gql from 'graphql-tag';
import {
    useCheckoutEffect,
    createCheckout,
    checkoutLineItemsAdd,
    checkoutLineItemsUpdate,
    checkoutLineItemsRemove,
    checkoutCustomerAssociate,
} from './checkout';
import Search from './pages/Search';
import Loader from 'react-loader-spinner';
import Cookie from 'js-cookie';

const query = gql`
    query query {
        shop {
            name
            description
            products(first: 30) {
                pageInfo {
                    hasNextPage
                    hasPreviousPage
                }
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
                        variants(first: 250) {
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
                        images(first: 250) {
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
    }
`;

const customerQuery = gql`
    query customerQuery($token: String!) {
        customer(customerAccessToken: $token) {
            firstName
            lastName
            phone
            phone
            displayName
            defaultAddress {
                address1
                address2
                city
                province
                country
            }
            orders(first: 100) {
                edges {
                    node {
                        id
                        name
                        customerUrl
                        orderNumber
                        processedAt
                        subtotalPrice
                        # fulfillmentStatus
                        # financialStatus
                    }
                }
            }
        }
    }
`;

const App = () => {
    const { authenticated, loadingAuthState } = useContext(AuthContext);
    const [isCartOpen, setCartOpen] = useState(false);
    const [value, setValue] = useState('');
    const [
        showAccountVerificationMessage,
        setAccountVerificationMessage,
    ] = useState(false);
    const [checkout, setCheckout] = useState({ lineItems: { edges: [] } });
    const [customerAccessToken, setCustomerAccessToken] = useState(null);
    const [cartCount, setCartCount] = useState(0);
    const [isNewCustomer, setNewCustomer] = useState(true);

    const [createCheckoutMutation, { data: createCheckoutData }] = useMutation(
        createCheckout
    );

    const [lineItemAddMutation, { data: lineItemAddData }] = useMutation(
        checkoutLineItemsAdd
    );

    const [lineItemUpdateMutation, { data: lineItemUpdateData }] = useMutation(
        checkoutLineItemsUpdate
    );

    const [lineItemRemoveMutation, { data: lineItemRemoveData }] = useMutation(
        checkoutLineItemsRemove
    );

    const [
        customerAssociateMutation,
        { data: customerAssociateData },
    ] = useMutation(checkoutCustomerAssociate);

    const { loading: shopLoading, error: shopError, data: shopData } = useQuery(
        query
    );

    const { data: customerData } = useQuery(customerQuery, {
        variables: { token: customerAccessToken },
    });

    useEffect(() => {
        const variables = { input: {} };
        setCustomerAccessToken(Cookie.get('_session_digest'));
        createCheckoutMutation({ variables }).then(
            (res) => {
                return res;
            },
            (err) => {
                return err;
            }
        );
    }, [createCheckoutMutation, customerAccessToken]);

    useCheckoutEffect(createCheckoutData, 'checkoutCreate', setCheckout);
    useCheckoutEffect(lineItemAddData, 'checkoutLineItemsAdd', setCheckout);
    useCheckoutEffect(
        lineItemUpdateData,
        'checkoutLineItemsUpdate',
        setCheckout
    );
    useCheckoutEffect(
        lineItemRemoveData,
        'checkoutLineItemsRemove',
        setCheckout
    );
    useCheckoutEffect(
        customerAssociateData,
        'checkoutCustomerAssociate',
        setCheckout
    );

    const handleCartClose = () => {
        setCartOpen(false);
    };

    const accountVerificationMessage = () => {
        setAccountVerificationMessage(true);
        setTimeout(() => {
            setAccountVerificationMessage(false);
        }, 5000);
    };

    const addVariantToCart = (variantId, quantity, keepClose) => {
        const variables = {
            checkoutId: checkout.id,
            lineItems: [{ variantId, quantity: parseInt(quantity, 10) }],
        };
        // TODO replace for each mutation in the checkout thingy. can we export them from there???
        // create your own custom hook???

        let addLineItem = lineItemAddMutation({ variables }).then((res) => {
            if (keepClose) setCartOpen(false);
            else setCartOpen(true);
            return res;
        });
        setCartCount(cartCount + Number(quantity));
        return addLineItem;
    };

    const updateLineItemInCart = (lineItemId, quantity, operation) => {
        const variables = {
            checkoutId: checkout.id,
            lineItems: [{ id: lineItemId, quantity: parseInt(quantity, 10) }],
        };
        lineItemUpdateMutation({ variables })
            .then((res) => {
                if (res.data.checkoutLineItemsUpdate.checkout) {
                    if (operation === 'increment') setCartCount(cartCount + 1);
                    if (operation === 'decrement') setCartCount(cartCount - 1);
                }
            })
            .catch(() => {
                window.location.reload();
            });
    };

    const removeLineItemInCart = (lineItemId, quantity) => {
        const variables = {
            checkoutId: checkout.id,
            lineItemIds: [lineItemId],
        };
        lineItemRemoveMutation({ variables }).catch(() => {
            window.location.reload();
        });
        setCartCount(cartCount - Number(quantity));
    };

    const associateCustomerCheckout = (customerAccessToken) => {
        const variables = {
            checkoutId: checkout.id,
            customerAccessToken: customerAccessToken,
        };
        customerAssociateMutation({ variables });
    };

    if (shopLoading || loadingAuthState) {
        return (
            <div className="main-loader-wrapper">
                <Loader
                    type="ThreeDots"
                    color="#3a3a3a"
                    height={100}
                    width={100}
                    timeout={3000}
                    className="main-loader"
                />
            </div>
        );
    }

    if (shopError) {
        return <h3>{shopError.message}</h3>;
    }

    return (
        <div className="app">
            <div className="message-wrapper">
                <p
                    className={`message ${
                        showAccountVerificationMessage ? 'message-open' : ''
                    }`}
                >
                    We have sent you an email, please click the link included to
                    verify your email address
                </p>
            </div>
            <Header
                isCartOpen={isCartOpen}
                setCartOpen={setCartOpen}
                value={value}
                setValue={setValue}
                name={shopData.shop.name}
                cartCount={cartCount}
                customerData={customerData}
            />
            <Switch>
                <Route exact path="/">
                    <Hero />
                    <div className="why-us-blurb">
                        <h3 className="why-us-header">Why Lamonti Essentials</h3>
                        <p>Eco-friendly, Eco-conscious and Clean</p>
                        <p>Single EcoWick | 50 Hour Burn Time</p>
                        <p>Wood Wick | 60 Hour Burn Time</p>
                        <p>Custom Virgin Coconut Soy & Beeswax Blend</p>
                        <p>Handmade Curated Scents and Candles</p>
                        <p>Phthalate Free Fragrances Unbleached Lead, Zinc & Metal Free Wicks</p>
                    </div>
                    <div className="products-header">Shop Our Collection</div>
                    <div className="products-wrapper">
                        {shopData.shop.products.edges.map((product) => (
                            <Products
                                addVariantToCart={addVariantToCart}
                                checkout={checkout}
                                key={product.node.id.toString()}
                                product={product.node}
                            />
                        ))}
                    </div>
                </Route>
                <Route path="/auth">
                    <CustomerAuthWithMutation
                        associateCustomerCheckout={associateCustomerCheckout}
                        showAccountVerificationMessage={
                            accountVerificationMessage
                        }
                        isNewCustomer={isNewCustomer}
                        setNewCustomer={setNewCustomer}
                        setCustomerAccessToken={setCustomerAccessToken}
                    />
                </Route>
                <Route path="/product/:title">
                    <div className="product-wrapper">
                        <Product addVariantToCart={addVariantToCart} />
                    </div>
                </Route>
                <Route path="/search">
                    <div className="search-wrapper">
                        <Search />
                    </div>
                </Route>
                {/* <Route>
                    <div className="not-found-wrapper">
                        <NotFound />
                    </div>
                </Route> */}
                {authenticated && customerData ? (
                    <Route path="/profile">
                        <div className="profile-wrapper">
                            <Profile
                                customerData={customerData.customer}
                                setCustomerAccessToken={setCustomerAccessToken}
                            />
                        </div>
                    </Route>
                ) : (
                    <Redirect to="/auth" />
                )}
            </Switch>
            <Footer />
            <OutsideClickHOC
                isCartOpen={isCartOpen}
                handleCartClose={handleCartClose}
            >
                <Cart
                    removeLineItemInCart={removeLineItemInCart}
                    updateLineItemInCart={updateLineItemInCart}
                    checkout={checkout}
                    isCartOpen={isCartOpen}
                    handleCartClose={handleCartClose}
                    customerAccessToken={customerAccessToken}
                />
            </OutsideClickHOC>
        </div>
    );
};

export default withRouter(App);
