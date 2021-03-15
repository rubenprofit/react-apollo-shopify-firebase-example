import React from 'react';

const CloseIcon = ({ className }) => {
    return (
        <svg
            aria-hidden="true"
            focusable="false"
            role="presentation"
            className={`icon icon-close ${className}`}
            viewBox="0 0 40 40"
        >
            <path
                d="M23.868 20.015L39.117 4.78c1.11-1.108 1.11-2.77 0-3.877-1.109-1.108-2.773-1.108-3.882 0L19.986 16.137 4.737.904C3.628-.204 1.965-.204.856.904c-1.11 1.108-1.11 2.77 0 3.877l15.249 15.234L.855 35.248c-1.108 1.108-1.108 2.77 0 3.877.555.554 1.248.831 1.942.831s1.386-.277 1.94-.83l15.25-15.234 15.248 15.233c.555.554 1.248.831 1.941.831s1.387-.277 1.941-.83c1.11-1.109 1.11-2.77 0-3.878L23.868 20.015z"
                class="layer"
            ></path>
        </svg>
    );
};

export default CloseIcon;
