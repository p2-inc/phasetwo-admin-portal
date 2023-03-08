import { FC, useState } from "react";
import { Dialog } from "@headlessui/react";
import Button from "components/elements/forms/buttons/button";

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
  isDisabled?: boolean;
};

const ConfirmationModal: FC<ConfirmationModalProps> = ({
  children,
  buttonTitle,
  buttonId,
  render,
  modalTitle,
  modalMessage,
  modalCancelButtonLabel,
  modalContinueButtonLabel,
  onContinue,
  onClose,
  isDisabled,
}) => {
  let [isOpen, setIsOpen] = useState(false);

  const handleModalToggle = () => {
    setIsOpen(!isOpen);
    if (onClose) onClose();
  };

  const handleContinue = () => {
    handleModalToggle();
    onContinue();
  };

  return (
    <>
      {!render && (
        <Button id={buttonId} onClick={handleModalToggle} disabled={isDisabled}>
          {buttonTitle}
        </Button>
      )}
      {render && render(handleModalToggle)}
      <Dialog
        open={isOpen}
        onClose={() => setIsOpen(false)}
        className="relative z-50"
      >
        <Dialog.Panel>
          <Dialog.Title>{modalTitle}</Dialog.Title>
          <Dialog.Description>{modalMessage}</Dialog.Description>
          {children}
          <Button onClick={() => handleContinue()}>
            {modalContinueButtonLabel}
          </Button>
          <Button onClick={() => handleModalToggle()}>
            {modalCancelButtonLabel}
          </Button>
        </Dialog.Panel>
      </Dialog>
    </>
  );
};

export default ConfirmationModal;
