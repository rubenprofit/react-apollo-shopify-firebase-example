import React, { useRef, useEffect } from 'react';

/**
 * Hook that closes car when clicks are outside of the passed ref
 */
const useOutsideClick = (ref, isCartOpen, handleCartClose) => {
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                ref.current &&
                !ref.current.contains(event.target) &&
                isCartOpen
            ) {
                handleCartClose();
            }
        }

        // Bind the event listener
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            // Unbind the event listener on clean up
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [ref, isCartOpen, handleCartClose]);
};

/**
 * Component that closes cart if you click outside of it
 */
const OutsideClickHOC = ({ children, isCartOpen, handleCartClose }) => {
    const wrapperRef = useRef(null);
    useOutsideClick(wrapperRef, isCartOpen, handleCartClose);

    return <div ref={wrapperRef}>{children}</div>;
};

export default OutsideClickHOC;
