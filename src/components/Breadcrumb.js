import React from 'react';
import { Link } from 'react-router-dom';
import { upperFirst } from 'lodash';

const Breadcrumb = ({ pathname }) => {
    let path = pathname.split('/').map((p) => {
        if (p) return `${p.trim()}`;
        else return '/';
    });

    const getUriString = (uri) => {
        return uri
            .split(' ')
            .map((word) => upperFirst(word))
            .join(' ');
    };

    return (
        <div className="breadcrumb-container">
            <span className="breadcrumb">
                {path.map((uri, i) => {
                    if (i === 0) {
                        return (
                            <span key={i} className="breadcrumb-link">
                                <Link className="breadcrumb-uri-base" to="/">
                                    Products
                                </Link>
                            </span>
                        );
                    } else if (i === path.length - 1) {
                        return (
                            <span key={i} className="breadcrumb-link">
                                <span
                                    className="breadcrumb-uri-end"
                                >
                                    {getUriString(uri)}
                                </span>
                            </span>
                        );
                    } else {
                        return null;
                    }
                })}
            </span>
        </div>
    );
};

export default Breadcrumb;
