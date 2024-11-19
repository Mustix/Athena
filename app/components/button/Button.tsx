import { RotatingLines } from "react-loader-spinner";
import styles from "./Button.module.css";
export default function Button({
  loading,
  content,
}: {
  loading: boolean;
  content: string;
}) {
  return (
    <button type="submit" disabled={loading} className={styles.button}>
      {loading ? (
        <>
          <RotatingLines
            visible={true}
            width="20"
            strokeColor=" white"
            strokeWidth="5"
            animationDuration="0.75"
            ariaLabel="rotating-lines-loading"
          />
          Loading...
        </>
      ) : (
        content
      )}
    </button>
  );
}
