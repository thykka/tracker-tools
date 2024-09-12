import { Field } from "./Field";
import { FieldGroup } from "./FieldGroup";
import { Frame } from "./Frame";
import { useFieldsState } from "./field-utils";
import { fieldDefinitions, sections } from "./Fields";
import "./App.scss";

export default function App() {
  const { fields, updateField } = useFieldsState(fieldDefinitions);

  const groupedFields = sections.map((section, sectionIndex) => ({
    label: section,
    fields: Object.fromEntries(
      Object.entries(fieldDefinitions).filter(
        ([id, def]) => def.section === sectionIndex
      )
    ),
  }));

  return (
    <Frame>
      <h1>Tracker+ Tools</h1>
      {groupedFields.map((section) => {
        return (
          <FieldGroup label={section.label}>
            {Object.entries(section.fields).map(([id, field]) => {
              return (
                <Field
                  id={id}
                  label={field.label}
                  value={fields[id]}
                  min={field.min}
                  max={field.max}
                  step={field.step}
                  largeStep={field.largeStep}
                  units={field.units}
                  onChange={field.readOnly ? undefined : updateField}
                  formatter={field.formatter}
                  readOnly={field.readOnly}
                />
              );
            })}
          </FieldGroup>
        );
      })}
    </Frame>
  );
}
