type UAEFlagProps = {
  className?: string;
  title?: string;
};

export default function UAEFlag({ className = "h-4 w-auto", title }: UAEFlagProps) {
  return (
    <svg
      viewBox="0 0 28 18"
      className={`inline-block shrink-0 ${className}`}
      role={title ? "img" : undefined}
      aria-hidden={title ? undefined : true}
      aria-label={title}
      xmlns="http://www.w3.org/2000/svg"
    >
      <path fill="#00732F" d="M7 0h21v6H7z" />
      <path fill="#FFF" d="M7 6h21v6H7z" />
      <path fill="#000" d="M7 12h21v6H7z" />
      <path fill="#EF3340" d="M0 0h7v18H0z" />
    </svg>
  );
}
