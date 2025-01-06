import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { ChevronLeft } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent } from "@/components/ui/sheet"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { useSidebar } from "./sidebar-context"

export const Sidebar = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div">
>(({ className, children, ...props }, ref) => {
  const { isMobile, state, openMobile, setOpenMobile } = useSidebar()

  if (isMobile) {
    return (
      <Sheet open={openMobile} onOpenChange={setOpenMobile}>
        <SheetContent
          side="left"
          className="w-[280px] p-0"
        >
          <div className="h-full flex flex-col">
            {children}
          </div>
        </SheetContent>
      </Sheet>
    )
  }

  return (
    <div
      ref={ref}
      data-state={state}
      className={cn(
        "relative flex h-screen w-[var(--sidebar-width)] flex-col overflow-hidden bg-white transition-all duration-300",
        state === "collapsed" && "w-[var(--sidebar-width-icon)]",
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
})
Sidebar.displayName = "Sidebar"

export const SidebarTrigger = React.forwardRef<
  React.ElementRef<typeof Button>,
  React.ComponentProps<typeof Button>
>(({ className, onClick, children, ...props }, ref) => {
  const { toggleSidebar, state } = useSidebar()

  return (
    <Button
      ref={ref}
      variant="ghost"
      size="icon"
      className={cn(
        "h-8 w-8 transition-transform",
        state === "collapsed" && "rotate-180",
        className
      )}
      onClick={(event) => {
        onClick?.(event)
        toggleSidebar()
      }}
      {...props}
    >
      {children || <ChevronLeft className="h-4 w-4" />}
    </Button>
  )
})
SidebarTrigger.displayName = "SidebarTrigger"

export const SidebarHeader = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div">
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center p-4", className)}
    {...props}
  />
))
SidebarHeader.displayName = "SidebarHeader"

export const SidebarContent = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div">
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex-1 overflow-auto", className)}
    {...props}
  />
))
SidebarContent.displayName = "SidebarContent"

export const SidebarMenu = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div">
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("space-y-1 p-2", className)}
    {...props}
  />
))
SidebarMenu.displayName = "SidebarMenu"

export const SidebarMenuItem = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div">
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("", className)}
    {...props}
  />
))
SidebarMenuItem.displayName = "SidebarMenuItem"

export const SidebarMenuButton = React.forwardRef<
  HTMLButtonElement,
  React.ComponentProps<"button"> & {
    asChild?: boolean
    tooltip?: string | React.ComponentProps<typeof TooltipContent>
  }
>(({ asChild = false, tooltip, className, ...props }, ref) => {
  const Comp = asChild ? Slot : "button"
  const { state } = useSidebar()

  const button = (
    <Comp
      ref={ref}
      className={cn(
        "w-full text-sm",
        className
      )}
      {...props}
    />
  )

  if (!tooltip || state === "expanded") {
    return button
  }

  return (
    <Tooltip>
      <TooltipTrigger asChild>{button}</TooltipTrigger>
      <TooltipContent
        side="right"
        align="center"
        {...(typeof tooltip === "string" ? { children: tooltip } : tooltip)}
      />
    </Tooltip>
  )
})
SidebarMenuButton.displayName = "SidebarMenuButton"