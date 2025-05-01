import React, { useRef, useState } from "react";
import { AnimatePresence, motion, useMotionValue } from "framer-motion";
import { cn } from "../../utils";

export const FollowerPointerCard = ({
  children,
  className,
  title,
}: {
  children: React.ReactNode;
  className?: string;
  title?: string | React.ReactNode;
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const [isInside, setIsInside] = useState<boolean>(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (ref.current) {
      const rect = ref.current.getBoundingClientRect();
      const scrollX = window.scrollX;
      const scrollY = window.scrollY;
      x.set(e.clientX - rect.left + scrollX);
      y.set(e.clientY - rect.top + scrollY);
    }
  };

  return (
    <div
      ref={ref}
      className={cn("relative cursor-none", className)}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsInside(true)}
      onMouseLeave={() => setIsInside(false)}
    >
      {children}
      <AnimatePresence>
        {isInside && <FollowPointer x={x} y={y} title={title} />}
      </AnimatePresence>
    </div>
  );
};

export const FollowPointer = ({
  x,
  y,
  title,
}: {
  x: any;
  y: any;
  title?: string | React.ReactNode;
}) => {
  const colors = [
    "#0ea5e9", "#737373", "#14b8a6", "#22c55e", "#3b82f6", "#ef4444", "#eab308"
  ];

  return (
    <motion.div
      className="absolute z-50 pointer-events-none"
      style={{ top: y, left: x }}
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.8, opacity: 0 }}
    >
      <div className="relative flex flex-col items-center">
        <svg
          className="h-6 w-6 -translate-x-2 -translate-y-2 rotate-[-45deg] text-sky-400"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 16 16"
          fill="currentColor"
        >
          <path d="M14.082 2.182a.5.5 0 0 1 .103.557L8.528 15.467a.5.5 0 0 1-.917-.007L5.57 10.694.803 8.652a.5.5 0 0 1-.006-.916l12.728-5.657a.5.5 0 0 1 .556.103z"/>
        </svg>
        <motion.div
          className="mt-1 px-2 py-1 rounded-md text-xs whitespace-nowrap text-white"
          style={{
            backgroundColor: colors[Math.floor(Math.random() * colors.length)],
          }}
        >
          {title || "Pointer"}
        </motion.div>
      </div>
    </motion.div>
  );
};
