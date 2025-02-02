import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface FloatingEmojiContextType {
    emojiFeedback: Record<string, number>;
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
    const [emojiFeedback, setEmojiFeedback] = useState<Record<string, number>>({
        '😀': 0,
        '🙂': 0,
        '😐': 0,
        '😞': 0,
        '😡': 0,
    });

    useEffect(() => {
        const ws = new WebSocket('ws://localhost:3000'); // Replace with your WebSocket server URL

        ws.onmessage = (event) => {
            const data = JSON.parse(event.data);
            if (data.emojiFeedback) {
                setEmojiFeedback(data.emojiFeedback); // Update emoji feedback counts
            }
        };

        return () => ws.close();
    }, []);

    const triggerEmoji = (emoji: string) => {
        const newEmojis = Array.from({ length: 10 }, (_, index) => ({
            id: Date.now() + index,
            emoji,
        }));

        setFloatingEmojis((prev) => [...prev, ...newEmojis]);

        // Remove emojis after animation (2.5 seconds)
        setTimeout(() => {
            setFloatingEmojis((prev) => prev.filter((item) => !newEmojis.some((e) => e.id === item.id)));
        }, 2500);
    };

    return (
        <FloatingEmojiContext.Provider value={{ emojiFeedback, triggerEmoji }}>
            {children}

            <div
                style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    width: '100vw',
                    height: '100vh',
                    pointerEvents: 'none',
                    overflow: 'hidden',
                    zIndex: 9999,
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
                                delay: Math.random() * 0.5,
                            }}
                            style={{
                                position: 'absolute',
                                bottom: 0,
                                left: `${Math.random() * 80 + 10}%`,
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
