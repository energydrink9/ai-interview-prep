'use client'

import classnames from 'classnames'

interface ButtonProps {
    children: string;
    disabled?: boolean;
    onClick: () => void;
    primary?: boolean;
}

export const Button: React.FC<ButtonProps> = ({ children, disabled = false, onClick, primary = false }) => {

    const handleSubmit = () => {
        onClick()
    }

    const className = classnames('btn', {'btn-primary': primary})

    return (
        <button className={className} disabled={disabled} onClick={handleSubmit}>{ children }</button>
    )
}