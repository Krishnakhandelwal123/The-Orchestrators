import { motion } from 'framer-motion';

const FloatingShape = ({size, top, left, delay }) => {
  return (
    <motion.div
      className={`absolute  ${size} pointer-events-none z-0`}
      style={{ top, left }}
      animate={{
        y: ["0%", "100%", "0%"],
        x: ["0%", "100%", "0%"],
        rotate: [0, 360],
      }}
      transition={{
        duration: 20,
        ease: "linear",
        repeat: Infinity,
        delay,
      }}
      aria-hidden="true"
    >
      <svg
        viewBox="0 0 200 200"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full opacity-10"
      >
        <path
          fill="#4ade80" 
          d="M42.3,-53.3C57.4,-45.2,74.1,-35.4,78.2,-21.6C82.3,-7.9,73.8,10,63.7,23.6C53.7,37.2,42,46.4,29.2,55.6C16.5,64.9,2.7,74.2,-10.9,77.1C-24.4,80.1,-38.9,76.8,-47.5,66.6C-56.2,56.4,-59,39.3,-60.2,24.1C-61.4,8.9,-61,-4.4,-56.6,-17.4C-52.2,-30.4,-43.8,-43.1,-32.1,-51.6C-20.4,-60.1,-10.2,-64.3,2.2,-67C14.5,-69.7,29.1,-70.6,42.3,-53.3Z"
          transform="translate(100 100)"
        />
      </svg>
    </motion.div>
  );
};

export default FloatingShape;
