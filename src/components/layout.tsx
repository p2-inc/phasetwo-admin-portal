import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useState } from "react";
import cs from "classnames";

import {
  ChevronIcon,
  CloudIcon,
  DoubleSlashBrandIcon,
  FullBrandIcon,
  GaugeIcon,
  PeopleIcon,
} from "./icons";

const user = {
  name: "Garth Patil",
  email: "garth@phasetwo.io",
};
const navigation = [
  { name: "Dashboard", href: "#", icon: GaugeIcon },
  { name: "Deployments", href: "#", icon: CloudIcon },
  { name: "Organizations", href: "#", icon: PeopleIcon, isActive: true },
];

export default function Layout({ children }) {
  // const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [menuCollapsed, setMenuCollapsed] = useState(true);

  return (
    <>
      <div className="flex h-full">
        {/* TODO: Ask about mobile view */}
        {/* <Transition.Root show={mobileMenuOpen} as={Fragment}>
          <Dialog
            as="div"
            className="relative z-40 lg:hidden"
            onClose={setMobileMenuOpen}
          >
            <Transition.Child
              as={Fragment}
              enter="transition-opacity ease-linear duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="transition-opacity ease-linear duration-300"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <div className="fixed inset-0 bg-gray-600 bg-opacity-75" />
            </Transition.Child>

            <div className="fixed inset-0 z-40 flex">
              <Transition.Child
                as={Fragment}
                enter="transition ease-in-out duration-300 transform"
                enterFrom="-translate-x-full"
                enterTo="translate-x-0"
                leave="transition ease-in-out duration-300 transform"
                leaveFrom="translate-x-0"
                leaveTo="-translate-x-full"
              >
                <Dialog.Panel className="relative flex w-full max-w-xs flex-1 flex-col bg-white focus:outline-none">
                  <Transition.Child
                    as={Fragment}
                    enter="ease-in-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in-out duration-300"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                  >
                    <div className="absolute top-0 right-0 -mr-12 pt-4">
                      <button
                        type="button"
                        className="ml-1 flex h-10 w-10 items-center justify-center rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        <span className="sr-only">Close sidebar</span>
                        <XMarkIcon
                          className="h-6 w-6 text-white"
                          aria-hidden="true"
                        />
                      </button>
                    </div>
                  </Transition.Child>

                  <div className="pt-5 pb-4">
                    <div className="flex flex-shrink-0 items-center px-4">
                      <DoubleSlashBrandIcon />
                    </div>
                    <nav aria-label="Sidebar" className="mt-5">
                      <div className="space-y-1 px-2">
                        {navigation.map((item) => (
                          <a
                            key={item.name}
                            href={item.href}
                            className="group flex items-center rounded-md p-2 text-base font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                          >
                            <item.icon
                              className="mr-4 h-6 w-6 text-gray-400 group-hover:text-gray-500"
                              aria-hidden="true"
                            />
                            {item.name}
                          </a>
                        ))}
                      </div>
                    </nav>
                  </div>
                  <div className="flex flex-shrink-0 border-t border-gray-200 p-4">
                    <a href="#" className="group block flex-shrink-0">
                      <div className="flex items-center">
                        <div>
                          <img
                            className="inline-block h-10 w-10 rounded-full"
                            src={user.imageUrl}
                            alt=""
                          />
                        </div>
                        <div className="ml-3">
                          <p className="text-base font-medium text-gray-700 group-hover:text-gray-900">
                            {user.name}
                          </p>
                          <p className="text-sm font-medium text-gray-500 group-hover:text-gray-700">
                            Account Settings
                          </p>
                        </div>
                      </div>
                    </a>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
              <div className="w-14 flex-shrink-0" aria-hidden="true"></div>
            </div>
          </Dialog>
        </Transition.Root> */}

        {/* Static sidebar for desktop */}
        {/* If using a mobile view: <div className="hidden lg:flex lg:flex-shrink-0"> */}
        <div className="flex flex-shrink-0">
          <div
            className={cs(
              "flex w-[70px] flex-col transition-[width] duration-150 ease-in-out",
              {
                "w-64": !menuCollapsed,
              }
            )}
          >
            <div className="flex min-h-0 flex-1 flex-col overflow-y-auto bg-gray-50">
              <div className="flex-1">
                {menuCollapsed ? (
                  <div
                    className="group flex items-center justify-center py-4 pt-8 hover:cursor-pointer "
                    onClick={() => setMenuCollapsed(!menuCollapsed)}
                  >
                    <DoubleSlashBrandIcon />
                    <ChevronIcon className="stroke-gray-400 group-hover:stroke-gray-600 " />
                  </div>
                ) : (
                  <div
                    className="group flex items-center justify-between py-4 px-4 pt-8 hover:cursor-pointer"
                    onClick={() => setMenuCollapsed(!menuCollapsed)}
                  >
                    <FullBrandIcon />
                    <ChevronIcon className="rotate-180 stroke-gray-400 group-hover:stroke-gray-600 " />
                  </div>
                )}
                <nav
                  aria-label="Sidebar"
                  className={cs("flex flex-col items-center space-y-3 py-6", {
                    "px-4": !menuCollapsed,
                  })}
                >
                  {navigation.map((item) => (
                    <a
                      key={item.name}
                      href={item.href}
                      className={cs(
                        "flex items-center rounded-lg border-2 border-gray-200 p-[14px] text-sm transition-colors hover:border-gray-300 hover:bg-white",
                        {
                          "border-blue-400 bg-white hover:border-blue-400":
                            item.isActive,
                          "w-full": !menuCollapsed,
                        }
                      )}
                    >
                      <item.icon className="h-[18] w-[18]" aria-hidden="true" />
                      <span className="sr-only">{item.name}</span>
                      {!menuCollapsed && (
                        <span className="pl-2">{item.name}</span>
                      )}
                    </a>
                  ))}
                </nav>
              </div>
              <div
                className={cs("flex pb-5", {
                  "flex-shrink-0": menuCollapsed,
                })}
              >
                <a
                  href="#"
                  className={cs("flex", {
                    "items-center px-6": !menuCollapsed,
                    "w-full flex-shrink-0": menuCollapsed,
                  })}
                >
                  <div className="mx-auto block grid h-8 w-8 place-items-center rounded-full bg-white text-sm">
                    {user.name.substring(0, 1)}
                  </div>
                  {!menuCollapsed && (
                    <p className="ml-2 text-sm">{user.name}</p>
                  )}
                  <div className="sr-only">
                    <p>{user.name}</p>
                    <p>Account settings</p>
                  </div>
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
          {/* Mobile top navigation */}
          {/* <div className="lg:hidden">
            <div className="flex items-center justify-between bg-indigo-600 py-2 px-4 sm:px-6 lg:px-8">
              <div>
                <img
                  className="h-8 w-auto"
                  src="https://tailwindui.com/img/logos/mark.svg?color=white"
                  alt="Your Company"
                />
              </div>
              <div>
                <button
                  type="button"
                  className="-mr-3 inline-flex h-12 w-12 items-center justify-center rounded-md bg-indigo-600 text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                  onClick={() => setMobileMenuOpen(true)}
                >
                  <span className="sr-only">Open sidebar</span>
                  <Bars3Icon className="h-6 w-6" aria-hidden="true" />
                </button>
              </div>
            </div>
          </div> */}

          <main className="flex flex-1 overflow-hidden">
            {/* Secondary menu */}
            <aside className="order-first block flex-shrink-0">
              <div className="relative flex h-full w-72 flex-col overflow-y-auto border-r border-gray-200 bg-white">
                Secondary Menu
              </div>
            </aside>

            {/* Primary content */}
            <section
              aria-labelledby="primary-heading"
              className="flex h-full min-w-0 flex-1 flex-col overflow-y-auto "
            >
              {children}
            </section>
          </main>
        </div>
      </div>
    </>
  );
}
