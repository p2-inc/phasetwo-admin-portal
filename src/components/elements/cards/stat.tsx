import { isNil } from "lodash";

type Props = {
  value: string | number;
  label: string;
  percent?: null | number;
  hoverPercentText?: string;
};

const ProgressBar = ({ percent = 0 }) => {
  const radius = 10;
  const circumference = radius * 2 * Math.PI;
  return (
    <svg className="h-6 w-6">
      <circle
        className="text-gray-300"
        strokeWidth="3"
        stroke="currentColor"
        fill="transparent"
        r={radius}
        cx="12"
        cy="12"
      />
      <circle
        className=" text-primary-700"
        strokeWidth="3"
        strokeDasharray={circumference}
        strokeDashoffset={circumference - (percent / 100) * circumference}
        strokeLinecap="round"
        stroke="currentColor"
        fill="transparent"
        r={radius}
        cx="12"
        cy="12"
      />
    </svg>
  );
};

const Stat: React.FC<Props> = ({ percent, hoverPercentText, value, label }) => {
  return (
    <div className="flex flex-row">
      {!isNil(percent) && (
        <div className="pr-2 pt-1" title={hoverPercentText}>
          <ProgressBar percent={percent as number} />
        </div>
      )}
      <div>
        <div className="font-semibold dark:text-zinc-200">{value}</div>
        <div className="text-sm font-medium capitalize text-gray-600 dark:text-zinc-300">
          {label}
        </div>
      </div>
    </div>
  );
};

export default Stat;
