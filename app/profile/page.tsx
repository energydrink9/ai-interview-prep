'use client'

import { useAuth0 } from "@auth0/auth0-react"
import { Authenticate } from "../components/Authenticate"

const ProfilePage: React.FC = () => {
    const { isAuthenticated, isLoading, user } = useAuth0()

    return (
        <Authenticate>
            { isAuthenticated && user !== undefined && (
                <div className="container mx-auto prose">
                    <h2>Profile</h2>

                    <div className="card bg-base-100 w-96 shadow-xl">
                        <div className="card-body">
                            <h2 className="card-title">{user.name}</h2>
                            <p>Email: <span className="italic">{user.email}</span></p>
                        </div>
                        <figure>
                            <img
                            className="rounded-full"
                            src={user.picture}
                            alt="User profile picture" />
                        </figure>
                    </div>
                </div>
            )}
        </Authenticate>
    )
}

export default ProfilePage