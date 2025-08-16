import { motion } from "framer-motion";
import logo from "../../assets/Logo.png"
const LoadingScreen = () => {
    return (
        <div className="fixed inset-0 bg-black flex items-center justify-center z-50">
            <motion.div
                initial={{ opacity: 0.5, scale: 0.8 }}
                animate={{ 
                    opacity: [0.5, 1, 0.5],
                    scale: [0.8, 1, 0.8],
                }}
                transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut"
                }}
                className="w-32 h-32 relative"
            >
                <img 
                    src={logo}
                    alt="Loading..." 
                    className="w-full h-full object-contain"
                />
            </motion.div>
        </div>
    );
};

export default LoadingScreen;