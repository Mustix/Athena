import next from "next";
import Image from "next/image";
import styles from "./Header.module.css";
export default function Header() {
  return (
    <header className={styles.header}>
      <Image src="/logo.png" alt="logo" width={142} height={155} />
    </header>
  );
}
