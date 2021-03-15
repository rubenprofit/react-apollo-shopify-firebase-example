import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import Breadcrumb from '../components/Breadcrumb';
import VariantSelector from '../components/VariantSelector';

const Product = ({ addVariantToCart }) => {
    let defaultOptionValues = {};
    const location = useLocation();
    const [backgroundPosition, setBackgroundPosition] = useState('0% 0%');
    const [figureImage, setFigureImage] = useState(
        location.state.product.images.edges[0].node.src
    );
    const [selected, setSelected] = useState(0);
    const [selectedOptions, setSelectedOptions] = useState(defaultOptionValues);
    const [variant, setVariant] = useState(
        location.state.product.variants.edges[0].node
    );
    const [variantImage, setVariantImage] = useState(
        location.state.product.images.edges[0].node
    );

    location.state.product.options.forEach((selector) => {
        defaultOptionValues[selector.name] = selector.values[0];
    });
    const openCheckout = async () => {
        let cartLineItem = await addToCart();
        let checkoutUrl =
            cartLineItem.data.checkoutLineItemsAdd.checkout.webUrl;
        if (checkoutUrl) {
            window.open(checkoutUrl);
        }
    };

    const addToCart = () => {
        return Promise.resolve(
            addVariantToCart(
                location.state.product.variants.edges[0].node.id,
                1,
                true
            )
        );
    };

    const handleMouseMove = (e) => {
        const { left, top, width, height } = e.target.getBoundingClientRect();
        const x = ((e.pageX - left) / width) * 100;
        const y = ((e.pageY - top) / height) * 100;
        setBackgroundPosition(`${x}% ${y}%`);
    };

    const handleFigureChange = (index) => {
        setFigureImage(location.state.product.images.edges[index].node.src);
        setSelected(index);
    };

    const handleOptionChange = (event) => {
        const target = event.target;
        selectedOptions[target.name] = target.value;
        const selectedVariant = location.state.product.variants.edges.find(
            (variant) => {
                return variant.node.selectedOptions.every((selectedOption) => {
                    return (
                        selectedOptions[selectedOption.name] ===
                        selectedOption.value
                    );
                });
            }
        );

        setVariant(selectedVariant);
        setVariantImage(selectedVariant.image);
    };

    let variantSelectors = location.state.product.options.map((option) => {
        return (
            <VariantSelector
                handleOptionChange={handleOptionChange}
                key={option.id.toString()}
                option={option}
            />
        );
    });

    return (
        <div className="product">
            <Breadcrumb pathname={location.pathname} />
            <main className="product-main">
                <div className="product-content left">
                    <figure
                        onMouseMove={handleMouseMove}
                        style={{
                            backgroundImage: `url(
                                ${figureImage}
                            )`,
                            backgroundPosition,
                        }}
                    >
                        <img
                            role="presentation"
                            className="product-media"
                            src={`${figureImage}`}
                            alt={`${location.state.product.title.toLowerCase()}`}
                        />
                    </figure>
                    {location.state.product.images.edges.length > 1 ? (
                        <div>
                            <ul className="product-thumbnails">
                                {location.state.product.images.edges.map(
                                    (image, i) => {
                                        return (
                                            <li
                                                key={i}
                                                className={`${
                                                    i === selected
                                                        ? 'product-thumbnail-selected'
                                                        : null
                                                } product-thumbnail`}
                                                onClick={() =>
                                                    handleFigureChange(i)
                                                }
                                            >
                                                <img
                                                    src={`${image.node.src}`}
                                                    alt={`${location.state.product.title.toLowerCase()}`}
                                                />
                                            </li>
                                        );
                                    }
                                )}
                            </ul>
                        </div>
                    ) : null}
                </div>
                <div className="product-content right">
                    <div className="product-single">
                        <h1 className="product-title">
                            {location.state.product.title}
                        </h1>
                        <dl className="product-price">
                            {`$${location.state.product.variants.edges[0].node.price}`}
                        </dl>
                        {location.state.product.options.length > 1
                            ? variantSelectors
                            : null}
                        <div className="product-checkout">
                            <button
                                className="btn product-add-button"
                                onClick={() =>
                                    addVariantToCart(
                                        location.state.product.variants.edges[0]
                                            .node.id,
                                        1
                                    )
                                }
                            >
                                <span>Add to cart</span>
                            </button>
                            <button
                                className="btn product-buy-button"
                                onClick={openCheckout}
                            >
                                <span>Buy it now</span>
                            </button>
                        </div>
                        <div className="product-description">
                            {location.state.product.description}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Product;
