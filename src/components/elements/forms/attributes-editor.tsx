import { useEffect } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { Trash2 } from "lucide-react";
import { useTranslation } from "react-i18next";
import Button from "@/components/elements/forms/buttons/button";
import { Button as UIButton } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export type AttributeRow = {
  key: string;
  value: string;
};

type AttributesEditorProps = {
  defaultRows: AttributeRow[];
  onSave: (rows: AttributeRow[]) => Promise<void> | void;
  readOnly?: boolean;
  isSaving?: boolean;
};

type AttributesFormValues = {
  rows: AttributeRow[];
};

const AttributesEditor = ({
  defaultRows,
  onSave,
  readOnly = false,
  isSaving = false,
}: AttributesEditorProps) => {
  const { t } = useTranslation();

  const {
    control,
    register,
    handleSubmit,
    reset,
    setError,
    clearErrors,
    getValues,
    formState: { errors },
  } = useForm<AttributesFormValues>({
    defaultValues: { rows: defaultRows },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "rows",
  });

  useEffect(() => {
    reset({ rows: defaultRows });
  }, [defaultRows, reset]);

  const onSubmit = async ({ rows }: AttributesFormValues) => {
    clearErrors();

    let hasError = false;
    const seen = new Set<string>();

    rows.forEach((row, index) => {
      const key = row.key.trim();
      const value = row.value.trim();

      if (!key) {
        setError(`rows.${index}.key`, {
          type: "required",
          message: t("attributeKeyRequired"),
        });
        hasError = true;
        return;
      }

      const pair = JSON.stringify([key, value]);
      if (seen.has(pair)) {
        setError(`rows.${index}.key`, {
          type: "validate",
          message: t("attributeDuplicate"),
        });
        hasError = true;
        return;
      }
      seen.add(pair);
    });

    if (hasError) return;

    await onSave(
      rows.map(({ key, value }) => ({ key: key.trim(), value: value.trim() })),
    );
  };

  const addButton = (
    <Button
      type="button"
      onClick={() => append({ key: "", value: "" })}
      disabled={isSaving}
    >
      {t("addAttribute")}
    </Button>
  );

  if (readOnly) {
    if (defaultRows.length === 0) {
      return (
        <div className="text-sm text-muted-foreground">{t("noAttributes")}</div>
      );
    }

    return (
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>{t("attributeKey")}</TableHead>
            <TableHead>{t("attributeValue")}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {defaultRows.map((row, index) => (
            <TableRow key={`${row.key}-${index}`}>
              <TableCell>{row.key}</TableCell>
              <TableCell>{row.value}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {fields.length === 0 ? (
        <div className="text-sm text-muted-foreground">{t("noAttributes")}</div>
      ) : (
        <div className="space-y-3">
          {fields.map((field, index) => {
            const keyError = errors.rows?.[index]?.key?.message;
            const valueError = errors.rows?.[index]?.value?.message;

            return (
              <div key={field.id} className="space-y-1">
                <div className="flex items-start gap-2">
                  <div className="flex-1">
                    <Input
                      aria-label={t("attributeKey")}
                      placeholder={t("attributeKey")}
                      disabled={isSaving}
                      {...register(`rows.${index}.key`)}
                    />
                  </div>
                  <div className="flex-1">
                    <Input
                      aria-label={t("attributeValue")}
                      placeholder={t("attributeValue")}
                      disabled={isSaving}
                      {...register(`rows.${index}.value`)}
                    />
                  </div>
                  <UIButton
                    type="button"
                    variant="ghost"
                    size="icon"
                    aria-label={t("remove")}
                    disabled={isSaving}
                    onClick={() => {
                      remove(index);
                      clearErrors();
                    }}
                  >
                    <Trash2 className="h-4 w-4" />
                  </UIButton>
                </div>
                {(keyError || valueError) && (
                  <div className="text-sm text-destructive">
                    {keyError ?? valueError}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      <div className="flex items-center gap-2">
        {addButton}
        <Button isBlackButton type="submit" disabled={isSaving}>
          {t("save")}
        </Button>
      </div>
    </form>
  );
};

export default AttributesEditor;
