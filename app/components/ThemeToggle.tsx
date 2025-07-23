"use client";

export default function ThemeToggle() {
  // We're not implementing theme switching anymore, so this component is just a placeholder
  return null;
}


function SunIcon() {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      className="w-5 h-5"
    >
      <circle cx="12" cy="12" r="5" strokeWidth="2" />
      <path 
        strokeWidth="2" 
        d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"
      />
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      className="w-5 h-5"
    >
      <path 
        strokeWidth="2" 
        d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" 
      />
    </svg>
  );
}
