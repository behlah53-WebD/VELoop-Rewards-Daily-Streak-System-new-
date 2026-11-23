import { Flame, TrendingUp, Gift, Bell } from 'lucide-react';
import styles from './WhyStreak.module.css';

const BENEFITS = [
  {
    icon: <Flame size={22} />,
    title: 'Stay Active',
    description: 'Check in every single day to keep your streak alive and growing.',
    number: '01',
  },
  {
    icon: <TrendingUp size={22} />,
    title: 'Bigger Rewards',
    description: 'The longer your streak, the more valuable your daily rewards become.',
    number: '02',
  },
  {
    icon: <Gift size={22} />,
    title: 'Exclusive Rewards',
    description: 'Unlock special digital vouchers, Amazon gift cards, and mega coin drops.',
    number: '03',
  },
  {
    icon: <Bell size={22} />,
    title: "Don't Miss Out",
    description: 'Miss a day and your streak resets back to Day 1. Stay committed!',
    number: '04',
  },
];

export function WhyStreak() {
  return (
    <section className={styles.container} aria-labelledby="why-streak-heading">
      <div className={styles.headingWrapper}>
        <h3 id="why-streak-heading" className={styles.heading}>
          Why Maintain Your Streak?
        </h3>
        {/* Decorative divider with diamond */}
        <div className={styles.divider}>
          <div className={styles.dividerLine} />
          <div className={styles.diamond} />
          <div className={styles.dividerLine} />
        </div>
      </div>

      <div className={styles.grid}>
        {BENEFITS.map((item, index) => (
          <div key={index} className={styles.card}>
            {/* Number watermark */}
            <span className={styles.watermarkNumber} aria-hidden="true">
              {item.number}
            </span>

            <div className={styles.iconCircle}>
              {item.icon}
            </div>

            <h4 className={styles.title}>{item.title}</h4>
            <p className={styles.description}>{item.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

export default WhyStreak;
