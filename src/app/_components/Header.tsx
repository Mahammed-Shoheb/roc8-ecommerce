"use client";

import Link from "next/link";
import { IoSearchOutline } from "react-icons/io5";
import { PiShoppingCartSimpleLight } from "react-icons/pi";
import { GoChevronRight, GoChevronLeft } from "react-icons/go";
import { readFromStorage } from "~/utils/storage";
import { useEffect, useState } from "react";

export default function Header() {
  const [userName, setUserName] = useState("John");
  useEffect(() => {
    const data = readFromStorage("user");
    if (data.name) setUserName(data.name);
  }, []);
  return (
    <header className="flex flex-col py-2 ">
      <div className="flex flex-col gap-y-3 px-2 py-1 md:px-8">
        <div className="flex justify-end gap-x-4 text-xs capitalize">
          <Link href="#">help</Link>
          <Link href="#">orders & returns</Link>
          <button className="capitalize">hi, {userName}</button>
        </div>
        <div className="flex items-center justify-between py-2">
          <h1 className="text-3xl font-bold uppercase">ecommerce</h1>
          <nav className="mx-10 hidden md:block">
            <ul className="flex gap-x-7 text-sm font-semibold capitalize">
              <li>
                <Link href="#">categories</Link>
              </li>
              <li>
                <Link href="#">sale</Link>
              </li>
              <li>
                <Link href="#">clearance</Link>
              </li>
              <li>
                <Link href="#">new stock</Link>
              </li>
              <li>
                <Link href="#">trending</Link>
              </li>
            </ul>
          </nav>
          <div className="flex gap-x-9">
            <Link href="#">
              <IoSearchOutline className="text-xl" />
            </Link>
            <Link href="#">
              <PiShoppingCartSimpleLight className="text-xl" />
            </Link>
          </div>
        </div>
      </div>
      <div>
        <div className="flex  justify-center bg-gray-100 py-1">
          <div className="flex items-center justify-between">
            <button>
              <GoChevronLeft className=" text-xl" />
            </button>
            <p className="mx-5 text-sm">Get 10% off on business sign up</p>
            <button>
              <GoChevronRight className=" text-xl" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
