import React from 'react';
import { useHistory } from 'react-router-dom';

const NotFound = () => {
    const history = useHistory();
    return (
        <div>
            <h1 className="not-found-header">404</h1>
            <h3 className="not-found-text">Page Not Found</h3>
            <div className="not-found-button-container">
                <button
                    className="not-found-button btn"
                    onClick={() => history.push('/')}
                >
                    Go to homepage
                </button>
            </div>
        </div>
    );
};

export default NotFound;
