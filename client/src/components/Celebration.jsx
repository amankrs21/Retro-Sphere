import { DotLottieReact } from "@lottiefiles/dotlottie-react";

export default function Celebration() {
    const animationStyles = {
        top: "50%",
        left: "50%",
        zIndex: 1000,
        width: '100vw',
        height: '100vh',
        position: "fixed",
        pointerEvents: "none",
        transform: "translate(-50%, -50%)",
    };

    return (
        <div style={animationStyles}>
            <DotLottieReact
                src="/EmojiReaction.json"
                loop
                autoplay
                sx={{ width: "100%", height: "100%" }}
            />
        </div>
    );
}
