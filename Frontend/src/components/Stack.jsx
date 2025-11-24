// Stack.jsx

// 1. motion-specific imports MUST come from "motion/react"
import { motion, useMotionValue, useTransform } from "motion/react";
// 2. React Hooks (useState, useEffect) MUST come from "react"
import { useState, useEffect } from "react";

import "./Stack.css";

// Simplified CardRotate (Focus is on Stack's positioning logic)
function CardRotate({ children, isFront }) {
    // Note: useMotionValue/useTransform/handleDragEnd are removed here 
    // because we are using a fixed horizontal carousel driven by buttons, 
    // matching the screenshot's navigation style.

    return (
        <motion.div
            className="card-rotate"
            // zIndex is crucial to ensure the front card is always on top
            style={{ zIndex: isFront ? 10 : 1 }}
        >
            {children}
        </motion.div>
    );
}

// --- MAIN STACK COMPONENT ---
export default function Stack({
    // Adjusted dimensions to match the reference image's wide/short aspect ratio
    cardDimensions = { width: 550, height: 320 },
    cardsData = [
        // Dummy data for testing if no prop is provided
        { id: 1, tag: "MENTORSHIP", title: "Industry Experts", description: "Learn directly from seasoned professionals.", img: "https://via.placeholder.com/550x200/1e40af/FFFFFF?text=Lesson+1" },
        { id: 2, tag: "EXPERIENCE", title: "10+ Years History", description: "Trusted curriculum built over a decade of success.", img: "https://via.placeholder.com/550x200/047857/FFFFFF?text=Lesson+2" },
        { id: 3, tag: "PRACTICE", title: "1-1 Doubt Sessions", description: "Personalized attention to clear all your concepts.", img: "https://via.placeholder.com/550x200/b45309/FFFFFF?text=Lesson+3" },
        { id: 4, tag: "ENGAGEMENT", title: "100% Practical", description: "Hands-on projects and real-world simulations.", img: "https://via.placeholder.com/550x200/9d174d/FFFFFF?text=Lesson+4" },
    ],
    animationConfig = { stiffness: 180, damping: 20 },
}) {

    const [cards] = useState(cardsData);
    const [currentIndex, setCurrentIndex] = useState(0);

    const nextCard = () => {
        // Increment index, looping back to 0
        setCurrentIndex(prev => (prev + 1) % cards.length);
    };

    const prevCard = () => {
        // Decrement index, looping back to the last index if below 0
        setCurrentIndex(prev => (prev - 1 + cards.length) % cards.length);
    };

    // Keyboard support
    useEffect(() => {
        const handleKey = (e) => {
            if (e.key === "ArrowRight") nextCard();
            if (e.key === "ArrowLeft") prevCard();
        };
        window.addEventListener("keydown", handleKey);
        return () => window.removeEventListener("keydown", handleKey);
    }, [cards.length]);

    if (cards.length === 0) {
        return <div className="p-8 text-center rounded-xl bg-gray-800 border border-gray-700 shadow-xl text-white">No content to display.</div>;
    }

    // --- Render Stack and Controls ---
    return (
        <div className="flex flex-col items-center justify-center pt-10">

            <h2 className="main-heading">
                Why <span style={{ color: '#4dc0b5' }}>FireFlooks?</span>
            </h2>
            <p className="sub-heading">
                We don't just teach technology. We ignite careers.
            </p>

            <div className="flex items-center justify-center w-full max-w-7xl">

                {/* PREV BUTTON */}
                <button
                    onClick={prevCard}
                    className="nav-button"
                    aria-label="Previous Feature"
                >
                    &lt;
                </button>

                {/* STACK CONTAINER (The 3D Carousel) */}
                <div
                    className="stack-container"
                    style={{
                        width: cardDimensions.width,
                        height: cardDimensions.height,
                        perspective: 1200,
                    }}
                >
                    {cards.map((card, index) => {

                        let distance = index - currentIndex;

                        // Handle looping/wrap-around
                        if (distance > cards.length / 2) distance -= cards.length;
                        if (distance < -cards.length / 2) distance += cards.length;

                        const isFront = distance === 0;

                        // Calculation for 3D positioning and scaling
                        const translateX = distance * cardDimensions.width * 0.55;
                        const scale = 1 - Math.abs(distance) * 0.1;
                        const opacity = 1 - Math.abs(distance) * 0.35;

                        return (
                            <CardRotate
                                key={card.id}
                                isFront={isFront}
                            >
                                <motion.div
                                    className="card"
                                    onClick={() => !isFront && setCurrentIndex(index)}
                                    animate={{
                                        x: translateX,
                                        scale: scale,
                                        opacity: opacity,
                                        rotateY: distance * -3,
                                        z: distance * -40
                                    }}
                                    transition={{
                                        type: "spring",
                                        stiffness: animationConfig.stiffness,
                                        damping: animationConfig.damping,
                                        mass: 0.9
                                    }}
                                    style={{
                                        width: cardDimensions.width,
                                        height: cardDimensions.height,
                                        pointerEvents: isFront ? 'auto' : 'none',
                                        boxShadow: isFront ? '0 0 30px rgba(0, 180, 255, 0.6), inset 0 0 15px rgba(0, 180, 255, 0.3)' : '0 0 5px rgba(0,0,0,0.5)',
                                        border: isFront ? '1px solid #00BFFF' : '1px solid rgba(255, 255, 255, 0.1)'
                                    }}
                                >
                                    {/* Tag on top center */}
                                    {isFront && (
                                        <div className="card-tag">
                                            {card.tag || 'Key Feature'}
                                        </div>
                                    )}
                                    <img
                                        src={card.img}
                                        alt={`card-${card.id}`}
                                        className="card-image"
                                    />
                                    {/* Placeholder for the smaller feature boxes seen in the screenshot */}
                                    <div className="card-content">
                                        <div style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>{card.title}</div>
                                        <div style={{ fontSize: '0.9rem', color: '#a0aec0' }}>{card.description}</div>
                                    </div>
                                </motion.div>
                            </CardRotate>
                        );
                    })}
                </div>

                {/* NEXT BUTTON */}
                <button
                    onClick={nextCard}
                    className="nav-button"
                    aria-label="Next Feature"
                >
                    &gt;
                </button>
            </div>

        </div>
    );
}
