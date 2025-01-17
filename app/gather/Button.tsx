'use client'

interface ButtonProps {
    children: string;
    disabled?: boolean;
    onClick: () => void;
}

export const Button: React.FC<ButtonProps> = ({ children, disabled = false, onClick }) => {

    const handleSubmit = () => {
        onClick()
    }

    return (
        <button className="btn" disabled={disabled} onClick={handleSubmit}>{ children }</button>
    )
}