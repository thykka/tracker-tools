import { Field } from './Field.jsx';
import { FieldGroup } from './FieldGroup.jsx';
import { Frame } from './Frame.jsx';
import { useFieldsState } from './field-utils.js';
import { fieldDefinitions, sections } from './Fields.js';
import './App.scss';
import { useEffect } from 'react';

export default function App() {
  const { fields, updateField } = useFieldsState(fieldDefinitions);

  useEffect(() => {
    // Calculate initial values once
    updateField('projectTempo', fields.projectTempo);
  }, []);

  const groupedFields = sections.map((section, sectionIndex) => ({
    label: section,
    fields: Object.fromEntries(
      Object.entries(fieldDefinitions).filter(
        ([_, def]) => def.section === sectionIndex
      )
    )
  }));

  return (
    <Frame>
      <h1>Tracker+ Tools</h1>
      {groupedFields.map((section) => {
        return (
          <FieldGroup key={section.label} label={section.label}>
            {Object.entries(section.fields).map(([id, field]) => {
              return (
                <Field
                  id={id}
                  key={id}
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
      <footer>
        <ul>
          <li>
            <a href="https://github.com/thykka/tracker-tools/">GitHub</a>
          </li>
        </ul>
      </footer>
    </Frame>
  );
}
