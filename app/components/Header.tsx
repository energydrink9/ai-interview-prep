'use client'

import { useAuth0 } from "@auth0/auth0-react";
import { LoginButton } from "./LoginButton";
import Link from "next/link";
import Image from "next/image";


export const Header: React.FC = () => {

    const { user, isAuthenticated, logout } = useAuth0();

    const handleLogout = () => {
        logout();
    }

    return (
        <div className="navbar bg-base-100">
            <div className="flex-1">
                <Link className="btn btn-ghost text-xl" href="/">
                    {/* <Image src='/logo.png' alt='AI Interview Prep Logo' className="rounded-full" width={100} height={100} style={{border: 'solid 1px #000'}} /> */}
                    AI Interview Prep
                </Link>
            </div>
            <div className="flex-none">
                {isAuthenticated && user !== undefined && (
                    <div className="dropdown dropdown-end">

                        <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
                            <div className="w-10 rounded-full">
                            { user.picture !== undefined && <Image
                                alt="Tailwind CSS Navbar component"
                                src={user.picture} />}
                            </div>
                        </div>
                        <ul
                            tabIndex={0}
                            className="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow">
                            <li>
                            <Link className="justify-between" href="/profile">
                                Profile
                            </Link>
                            </li>
                            {/* <li><a>Settings</a></li> */}
                            <li><a onClick={handleLogout}>Logout</a></li>
                        </ul>
                    </div>
                )}
                {!isAuthenticated && (<LoginButton />)}
            </div>
        </div>
    )
}