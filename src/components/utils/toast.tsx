import { toast } from "sonner";

type Props = {
  success?: boolean;
  error?: boolean;
  information?: boolean;
  title: string;
  message?: string;
  duration?: number;
};

export default function P2Toast({
  success,
  error,
  information,
  title,
  message,
  duration,
}: Props) {
  const options = {
    description: message,
    ...(duration ? { duration } : {}),
  };

  if (success) {
    return toast.success(title, options);
  }
  if (error) {
    return toast.error(title, options);
  }
  if (information) {
    return toast.info(title, options);
  }
  return toast(title, options);
}
