import styles from './Frame.module.scss';

type Props = {
  children?: React.ReactNode;
};

export const Frame: React.FC<Props> = ({ children }) => {
  return <section className={styles.container}>{children}</section>;
};
