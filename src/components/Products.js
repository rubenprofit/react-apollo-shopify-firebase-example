import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import VariantSelector from './VariantSelector';

const Products = (props) => {
    let defaultOptionValues = {};

    props.product.options.forEach((selector) => {
        defaultOptionValues[selector.name] = selector.values[0];
    });
    /* eslint-disable no-unused-vars */
    const [selectedOptions, setSelectedOptions] = useState(defaultOptionValues);
    const [variantImage, setVariantImage] = useState(
        props.product.images.edges[0].node
    );
    const [variant, setVariant] = useState(
        props.product.variants.edges[0].node
    );
    const [variantQuantity, setVariantQuantity] = useState(1);

    // const findImage = (images, variantId) => {
    //     const primary = images[0];

    //     const image = images.filter((image) => {
    //         return image.variant_ids.includes(variantId);
    //     })[0];

    //     return (image || primary).src;
    // };

    const handleOptionChange = (event) => {
        const target = event.target;
        selectedOptions[target.name] = target.value;

        const selectedVariant = props.product.variants.edges.find((variant) => {
            return variant.node.selectedOptions.every((selectedOption) => {
                return (
                    selectedOptions[selectedOption.name] ===
                    selectedOption.value
                );
            });
        }).node;

        setVariant(selectedVariant);
        setVariantImage(selectedVariant.image);
    };

    const handleQuantityChange = (event) => {
        setVariantQuantity(event.target.value);
    };

    let variantSelectors = props.product.options.map((option) => {
        return (
            <VariantSelector
                handleOptionChange={handleOptionChange}
                key={option.id.toString()}
                option={option}
            />
        );
    });

    return (
        <div className="products">
            {props.product.images.edges.length ? (
                <div className="products-image-container">
                    <Link
                        className="products-link"
                        to={{
                            pathname: `/product/${props.product.title.toLowerCase()}`,
                            state: {
                                product: props.product,
                            },
                        }}
                    >
                        <img
                            className="products-image"
                            src={variantImage.src}
                            alt={`${props.product.title} product shot`}
                        />
                        <div className="products-image-overlay">
                            <div className="products-image-overlay-text">
                                <div className="products-image-overlay-description">
                                    {props.product.description.split('.', 1)[0]}.
                                </div>
                            </div>
                        </div>
                    </Link>
                </div>
            ) : null}
            <h5 className="products-title">
                <Link
                    className="products-link"
                    to={{
                        pathname: `/product/${props.product.title.toLowerCase()}`,
                        state: {
                            product: props.product,
                        },
                    }}
                >
                    {props.product.title}
                </Link>
            </h5>
            <span className="products-price">${variant.price}</span>
            {props.product.options.length > 1 ? variantSelectors : null}
            {props.addVariantToCart ? (
                <label className="products-option">
                    <p className="products-quantity-text">Quantity: </p>
                    <input
                        min="1"
                        type="number"
                        className="products-quantity-select"
                        defaultValue={variantQuantity}
                        onChange={handleQuantityChange}
                    ></input>
                </label>
            ) : null}
            {props.addVariantToCart ? (
                <button
                    className="products-buy button"
                    onClick={() =>
                        props.addVariantToCart(variant.id, variantQuantity)
                    }
                >
                    Add to Cart
                </button>
            ) : null}
        </div>
    );
};

export default Products;
