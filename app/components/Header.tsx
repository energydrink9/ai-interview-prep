import Link from "next/link"

interface HeaderProps {

}

export const Header: React.FC<HeaderProps> = () => {
    return (
        <div className="text-2xl">
            <div className="flex flex-row space-x-5 items-center">
                <div><Link href='/'><img src='logo.png' className="rounded-full" width={100} height={100} style={{border: 'solid 1px #000'}} /></Link></div>
                <div>AI Interview Prep</div>
            </div>
        </div>
    )
}