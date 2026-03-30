'use client';

import { useEffect, useState, useRef } from 'react';

interface AnimatedNumberProps {
    value: number;
    duration?: number;
    formatFn?: (value: number) => string;
    className?: string;
}

const AnimatedNumber = ({
    value,
    duration = 1000,
    formatFn = (n) => n.toFixed(2),
    className = ''
}: AnimatedNumberProps) => {
    const [displayValue, setDisplayValue] = useState(value);
    const [isAnimating, setIsAnimating] = useState(false);
    const previousValue = useRef(value);

    useEffect(() => {
        if (previousValue.current === value) return;

        setIsAnimating(true);
        const startValue = previousValue.current;
        const endValue = value;
        const startTime = Date.now();

        const animate = () => {
            const currentTime = Date.now();
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);

            // Easing function (ease-out)
            const easeOut = 1 - Math.pow(1 - progress, 3);

            const currentValue = startValue + (endValue - startValue) * easeOut;
            setDisplayValue(currentValue);

            if (progress < 1) {
                requestAnimationFrame(animate);
            } else {
                setDisplayValue(endValue);
                setIsAnimating(false);
                previousValue.current = endValue;
            }
        };

        requestAnimationFrame(animate);
    }, [value, duration]);

    return (
        <span className={`${className} ${isAnimating ? 'number-flip' : ''}`}>
            {formatFn(displayValue)}
        </span>
    );
};

export default AnimatedNumber;
