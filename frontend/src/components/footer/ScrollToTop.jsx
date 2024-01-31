// import libraries from react
import { useState, useEffect } from "react";
// import libraries from react-icons
import { FaAngleDoubleUp } from "react-icons/fa";
// import css
import '../../assets/css/ScrollToTop.css';

const ScrollToTop = () => {
        const [showScrollTopButton, setShowScrollTopButton] = useState(false);

        useEffect(() => {
                window.addEventListener("scroll", () => {
                        // scrollY = the number of pixels that the document is currently scrolled vertically
                        if (window.scrollY > 100) {
                                setShowScrollTopButton(true);
                        } else {
                                setShowScrollTopButton(false);
                        }
                });
        }, []);

        const scrollTop = () => {
                // scrollTo = scrolls the document to right location
                window.scrollTo({
                        top: 0,
                        behavior: "smooth",
                });
        };

        return (
                <div>
                        {showScrollTopButton && (
                                <FaAngleDoubleUp
                                        className="btn-position btn-style"
                                        onClick={scrollTop}
                                />
                        )}
                </div>
        );
};

export default ScrollToTop;