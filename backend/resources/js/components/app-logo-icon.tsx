import type { SVGAttributes } from 'react';

export default function AppLogoIcon(props: SVGAttributes<SVGElement>) {
    return (
        <svg {...props} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            {/* Hospital Cross Icon */}
            <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M12 2C13.1046 2 14 2.89543 14 4V6H16C17.1046 6 18 6.89543 18 8V10H20C21.1046 10 22 10.8954 22 12C22 13.1046 21.1046 14 20 14H18V16C18 17.1046 17.1046 18 16 18H14V20C14 21.1046 13.1046 22 12 22C10.8954 22 10 21.1046 10 20V18H8C6.89543 18 6 17.1046 6 16V14H4C2.89543 14 2 13.1046 2 12C2 10.8954 2.89543 10 4 10H6V8C6 6.89543 6.89543 6 8 6H10V4C10 2.89543 10.8954 2 12 2ZM12 4V8H8V12H12V16H16V12H20V8H16V4H12Z"
            />
        </svg>
    );
}
