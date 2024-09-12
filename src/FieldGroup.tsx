import styles from './FieldGroup.module.scss';

type Props = {
  label: string;
  children?: React.ReactNode;
};

export const FieldGroup: React.FC<Props> = ({ label, children }) => {
  return (
    <fieldset className={styles.container}>
      <legend className={styles.label}>{label}</legend>
      {children}
    </fieldset>
  );
};
