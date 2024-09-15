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

const clamp = (min: number, max: number, value: number): number =>
  Math.max(min, Math.min(max, value));

export const Field = <T extends FieldsDefinition>(props: Props<T>) => {
  const {
    id,
    value,
    label,
    units,
    step = 1,
    largeStep = step * 10,
    min,
    max,
    formatter,
    onChange
  } = props;
  const isInput = !props.readOnly;

  const onChangeHandler = (id: keyof T, newValue: number): void => {
    if (typeof onChange !== 'function') return;
    let resultValue = newValue;
    if (typeof min === 'number' && typeof max === 'number' && min !== max)
      resultValue = clamp(min, max, resultValue);
    onChange(id, resultValue);
  };

  const formattedValue =
    typeof formatter === 'function' ? formatter(value) : value;
  return (
    <div className={styles.container}>
      <label htmlFor={id} className={styles.label}>
        {label}
      </label>
      {isInput ? (
        <>
          <button
            className={styles.button}
            onClick={() => onChangeHandler(id, Number(value) - largeStep)}
          >
            &minus;&minus;
          </button>
          <button
            className={styles.button}
            onClick={() => onChangeHandler(id, Number(value) - step)}
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
            value={formattedValue}
            onFocus={(event) => event.target.select()}
            onChange={(event) =>
              onChangeHandler(id, Number(event.currentTarget.value))
            }
            onInput={(event) =>
              onChangeHandler(id, Number(event.currentTarget.value))
            }
          />
        </>
      ) : (
        <output id={id} className={styles.value}>
          {formattedValue}
        </output>
      )}
      {isInput && (
        <>
          <button
            className={styles.button}
            onClick={() => onChangeHandler(id, Number(value) + step)}
          >
            +
          </button>
          <button
            className={styles.button}
            onClick={() => onChangeHandler(id, Number(value) + largeStep)}
          >
            ++
          </button>
        </>
      )}
      <span className={styles.units}>{units}</span>
    </div>
  );
};
