import React, { createContext, useContext, useState, ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface FloatingEmojiContextType {
    triggerEmoji: (emoji: string) => void;
}

const FloatingEmojiContext = createContext<FloatingEmojiContextType | undefined>(undefined);

export const useFloatingEmoji = () => {
    const context = useContext(FloatingEmojiContext);
    if (!context) {
        throw new Error('useFloatingEmoji must be used within FloatingEmojiProvider');
    }
    return context;
};

export const FloatingEmojiProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [floatingEmojis, setFloatingEmojis] = useState<{ id: number; emoji: string }[]>([]);

    const triggerEmoji = (emoji: string) => {
        const newEmojis = Array.from({ length: 10 }, (_, index) => ({
            id: Date.now() + index, // Unique ID for each emoji
            emoji,
        }));

        setFloatingEmojis((prev) => [...prev, ...newEmojis]);

        // Remove emojis after animation (2.5 seconds)
        setTimeout(() => {
            setFloatingEmojis((prev) => prev.filter((item) => !newEmojis.some((e) => e.id === item.id)));
        }, 2500);
    };

    return (
        <FloatingEmojiContext.Provider value={{ triggerEmoji }}>
            {children}

            {/* Fixed container for floating emojis */}
            <div
                style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    width: '100vw',
                    height: '100vh',
                    pointerEvents: 'none', // Prevent interaction with the animation layer
                    overflow: 'hidden', // Ensure emojis don't extend outside the screen
                    zIndex: 9999, // Ensure this layer is above all other elements
                }}
            >
                <AnimatePresence>
                    {floatingEmojis.map(({ id, emoji }) => (
                        <motion.div
                            key={id}
                            initial={{ y: '100%', opacity: 0 }}
                            animate={{ y: '-600%', opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{
                                duration: 3,
                                ease: 'easeInOut',
                                delay: Math.random() * 0.5, // Random delay for staggered effect
                            }}
                            style={{
                                position: 'absolute',
                                bottom: 0,
                                left: `${Math.random() * 80 + 10}%`, // Random horizontal position
                                fontSize: '3rem',
                                pointerEvents: 'none',
                            }}
                        >
                            {emoji}
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>
        </FloatingEmojiContext.Provider>
    );
};
