import React, { useEffect } from 'react';
import { motion, useCycle, AnimatePresence } from 'framer-motion';
import CAKE_IMAGE from '../assets/banner.png';
import CAKE_CANDLE from '../assets/cake.jpg';
import CALM_CANDLE from '../assets/calm.jpg';
import DARK_CHOCO_CANDLE from '../assets/dark_choco.jpg';
import SUGAR_COOKIE_CANDLE from '../assets/sugar_cookie.jpg';

const SLIDE_CHANGE_TIME_MS = 3000;
const ANIMATION_DURATION_S = 0.8;
const getVariants = (direction) => ({
    initial: {
        y: direction === 'top' ? '-50%' : '100%',
        opacity: 0,
        transition: { duration: ANIMATION_DURATION_S, ease: 'easeIn' },
    },
    animate: {
        y: 0,
        opacity: 1,
        transition: { duration: ANIMATION_DURATION_S, ease: 'easeIn' },
    },
});
const HAND_POURED = '100% Hand Poured';
const HAND_CRAFTED = '100% Hand Crafted';
const VEGAN = '100% Cruelty Free Vegan';
const TITLE = 'Lamonti Essentials';
const ESSENTIAL_OILS = 'Made with Essential Oils';

const Hero = () => {
    const [currentScene, setCurrentScene] = useCycle(
        HAND_POURED,
        VEGAN,
        HAND_CRAFTED,
        ESSENTIAL_OILS,
        TITLE
    );
    const [backgroundImage, setCurrentBackgroundImage] = useCycle(
        CAKE_IMAGE,
        CAKE_CANDLE,
        CALM_CANDLE,
        DARK_CHOCO_CANDLE,
        SUGAR_COOKIE_CANDLE
    );

    useEffect(() => {
        const timeOut = setTimeout(setCurrentScene, SLIDE_CHANGE_TIME_MS);
        const bgTimeOut = setTimeout(
            setCurrentBackgroundImage,
            SLIDE_CHANGE_TIME_MS
        );
        return () => {
            clearTimeout(timeOut);
            clearTimeout(bgTimeOut);
        };
    }, [
        currentScene,
        setCurrentScene,
        backgroundImage,
        setCurrentBackgroundImage,
    ]);
    return (
        <div
            className="hero"
            style={{
                backgroundImage: `url(${backgroundImage})`,
                transition: "margin-top 3s ease-in"
            }}
        >
            <section className="hero-section">
                <AnimatePresence>
                    <motion.h1
                        className="hero-section-text"
                        key={currentScene}
                        variants={getVariants('top')}
                        initial={'initial'}
                        exit={'initial'}
                        animate={'animate'}
                    >
                        {currentScene}
                    </motion.h1>
                </AnimatePresence>
            </section>
        </div>
    );
};

export default Hero;
