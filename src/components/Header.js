import React from 'react';
import { Link, useHistory } from 'react-router-dom';
import Logo from '../assets/logo.png';
import BagIcon from '../assets/BagIcon.js';
import UserIcon from '../assets/UserIcon.js';
import SearchIcon from '../assets/SearchIcon.js';

const Header = ({
    isCartOpen,
    setCartOpen,
    value,
    setValue,
    cartCount,
    customerData
}) => {
    const history = useHistory();

    const handleSearch = (e) => {
        e.preventDefault();
        setValue('');
        history.push({
            pathname: '/search',
            search: `?q=${value}`,
        });
    };
    const handleChange = (e) => {
        e.preventDefault();
        setValue(e.target.value);
    };

    return (
        <header className="header">
            <div className="title">
                <Link className="store-name" to="/">
                    <img className="logo" alt="lamonti-logo" src={Logo} />
                </Link>
            </div>
            <div className="header-left">
                <form className="search-form">
                    <div className="search-bar">
                        <input
                            className="search-input"
                            type="text"
                            placeholder="Search"
                            name="Search"
                            value={value}
                            onChange={handleChange}
                        />
                        <button
                            className="search-submit"
                            onClick={handleSearch}
                        >
                            <SearchIcon
                                className="search-icon"
                                color={'#3a3a3a'}
                            />
                        </button>
                    </div>
                </form>
                <div className="nav">
                    <div className="login customer-actions">
                        {customerData ? (
                            <Link className="login-link" to="/profile">
                                <UserIcon className="user-icon" />
                            </Link>
                        ) : (
                            <Link className="login-link" to="/auth">
                                <UserIcon className="user-icon" />
                            </Link>
                        )}
                    </div>
                </div>
                {!isCartOpen && (
                    <div className="view-cart-wrapper">
                        <button
                            className="view-cart"
                            onClick={() => setCartOpen(true)}
                        >
                            <BagIcon className="bag-icon" />
                            {cartCount ? (
                                <div className="cart-count-icon">
                                    <span className="cart-count">
                                        {cartCount}
                                    </span>
                                </div>
                            ) : null}
                        </button>
                    </div>
                )}
            </div>
        </header>
    );
};

export default Header;
