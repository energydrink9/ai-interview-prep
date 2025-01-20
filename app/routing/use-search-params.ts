import { useSearchParams as nextUseSearchParams } from "next/navigation"
import { useRouter } from "next/navigation"

type UseSearchParamsResult = [
    string,
    (value: string) => void,
]

export const useSearchParams = (name: string, defaultValue: string = ''): UseSearchParamsResult => {
    const router = useRouter()
    const searchParams = nextUseSearchParams()
    const value = searchParams.get(name) ?? defaultValue
    const setValue = (value: string) => {
        const href = window.location.href
        const url = new URL(href)
        const updatedSearchParams = url.searchParams
        updatedSearchParams.set(name, value)
        url.search = updatedSearchParams.toString()
        router.push(url.toString())
    }

    return [ value, setValue ]
}