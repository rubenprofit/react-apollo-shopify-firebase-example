import React from 'react';
import InstagramIcon from '../assets/instagram.svg';
import PinterestIcon from '../assets/pinterest.svg';
import VisaIcon from '../assets/VisaIcon';
import MasteCardIcon from '../assets/MasterCardIcon';
import AmexIcon from '../assets/AmexIcon';
import PayPalIcon from '../assets/PayPalIcon';
import DiscoverIcon from '../assets/DiscoverIcon';

const Footer = () => {
    // const [email, setEmail] = useState('');
    const icons = [VisaIcon, MasteCardIcon, AmexIcon, PayPalIcon, DiscoverIcon];
    // const handleChange = (e) => {
    //     e.preventDefault();
    //     setEmail(e.target.value);
    // };

    return (
        <footer className="footer">
            <div className="footer-section">
                <div className="footer-left">
                    <p className="footer-big-text">Follow us on social media</p>
                    <p className="footer-small-text">
                        <a href="https://www.instagram.com/lamontiessentials/">
                            <img
                                className="insta-link"
                                src={InstagramIcon}
                                alt="instagram-logo"
                            />
                        </a>
                        <a href="https://www.pinterest.com/LamontiEssentials">
                            <img
                                className="pinterest-link"
                                src={PinterestIcon}
                                alt="pinterest-logo"
                            />
                        </a>
                    </p>
                </div>
                <div className="footer-right">
                    <p className="footer-big-text">Join Our Journey</p>
                    <p className="footer-small-text">
                        Be the first to know about our latest offerings, events,
                        and promotions!
                    </p>
                    <p className="footer-small-text">
                        Newsletter Coming Soon!!
                    </p>
                    {/* <form className="newsletter-form">
                        <input
                            type="email"
                            name="email"
                            id="contact-footer-email"
                            className="newsletter-footer-input"
                            value={email}
                            onChange={handleChange}
                            placeholder="Email address"
                            aria-label="Email address"
                            aria-required="true"
                            required=""
                            autoCorrect="off"
                            autoCapitalize="off"
                        />
                        <span className="input-group__btn">
                            <button
                                type="submit"
                                className="btn newsletter-submit"
                                name="newsletter-submit"
                            >
                                <span className="newsletter_submit-text--large">
                                    Subscribe
                                </span>
                            </button>
                        </span>
                    </form> */}
                </div>
            </div>
            <hr className="footer-divider" />
            <div className="footer-support">
                <div className="footer-bottom-left">
                    <span>
                        <a
                            className="support-number"
                            href="mailto:lamontiessentials@gmail.com"
                        >
                            Contact Us
                        </a>
                        <p>For questions | Product support</p>
                    </span>
                    <ul className="footer-payment-icons">
                        {icons.map((Icon, i) => (
                            <li key={i} className="payment-icon">
                                <Icon className={`icon-${i}`} />
                            </li>
                        ))}
                    </ul>
                </div>
                <div>
                    <p>&#169; {new Date().getFullYear()} Lamonti Candles Co.</p>
                    <p>
                        Built by{' '}
                        <a id="ruben-link" href="https://rubenprofit.nyc">
                            Ruben Profit.
                        </a>
                    </p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
