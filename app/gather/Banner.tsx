import Link from "next/link"

interface BannerProps {

}

export const Banner: React.FC<BannerProps> = () => {
    return (
        <div className="hero min-h-screen" style={{
          backgroundImage: "url(banner.jpg)",
        }}>
        <div className="hero-overlay bg-opacity-60"></div>
        <div className="hero-content text-neutral-content text-center">
          <div className="max-w-md">
            <h1 className="mb-5 text-5xl font-bold">Ace Your Dream Job</h1>
            <p className="mb-5">
            Your personalized interview coach is here! Get a tailored preparation plan, expert tips, and practice questions to build confidence and land your next job. Start your journey to success today!
            </p>
            <Link href='gather'><button className="btn btn-primary">Get Started</button></Link>
          </div>
        </div>
      </div>
    )
}