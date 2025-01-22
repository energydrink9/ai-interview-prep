'use client'

import { useAuth0 } from "@auth0/auth0-react"
import { Authenticate } from "../components/Authenticate"
import { useBalance } from "./use-balance"
import { LoadingSpinner } from "../components/LoadingSpinner"
import { Button } from "../components/Button"
import { useCheckoutLink } from "./use-checkout-link"


const Profile: React.FC = () => {
    const { isAuthenticated, isLoading, user } = useAuth0()
    const { status: balanceStatus, balance } = useBalance()

    const { status: checkoutLinkStatus, checkoutLink } = useCheckoutLink()
    const handleBuyCredits = () => {
        if (checkoutLinkStatus == 'success' && checkoutLink !== undefined) {
            window.location.href = checkoutLink
        }
    }

    return isAuthenticated && user !== undefined && (
        <div className="container mx-auto prose">

            <h2>Profile</h2>

            <div className="card bg-base-100 w-96 shadow-xl">
                <div className="card-body">
                    <h2 className="card-title">{user.name}</h2>
                    <p>Email: <span className="italic">{user.email}</span></p>
                    <p>
                        Balance: { balanceStatus == 'success' ? (<span>{balance?.balance}</span>) : <LoadingSpinner size="loading-sm" /> }
                    </p>
                    <p className="italic"><span className="text-secondary">1 credit</span> is equivalent to <span className="text-secondary">1 minute of virtual interview time</span> with the AI Interview Prep coach.</p>

                    <Button onClick={handleBuyCredits}>
                        Buy more credits
                    </Button>
                </div>
                <figure>
                    <img
                    className="rounded-full"
                    src={user.picture}
                    alt="User profile picture" />
                </figure>
            </div>
        </div>
    )
}

const ProfilePage: React.FC = () => {
    return (
        <Authenticate>
            <Profile />
        </Authenticate>
    )
}

export default ProfilePage