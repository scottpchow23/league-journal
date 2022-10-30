import { Menu, Transition } from "@headlessui/react";
import { signIn, signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { Fragment } from "react";

const Navbar = () => {
  const { data: sessionData } = useSession();
  return (
    <>
      <nav className="flex flex-wrap items-center bg-blue-300 p-3 ">
        <Link href="/">
          <div className="mr-4 inline-flex items-center p-2 ">
            <span className="text-xl font-bold uppercase tracking-wide text-white">
              League Journal
            </span>
          </div>
        </Link>
        <div className="hidden w-full lg:inline-flex lg:w-auto lg:flex-grow">
          <div className="flex w-full flex-col items-start lg:ml-auto lg:inline-flex lg:h-auto  lg:w-auto lg:flex-row lg:items-center">
            <Menu as="div" className="relative inline-block text-left">
              {sessionData ? (
                <>
                  <div>
                    <Menu.Button className="w-full items-center justify-center rounded px-3 py-2 font-bold text-white hover:bg-gray-50 hover:text-blue-300 lg:inline-flex lg:w-auto">
                      {sessionData?.user?.name || "User"}
                    </Menu.Button>
                  </div>
                  <Transition
                    as={Fragment}
                    enter="transition ease-out duration-100"
                    enterFrom="transform opacity-0 scale-95"
                    enterTo="transform opacity-100 scale-100"
                    leave="transition ease-in duration-75"
                    leaveFrom="transform opacity-100 scale-100"
                    leaveTo="transform opacity-0 scale-95"
                  >
                    <Menu.Items className="absolute right-0 mt-2 w-56 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                      <div className="px-1 py-1">
                        <Menu.Item>
                          {({ active }) => (
                            <Link
                              href="/account"
                              className={`${
                                active
                                  ? "bg-blue-300 text-white"
                                  : "text-blue-300"
                              } group flex w-full items-center rounded-md px-2 py-2 text-sm font-bold`}
                            >
                              Account
                            </Link>
                          )}
                        </Menu.Item>
                      </div>
                      <div className="px-1 py-1">
                        <Menu.Item>
                          {({ active }) => (
                            <button
                              className={`${
                                active
                                  ? "bg-blue-300 text-white"
                                  : "text-blue-300"
                              } group flex w-full items-center rounded-md px-2 py-2 text-sm font-bold`}
                              onClick={() => signOut()}
                            >
                              Sign Out
                            </button>
                          )}
                        </Menu.Item>
                      </div>
                    </Menu.Items>
                  </Transition>
                </>
              ) : (
                <Menu.Button
                  className="w-full items-center justify-center rounded px-3 py-2 font-bold text-white hover:bg-gray-50 hover:text-blue-300 lg:inline-flex lg:w-auto"
                  onClick={() => signIn()}
                >
                  Sign In
                </Menu.Button>
              )}
            </Menu>
          </div>
        </div>
      </nav>
    </>
  );
};
export default Navbar;
