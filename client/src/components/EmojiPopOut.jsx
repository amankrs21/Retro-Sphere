import PropTypes from 'prop-types';
import { motion } from 'framer-motion';

// Animation Variants
const popOutVariants = {
    initial: { y: 0, opacity: 1, scale: 1 },
    animate: {
        y: -window.innerHeight + 200,
        opacity: 0.8,
        scale: 1.5,
        transition: { duration: 2.0, ease: 'easeOut' },
    },
    exit: { opacity: 0, transition: { duration: 1.0 } },
};

export default function EmojiPopOut({ emoji }) {
    return (
        <motion.div
            style={{
                position: 'fixed',
                bottom: '50px',
                left: '50%',
                transform: 'translateX(-50%)',
                fontSize: '3rem',
                zIndex: 1000,
            }}
            variants={popOutVariants}
            initial="initial"
            animate="animate"
            exit="exit"
        >
            {emoji}
        </motion.div>
    );
}

EmojiPopOut.propTypes = {
    emoji: PropTypes.string.isRequired,
};
