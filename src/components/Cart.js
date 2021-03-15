import React from 'react';
import LineItem from './LineItem';

const Cart = (props) => {
    const openCheckout = () => {
        window.open(props.checkout.webUrl);
    };

    let line_items = props.checkout.lineItems.edges.map((line_item) => {
        return (
            <LineItem
                removeLineItemInCart={props.removeLineItemInCart}
                updateLineItemInCart={props.updateLineItemInCart}
                key={line_item.node.id.toString()}
                line_item={line_item.node}
            />
        );
    });

    return (
        <div className={`cart ${props.isCartOpen ? 'cart-open' : ''}`}>
            <header className="cart-header">
                <h2>Your cart</h2>
                <button onClick={props.handleCartClose} className="cart-close">
                    ×
                </button>
            </header>
            {line_items.length ? (
                <ul className="cart-line-items">{line_items}</ul>
            ) : (
                <div className="cart-line-items">
                    <p className="cart-empty">Cart is currently empty</p>
                </div>
            )}
            <footer className="cart-footer">
                <div className="cart-info clearfix">
                    <div className="cart-info-total cart-info-small">
                        Subtotal
                    </div>
                    <div className="cart-info-pricing">
                        <span className="pricing">
                            $ {props.checkout.subtotalPrice}
                        </span>
                    </div>
                </div>
                <div className="cart-info clearfix">
                    <div className="cart-info-total cart-info-small">Taxes</div>
                    <div className="cart-info-pricing">
                        <span className="pricing">
                            $ {props.checkout.totalTax}
                        </span>
                    </div>
                </div>
                <div className="cart-info clearfix">
                    <div className="cart-info-total cart-info-small">Total</div>
                    <div className="cart-info-pricing">
                        <span className="pricing">
                            $ {props.checkout.totalPrice}
                        </span>
                    </div>
                </div>
                <button className="cart-checkout button" onClick={openCheckout}>
                    Checkout
                </button>
            </footer>
        </div>
    );
}

export default Cart;
