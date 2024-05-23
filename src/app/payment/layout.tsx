import Link from "next/link"
import styles from './StoreLayout.module.sass'
export default async function Layout({ children }: { children: React.ReactNode }) {


  return (
    <main className={styles.StoreLayout}>
      <h1>Consulte sus pagos</h1>
      {children}
    </main>
  )
}