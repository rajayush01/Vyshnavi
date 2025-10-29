import { useEffect } from "react";
import { motion, useAnimation, useMotionValue } from "motion/react";
import { Transition } from "framer-motion";

type HoverBehavior = "slowDown" | "speedUp" | "pause" | "goBonkers" | undefined;

interface CircularTextProps {
  text: string;
  spinDuration?: number;
  onHover?: HoverBehavior;
  className?: string;
}

const getRotationTransition = (
  duration: number,
  from: number,
  loop: boolean = true
): Transition => ({
  ease: "linear",
  duration,
  type: "tween",
  repeat: loop ? Infinity : 0,
});

const getTransition = (duration: number, from: number): {
  rotate: Transition;
  scale: Transition;
} => ({
  rotate: getRotationTransition(duration, from),
  scale: {
    type: "spring",
    damping: 20,
    stiffness: 300,
  },
});

const CircularText: React.FC<CircularTextProps> = ({
  text,
  spinDuration = 20,
  onHover = "speedUp",
  className = "",
}) => {
  const letters = Array.from(text);
  const controls = useAnimation();
  const rotation = useMotionValue(0);

  useEffect(() => {
  const start = rotation.get();
  controls.start({
    rotate: start + 360,
    scale: 1,
    transition: {
      rotate: getRotationTransition(spinDuration, start),
      scale: { type: "spring", damping: 20, stiffness: 300 },
    },
  });
}, [spinDuration, text, onHover, controls, rotation]);


  const handleHoverStart = () => {
  const start = rotation.get();
  if (!onHover) return;

  let transitionConfig;
  let scaleVal = 1;

  switch (onHover) {
    case "slowDown":
      transitionConfig = getTransition(spinDuration * 2, start);
      break;
    case "speedUp":
      transitionConfig = getTransition(spinDuration / 4, start);
      break;
    case "pause":
      controls.stop(); // stop rotation
      controls.start({
        scale: 1,
        transition: { type: "spring", damping: 20, stiffness: 300 },
      });
      return; // ⬅️ exit here so no rotate is applied
    case "goBonkers":
      transitionConfig = getTransition(spinDuration / 20, start);
      scaleVal = 0.8;
      break;
    default:
      transitionConfig = getTransition(spinDuration, start);
  }

  controls.start({
    rotate: start + 360,
    scale: scaleVal,
    transition: transitionConfig,
  });
};


  const handleHoverEnd = () => {
    const start = rotation.get();
    controls.start({
      rotate: start + 360,
      scale: 1,
      transition: getTransition(spinDuration, start),
    });
  };

  return (
    <motion.div
      className={`m-0 mx-auto rounded-full w-[200px] h-[200px] relative text-black font-black text-center cursor-pointer origin-center ${className}`}
      style={{ rotate: rotation }}
      initial={{ rotate: 0 }}
      animate={controls}
      onMouseEnter={handleHoverStart}
      onMouseLeave={handleHoverEnd}
    >
      {letters.map((letter, i) => {
        const rotationDeg = (360 / letters.length) * i;
        const factor = Math.PI / letters.length;
        const x = factor * i;
        const y = factor * i;
        const transform = `rotateZ(${rotationDeg}deg) translate3d(${x}px, ${y}px, 0)`;

        return (
          <span
            key={i}
            className="absolute inline-block inset-0 text-2xl transition-all duration-500 ease-[cubic-bezier(0,0,0,1)]"
            style={{ transform, WebkitTransform: transform }}
          >
            {letter as string}
          </span>
        );
      })}
    </motion.div>
  );
};

export default CircularText;
