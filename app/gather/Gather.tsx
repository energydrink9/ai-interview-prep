'use client'

import { UrlInput } from "./UrlInput";
import { Button } from "./Button";
import { useState } from "react";

interface GatherJobProps {
    onSubmit: (url: string) => void;
}

const isValidValue = (value: string) => value.trim() != ''

export const GatherJob: React.FC<GatherJobProps> = ({ onSubmit }) => {
    const [url, setUrl] = useState<string>('')
    const isValid = isValidValue(url)

    const handleSubmit = () => {
        if (isValid) {
            onSubmit(url)
        }
    }

    const handlePaste = (value: string) => {
        if (isValidValue(value)) {
            onSubmit(value)
        }
    }

    return (
        <div className="flex flex-col space-y-4">
            <div>Paste here the link to the job you want to apply to</div>
            <div><UrlInput autoFocus onChange={setUrl} onPaste={handlePaste} onEnter={handleSubmit} /></div>
            <div className="flex flex-row justify-end"><Button primary onClick={handleSubmit} disabled={!isValid}>Enter</Button></div>
        </div>
    )
}


