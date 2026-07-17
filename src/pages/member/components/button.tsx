const buttonClasses =
  "rounded-sm bg-accent py-1 px-2 text-xs font-semibold text-primary shadow-xs enabled:hover:bg-accent/80 disabled:opacity-50 lowercase";

export const Button = ({
  onClick,
  disabled,
  text,
}: {
  onClick: (args: any) => void;
  disabled: boolean;
  text: string;
}) => {
  return (
    <button className={buttonClasses} onClick={onClick} disabled={disabled}>
      {text}
    </button>
  );
};
