export function HandDrawnCircle({ className = "" }) {
    return (
        <svg className={`absolute pointer-events-none text-teal-500 ${className}`} viewBox="0 0 100 40" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M5 25C15 35 70 40 90 25C105 15 90 2 50 5C20 8 2 20 15 30" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
        </svg>
    );
}