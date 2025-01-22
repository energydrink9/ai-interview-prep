'use client'

import { UrlInput } from "./UrlInput";
import { Button } from "../components/Button";
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
            <div className="prose">
                <h2>Job posting</h2>
                <p>
                    Preparing for a job interview can be overwhelming, but we&apos;re here to help.
                </p>
                <p>
                    Our AI-powered tool analyzes job postings and company information to create a personalized interview preparation plan just for you.
                </p>
                <p>
                    Simply paste the link to the job posting, and we&apos;ll guide you through mock interviews, customized questions, and tips to boost your confidence.
                </p>
            </div>
            <div><UrlInput autoFocus onChange={setUrl} onPaste={handlePaste} onEnter={handleSubmit} /></div>
            <div className="flex flex-row justify-end"><Button primary onClick={handleSubmit} disabled={!isValid}>Enter</Button></div>
        </div>
    )
}


