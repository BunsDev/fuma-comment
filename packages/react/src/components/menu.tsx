import { Menu as Base, Transition } from "@headlessui/react";
import { cva } from "cva";
import type { ButtonHTMLAttributes, HTMLAttributes } from "react";
import { Fragment, forwardRef } from "react";
import { cn } from "../utils/cn";

const menuItemVariants = cva(
  "fc-px-3 fc-py-1.5 fc-text-left fc-transition-colors disabled:fc-cursor-not-allowed disabled:fc-opacity-80",
  {
    variants: {
      active: {
        true: "fc-bg-accent fc-text-accent-foreground",
        false: "",
      },
    },
  }
);

const menuItemsVariants = cva(
  "fc-absolute fc-right-0 fc-z-50 fc-flex fc-w-56 fc-origin-top-right fc-flex-col fc-divide-y fc-divide-border fc-overflow-hidden fc-rounded-md fc-bg-popover fc-text-popover-foreground fc-shadow-lg focus-visible:fc-outline-none focus-visible:fc-ring-1 focus-visible:fc-ring-ring"
);

type MenuItemsProps = HTMLAttributes<HTMLDivElement>;

const MenuItems = forwardRef<HTMLDivElement, MenuItemsProps>(
  ({ className, ...props }, ref) => {
    return (
      <Transition
        as={Fragment}
        enter="transition fc-ease-out fc-duration-100"
        enterFrom="transform fc-opacity-0 fc-scale-95"
        enterTo="transform fc-opacity-100 fc-scale-100"
        leave="transition fc-ease-in fc-duration-75"
        leaveFrom="transform fc-opacity-100 fc-scale-100"
        leaveTo="transform fc-opacity-0 fc-scale-95"
      >
        <Base.Items
          className={cn(menuItemsVariants({ className }))}
          ref={ref}
          {...props}
        >
          {props.children}
        </Base.Items>
      </Transition>
    );
  }
);

MenuItems.displayName = Base.Items.displayName;

type MenuItemProps = ButtonHTMLAttributes<HTMLButtonElement>;

const MenuItem = forwardRef<HTMLButtonElement, MenuItemProps>(
  ({ className, ...props }, ref) => {
    return (
      <Base.Item>
        {({ active }) => (
          <button
            className={cn(menuItemVariants({ active, className }))}
            ref={ref}
            type="button"
            {...props}
          >
            {props.children}
          </button>
        )}
      </Base.Item>
    );
  }
);

MenuItem.displayName = Base.Item.displayName;

const MenuTrigger: (typeof Base)["Button"] = Base.Button;

export { Base as Menu, MenuItems, MenuItem, MenuTrigger };
