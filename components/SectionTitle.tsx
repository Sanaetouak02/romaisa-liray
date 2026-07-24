import styles from './SectionTitle.module.css'

export default function SectionTitle({ eyebrow, title, light = false }: { eyebrow: string; title: string; light?: boolean }) {
  return (
    <div className={styles.sectionTitle}>
      <p className={light ? styles.eyebrowLight : styles.eyebrow}>{eyebrow}</p>
      <h2 className={light ? `${styles.title} ${styles.titleLight}` : styles.title}>{title}</h2>
      <span className={light ? `${styles.titleRule} ${styles.ruleLight}` : styles.titleRule} />
    </div>
  )
}
