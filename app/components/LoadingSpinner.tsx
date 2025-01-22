interface LoadingSpinnerProps {
    size?: 'loading-sm' | 'loading-lg';
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ size = 'loading-lg' }) => {
    return (
        <span className={`loading loading-spinner ${size}`} />
    )
}