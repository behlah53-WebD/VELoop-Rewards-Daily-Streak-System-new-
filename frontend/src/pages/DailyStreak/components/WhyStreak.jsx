import { Flame, TrendingUp, Gift, Bell } from 'lucide-react';
import styles from './WhyStreak.module.css';

const BENEFITS = [
  {
    icon: <Flame size={20} />,
    title: 'Stay Active',
    description: 'Check in every single day to keep your streak alive and growing.',
  },
  {
    icon: <TrendingUp size={20} />,
    title: 'Bigger Rewards',
    description: 'The longer your streak, the more valuable your daily rewards become.',
  },
  {
    icon: <Gift size={20} />,
    title: 'Exclusive Rewards',
    description: 'Unlock special digital vouchers, Amazon gift cards, and mega coin drops.',
  },
  {
    icon: <Bell size={20} />,
    title: "Don't Miss Out",
    description: 'Miss a day and your streak resets back to Day 1. Stay committed!',
  },
];

export function WhyStreak() {
  return (
    <section className={styles.container} aria-labelledby="why-streak-heading">
      <h3 id="why-streak-heading" className={styles.heading}>
        Why Maintain Your Streak?
      </h3>

      <div className={styles.grid}>
        {BENEFITS.map((item, index) => (
          <div key={index} className={styles.card}>
            <div className={styles.iconCircle}>{item.icon}</div>
            <h4 className={styles.title}>{item.title}</h4>
            <p className={styles.description}>{item.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

export default WhyStreak;
