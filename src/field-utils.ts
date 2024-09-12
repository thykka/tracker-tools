import { useState, useCallback } from "react";

export type FieldDefinition<T> = {
  initialValue: T;
  min?: number;
  max?: number;
  step?: number;
  largeStep?: number;
  readOnly?: boolean;
  label?: string;
  units?: string;
  section?: number;
  update?: (currentValue: T, allFields: Record<string, any>) => T;
  formatter?: (value: number | string) => string;
};

export type FieldsDefinition = Record<string, FieldDefinition<any>>;

export const useFieldsState = <T extends FieldsDefinition>(
  fieldDefinitions: T
) => {
  type FieldValues = { [K in keyof T]: T[K]["initialValue"] };

  const initialState = Object.fromEntries(
    Object.entries(fieldDefinitions).map(([key, definition]) => [
      key,
      definition.initialValue,
    ])
  ) as FieldValues;

  const [fields, setFields] = useState<FieldValues>(initialState);

  const updateField = useCallback(
    <K extends keyof T>(id: K, newValue: T[K]["initialValue"]) => {
      setFields((prevFields) => {
        const newFields = { ...prevFields, [id]: newValue };
        (
          Object.entries(fieldDefinitions) as [keyof T, FieldDefinition<any>][]
        ).forEach(([key, def]) => {
          if (def.update) {
            newFields[key] = def.update(newFields[key], newFields);
          }
        });
        return newFields;
      });
    },
    [fieldDefinitions]
  );

  return { fields, updateField };
};
