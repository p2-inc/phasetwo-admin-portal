import { FC } from "react";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import Button from "@/components/elements/forms/buttons/button";
import { CircleCheck } from "lucide-react";
import { useTranslation } from "react-i18next";

type ConfirmationModalProps = {
  children?: React.ReactNode;
  buttonTitle?: string;
  buttonId?: string;
  render?(toggle: () => void): React.ReactNode;
  modalTitle: string;
  modalMessage?: string;
  modalContinueButtonLabel?: string;
  modalCancelButtonLabel?: string;
  onContinue: () => void;
  onClose?: () => void;
  open: boolean;
  close: () => void;
};

const ConfirmationModal: FC<ConfirmationModalProps> = ({
  children,
  modalTitle,
  modalMessage,
  modalCancelButtonLabel,
  modalContinueButtonLabel,
  onContinue,
  onClose,
  open,
  close,
}) => {
  const { t } = useTranslation();
  if (!modalCancelButtonLabel) {
    modalCancelButtonLabel = t("cancel");
  }
  if (!modalContinueButtonLabel) {
    modalContinueButtonLabel = t("confirm");
  }
  const handleModalToggle = () => {
    close();
    if (onClose) onClose();
  };

  const handleContinue = () => {
    handleModalToggle();
    onContinue();
  };

  return (
    <AlertDialog
      open={open}
      onOpenChange={(isOpen) => {
        if (!isOpen) close();
      }}
    >
      <AlertDialogContent>
        <div className="sm:flex sm:items-start">
          <div className="mx-auto flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-accent sm:mx-0 sm:h-10 sm:w-10">
            <CircleCheck className="h-6 w-6" aria-hidden="true" />
          </div>
          <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
            <AlertDialogTitle className="text-base font-semibold leading-6 text-foreground">
              {modalTitle}
            </AlertDialogTitle>
            {modalMessage && (
              <AlertDialogDescription className="mt-2">
                {modalMessage}
              </AlertDialogDescription>
            )}
            {children && (
              <div className="mt-2">
                <p className="text-sm text-muted-foreground">{children}</p>
              </div>
            )}
          </div>
        </div>
        <AlertDialogFooter>
          <Button
            onClick={handleModalToggle}
            className="inline-flex w-full justify-center sm:w-auto"
          >
            {modalCancelButtonLabel}
          </Button>
          <Button
            isBlackButton
            className="inline-flex w-full justify-center sm:w-auto"
            onClick={handleContinue}
          >
            {modalContinueButtonLabel}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default ConfirmationModal;
