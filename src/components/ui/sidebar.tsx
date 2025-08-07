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
    <div className="h-screen flex items-center ml-5 overflow-hidden">
      <motion.div
        className={cn(
          "h-full px-4 py-6 hidden md:flex md:flex-col bg-white border-r border-slate-200 shrink-0 shadow-lg",
          className
        )}
        animate={{
          width: animate ? (open ? "280px" : "80px") : "280px",
        }}
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
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
          "h-10 px-4 py-4 flex flex-row md:hidden items-center justify-between bg-white border-b border-slate-200 w-full"
        )}
        {...props}
      >
        <div className="flex justify-start z-20 w-full">
          <Menu
            className="text-slate-700"
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
                "fixed h-full w-full inset-0 bg-white p-10 z-[100] flex flex-col justify-between shadow-2xl",
                className
              )}
            >
              <div
                className="absolute right-10 top-10 z-50 text-slate-700"
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
        `flex items-center gap-3 text-balance px-4 py-3 rounded-lg transition-all duration-200 relative group font-medium
        ${isActive
          ? "bg-blue-50 text-blue-600 border-r-3 border-blue-600 shadow-sm"
          : "text-slate-600 hover:bg-slate-50 hover:text-blue-600"}
        `,
        open ? "justify-start" : "justify-center",
        className
      )}
      title={!open ? link.label : undefined}
      {...props}
    >
      <div className="flex items-center justify-center duration-300 min-w-6">
        <div className="flex items-center">
          {link.icon}
          {/* Small dot indicator for minimized sidebar */}
          {!open && isActive && (
            <span className="absolute top-1/2 -right-1 w-2 h-2 bg-blue-600 rounded-full transform -translate-y-1/2" />
          )}
        </div>
      </div>
      <motion.span
        animate={{
          opacity: animate ? (open ? 1 : 0) : 1,
          width: animate ? (open ? "auto" : "0px") : "auto",
        }}
        className="overflow-hidden whitespace-nowrap transition-all duration-300 text-base"
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
