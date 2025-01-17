'use client'

import { ChangeEvent, KeyboardEvent, ClipboardEvent } from "react";

interface UrlInputProps {
    onChange: (value: string) => void;
    onEnter: () => void;
    onPaste: (value: string) => void;
}

export const UrlInput: React.FC<UrlInputProps> = ({ onChange, onEnter, onPaste }) => {
    
    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        onChange(e.target.value)
    }

    const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key == 'Enter') {
            onEnter()
        }
    }

    const handlePaste = (e: ClipboardEvent<HTMLInputElement>) => {
        onPaste(e.clipboardData.getData('Text'))
    }

    return (
        <input type="text" placeholder="Type here" className="input w-full max-w-2xl" onChange={handleChange} onKeyDown={handleKeyDown} onPaste={handlePaste} />
    )
}