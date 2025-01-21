import Image from "next/image"
import Link from "next/link"

export const Header: React.FC = () => {
    return (
        <div className="text-2xl">
            <div className="flex flex-row space-x-5 items-center">
                <div><Link href='/'><Image src='/logo.png' alt='AI Interview Prep Logo' className="rounded-full" width={100} height={100} style={{border: 'solid 1px #000'}} /></Link></div>
                <div>AI Interview Prep</div>
            </div>
        </div>
    )
}