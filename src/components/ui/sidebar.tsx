"use client";
import { cn } from "../../utils";
import React, { useState, createContext, useContext } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Menu, X } from "lucide-react";
import { useLocation } from "react-router-dom";

interface Links {
  label: string;
  href: string;
  icon: React.JSX.Element | React.ReactNode;
}

interface SidebarContextProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  animate: boolean;
}

const SidebarContext = createContext<SidebarContextProps | undefined>(
  undefined
);

export const useSidebar = () => {
  const context = useContext(SidebarContext);
  if (!context) {
    throw new Error("useSidebar must be used within a SidebarProvider");
  }
  return context;
};

export const SidebarProvider = ({
  children,
  open: openProp,
  setOpen: setOpenProp,
  animate = true,
}: {
  children: React.ReactNode;
  open?: boolean;
  setOpen?: React.Dispatch<React.SetStateAction<boolean>>;
  animate?: boolean;
}) => {
  const [openState, setOpenState] = useState(false);

  const open = openProp !== undefined ? openProp : openState;
  const setOpen = setOpenProp !== undefined ? setOpenProp : setOpenState;

  return (
    <SidebarContext.Provider value={{ open, setOpen, animate }}>
      {children}
    </SidebarContext.Provider>
  );
};

export const Sidebar = ({
  children,
  open,
  setOpen,
  animate,
}: {
  children: React.ReactNode;
  open?: boolean;
  setOpen?: React.Dispatch<React.SetStateAction<boolean>>;
  animate?: boolean;
}) => {
  return (
    <SidebarProvider open={open} setOpen={setOpen} animate={animate}>
      {children}
    </SidebarProvider>
  );
};

export const SidebarBody = (props: React.ComponentProps<typeof motion.div>) => {
  return (
    <>
      <DesktopSidebar {...props} />
      <MobileSidebar {...(props as React.ComponentProps<"div">)} />
    </>
  );
};

export const DesktopSidebar = ({
  className,
  children,
  ...props
}: React.ComponentProps<typeof motion.div>) => {
  const { open, setOpen, animate } = useSidebar();
  return (
    <div className="h-screen flex items-center ml-5 overflow-hidden rounded-2xl relative">
      {/* Toggle button for desktop */}
   
      <motion.div
        className={cn(
          "h-[90%] px-3 py-4 hidden md:flex md:flex-col bg-neutral-100 dark:bg-neutral-800 shrink-0 rounded-2xl",
          className
        )}
        animate={{
          width: animate ? (open ? "280px" : "80px") : "280px",
        }}
        {...props}
      >
        {children}
      </motion.div>
    </div>
  );
};

export const MobileSidebar = ({
  className,
  children,
  ...props
}: React.ComponentProps<"div">) => {
  const { open, setOpen } = useSidebar();
  return (
    <>
      <div
        className={cn(
          "h-10 px-4 py-4 flex flex-row md:hidden items-center justify-between bg-neutral-100 dark:bg-neutral-800 w-full"
        )}
        {...props}
      >
        <div className="h-10 flex justify-start z-20 w-full">
          <Menu
            className="text-neutral-422 dark:text-neutral-200"
            onClick={() => setOpen(!open)}
          />
        </div>
        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ x: "-100%", opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: "-100%", opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className={cn(
                "fixed h-full w-full inset-0 bg-white dark:bg-neutral-900 p-10 z-[100] flex flex-col justify-between",
                className
              )}
            >
              <div
                className="absolute right-10 top-10 z-50 text-neutral-800 dark:text-neutral-200"
                onClick={() => setOpen(!open)}
              >
                <X />
              </div>
              {children}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
};

export const SidebarLink = ({
  link,
  className,
  ...props
}: {
  link: Links;
  className?: string;
}) => {
  const { open, animate } = useSidebar();
  const location = useLocation();
  const pathname = location.pathname;


  const isActive = pathname === link.href;

  return (
    <a
      href={link.href}
      className={cn(
        `flex items-center gap-3 text-balance px-3 py-4 rounded-xl transition-all duration-200 relative group
        ${isActive
          ? "bg-primary/10 text-primary border-l-4 border-primary font-semibold"
          : "text-gray-600 hover:bg-secondary/10 hover:text-primary dark:text-gray-300 dark:hover:bg-gray-800"}
        `,
        open ? "justify-start" : "justify-center",
        className
      )}
      title={!open ? link.label : undefined}
      {...props}
    >
      <div className="flex items-center justify-center duration-300 min-w-10">
        <div className="flex items-center">
          {link.icon}
          {/* Small dot indicator for minimized sidebar */}
          {!open && isActive && (
            <span className="absolute top-1/2 -right-1 w-2 h-2 bg-primary rounded-full transform -translate-y-1/2" />
          )}
        </div>
      </div>
      <motion.span
        animate={{
          opacity: animate ? (open ? 1 : 0) : 1,
          width: animate ? (open ? "auto" : "0px") : "auto",
        }}
        className="overflow-hidden whitespace-nowrap transition-all duration-300 text-xl"
      >
        {link.label}
        {/* Underline animation if expanded */}
        {open && isActive && (
          <span className="absolute animate-underline" />
        )}
      </motion.span>
    </a>
  );
};
