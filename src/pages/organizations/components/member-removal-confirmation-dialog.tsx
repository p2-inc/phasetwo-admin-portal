import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { TriangleAlert } from "lucide-react";
import { UserRepresentation } from "@/store/apis/orgs";
import fullName from "@/components/utils/fullName";
import { useTranslation } from "react-i18next";

type Props = {
  open: boolean;
  setOpen: (open: boolean) => void;
  confirmSelection: () => void;
  member: UserRepresentation;
  isLoading?: boolean;
};

export default function MemberRemovalConfirmationDialog({
  open,
  setOpen,
  confirmSelection,
  member,
  isLoading,
}: Props) {
  const { t } = useTranslation();

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogContent>
        <div className="sm:flex sm:items-start">
          <div className="mx-auto flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
            <TriangleAlert
              className="h-6 w-6 text-red-600"
              aria-hidden="true"
            />
          </div>
          <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
            <AlertDialogTitle className="text-base font-semibold leading-6 text-foreground">
              <>Confirm removal of {fullName(member)}</>
            </AlertDialogTitle>
            <AlertDialogDescription className="mt-2">
              {t("removeMemberModalMessage")}
            </AlertDialogDescription>
          </div>
        </div>
        <AlertDialogFooter>
          <AlertDialogCancel
            onClick={() => setOpen(false)}
            disabled={isLoading}
            className="w-full sm:w-auto"
          >
            {isLoading && (
              <svg
                className="-ml-1 mr-3 size-5 animate-spin"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
            )}
            Cancel
          </AlertDialogCancel>
          <Button
            variant="destructive"
            className="w-full sm:w-auto"
            onClick={confirmSelection}
            disabled={isLoading}
          >
            Remove
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
