import { FieldsDefinition } from './field-utils.js';
import styles from './Field.module.scss';

type Props<T extends FieldsDefinition> = {
  id: string;
  value: number | string;
  label?: string;
  units?: string;
  step?: number;
  largeStep?: number;
  readOnly?: boolean;
  min?: number;
  max?: number;
  onChange?: <K extends keyof T>(id: K, value: T[K]['initialValue']) => void;
  formatter?: <K extends keyof T>(
    value: T[K]['initialValue']
  ) => T[K]['initialValue'];
};

export const Field = <T extends FieldsDefinition>(props: Props<T>) => {
  const {
    id,
    value,
    label,
    units,
    step = 1,
    largeStep = step * 10,
    min = 0,
    max = 100,
    formatter
  } = props;
  const isInput = !props.readOnly;
  const format = formatter ?? ((v) => v);
  let formattedValue = value;
  try {
    formattedValue = formatter?.(value) ?? value;
  } catch (e) {
    console.log(`Formatting error`, { id, value });
    throw e;
  }
  return (
    <div className={styles.container}>
      <label htmlFor={id} className={styles.label}>
        {label}
      </label>
      {isInput ? (
        <>
          <button
            className={styles.button}
            onClick={(event) => props.onChange?.(id, Number(value) - largeStep)}
          >
            &minus;&minus;
          </button>
          <button
            className={styles.button}
            onClick={(event) => props.onChange?.(id, Number(value) - step)}
          >
            &minus;
          </button>
          <input
            className={styles.value}
            id={id}
            type="number"
            step={step}
            min={min}
            max={max}
            value={format(value)}
            onChange={(event) =>
              props.onChange?.(id, event.currentTarget.value)
            }
            onInput={(event) => props.onChange?.(id, event.currentTarget.value)}
          />
        </>
      ) : (
        <output className={styles.value}>{format(value)}</output>
      )}
      {isInput && (
        <>
          <button
            className={styles.button}
            onClick={(event) => props.onChange?.(id, Number(value) + step)}
          >
            +
          </button>
          <button
            className={styles.button}
            onClick={(event) => props.onChange?.(id, Number(value) + largeStep)}
          >
            ++
          </button>
        </>
      )}
      <span className={styles.units}>{units}</span>
    </div>
  );
};
