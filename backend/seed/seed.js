import bcrypt from 'bcryptjs';
import { connectDB, disconnectDB } from '../src/config/db.js';
import { User } from '../src/models/User.js';
import { Wallet } from '../src/models/Wallet.js';
import { StreakConfig } from '../src/models/StreakConfig.js';
import { StreakReward } from '../src/models/StreakReward.js';
import { StreakCycle } from '../src/models/StreakCycle.js';

export const REWARDS_SEED_DATA = [
  {
    day: 1,
    rewardType: 'VES',
    currency: 'VES',
    amount: 5,
    title: '+5 VEs',
    subtitle: 'Daily check-in reward',
    description: 'Claim 5 VEs to start your weekly streak!',
    assetType: 'coin',
    badge: null,
    isUltimate: false,
    active: true,
  },
  {
    day: 2,
    rewardType: 'VES',
    currency: 'VES',
    amount: 10,
    title: '+10 VEs',
    subtitle: 'Daily check-in reward',
    description: 'Keep going! Double your initial check-in reward.',
    assetType: 'coin',
    badge: null,
    isUltimate: false,
    active: true,
  },
  {
    day: 3,
    rewardType: 'VES',
    currency: 'VES',
    amount: 15,
    title: '+15 VEs',
    subtitle: 'Daily check-in reward',
    description: 'Day 3 milestone reward.',
    assetType: 'coin',
    badge: null,
    isUltimate: false,
    active: true,
  },
  {
    day: 4,
    rewardType: 'GIFT_CARD',
    currency: 'INR',
    amount: 1,
    title: '₹1 Amazon Gift Card',
    subtitle: 'Voucher unlock',
    description: 'Unlock your first digital voucher on Day 4!',
    assetType: 'gift-box',
    badge: null,
    isUltimate: false,
    active: true,
  },
  {
    day: 5,
    rewardType: 'GIFT_CARD',
    currency: 'INR',
    amount: 2,
    title: '₹2 Amazon Gift Card',
    subtitle: 'Gift Card Bonus',
    description: 'Exclusive Day 5 digital voucher gift card.',
    assetType: 'gift-card',
    badge: 'Gift Card',
    isUltimate: false,
    active: true,
  },
  {
    day: 6,
    rewardType: 'VES',
    currency: 'VES',
    amount: 30,
    title: '+30 VEs',
    subtitle: 'Mega Coin Drop',
    description: 'Massive coin drop before the ultimate crown reward!',
    assetType: 'coin',
    badge: 'Coin',
    isUltimate: false,
    active: true,
  },
  {
    day: 7,
    rewardType: 'GIFT_CARD',
    currency: 'INR',
    amount: 5,
    title: '₹5 Amazon Gift Card',
    subtitle: 'Ultimate Reward',
    description: 'Congratulations on completing the full 7-day streak! Crown achievement.',
    assetType: 'crown',
    badge: 'VIP',
    isUltimate: true,
    active: true,
  },
];

export async function seedDatabase(options = { exitOnComplete: true }) {
  try {
    console.log('[Seed] Connecting to MongoDB...');
    await connectDB();

    console.log('[Seed] Seeding StreakConfig...');
    await StreakConfig.findOneAndUpdate(
      { configKey: 'default' },
      {
        $set: {
          configKey: 'default',
          cycleLength: 7,
          claimIntervalHours: 24,
          claimWindowHours: 24,
          resetOnMiss: true,
          pendingClaimTtlSeconds: 120,
          cpaDemoSeconds: 3,
          active: true,
        },
      },
      { upsert: true, new: true }
    );

    console.log('[Seed] Seeding 7 StreakRewards...');
    for (const reward of REWARDS_SEED_DATA) {
      await StreakReward.findOneAndUpdate(
        { configKey: 'default', day: reward.day, active: true },
        { $set: reward },
        { upsert: true, new: true }
      );
    }

    console.log('[Seed] Seeding Demo User (demo@veloop.test)...');
    const demoEmail = 'demo@veloop.test';
    const passwordHash = await bcrypt.hash('Demo@1234', 10);

    const user = await User.findOneAndUpdate(
      { email: demoEmail },
      {
        $set: {
          name: 'Demo User',
          email: demoEmail,
          passwordHash,
          role: 'USER',
          status: 'ACTIVE',
        },
      },
      { upsert: true, new: true }
    );

    console.log('[Seed] Seeding Wallet for Demo User (120 VEs)...');
    await Wallet.findOneAndUpdate(
      { userId: user._id },
      {
        $set: {
          balances: {
            VES: 120,
            INR: 0,
          },
        },
      },
      { upsert: true, new: true }
    );

    console.log('[Seed] Ensuring active initial StreakCycle for Demo User...');
    const existingActiveCycle = await StreakCycle.findOne({
      userId: user._id,
      status: 'ACTIVE',
    });

    if (!existingActiveCycle) {
      await StreakCycle.create({
        userId: user._id,
        cycleNumber: 1,
        status: 'ACTIVE',
        currentDay: 1,
        claimedDays: [],
        streakCount: 0,
        longestStreak: 0,
        startedAt: new Date(),
        resetNoticeAcknowledged: false,
      });
    }

    console.log('✅ [Seed] Database seeded successfully!');
    console.log('Credentials: demo@veloop.test / Demo@1234 (120 VEs)');

    if (options.exitOnComplete) {
      await disconnectDB();
      process.exit(0);
    }
  } catch (error) {
    console.error('❌ [Seed] Error during seeding:', error);
    if (options.exitOnComplete) {
      await disconnectDB();
      process.exit(1);
    }
    throw error;
  }
}

// Allow direct CLI execution
if (process.argv[1]?.endsWith('seed.js')) {
  seedDatabase();
}

export default seedDatabase;
