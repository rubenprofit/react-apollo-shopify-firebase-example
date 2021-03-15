import React from 'react';

const LineItem = (props) => {
    const decrementQuantity = (lineItemId, operation) => {
        const updatedQuantity = props.line_item.quantity - 1;
        props.updateLineItemInCart(lineItemId, updatedQuantity, operation);
    };

    const incrementQuantity = (lineItemId, operation) => {
        const updatedQuantity = props.line_item.quantity + 1;
        props.updateLineItemInCart(lineItemId, updatedQuantity, operation);
    };

    return (
        <li className="line-item">
            <div className="line-item-img">
                {props.line_item.variant.image ? (
                    <img
                        src={props.line_item.variant.image.src}
                        alt={`${props.line_item.title} product shot`}
                    />
                ) : null}
            </div>
            <div className="line-item-content">
                <div className="line-item-content-row">
                    <div className="line-item-variant-title">
                        {props.line_item.variant.title}
                    </div>
                    <span className="line-item-title">
                        {props.line_item.title}
                    </span>
                </div>
                <div className="line-item-content-row">
                    <div className="line-item-quantity-container">
                        <button
                            className="line-item-quantity-update"
                            onClick={() =>
                                decrementQuantity(
                                    props.line_item.id,
                                    'decrement'
                                )
                            }
                        >
                            -
                        </button>
                        <span className="line-item-quantity">
                            {props.line_item.quantity}
                        </span>
                        <button
                            className="line-item-quantity-update"
                            onClick={() =>
                                incrementQuantity(
                                    props.line_item.id,
                                    'increment'
                                )
                            }
                        >
                            +
                        </button>
                    </div>
                    <span className="line-item-price">
                        ${' '}
                        {(
                            props.line_item.quantity *
                            props.line_item.variant.price
                        ).toFixed(2)}
                    </span>
                    <button
                        className="line-item-remove"
                        onClick={() =>
                            props.removeLineItemInCart(
                                props.line_item.id,
                                props.line_item.quantity
                            )
                        }
                    >
                        ×
                    </button>
                </div>
            </div>
        </li>
    );
};

export default LineItem;
