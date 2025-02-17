import mongoose from 'mongoose';

const subscriptionSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Subscription name is required'],
    trim: true,
    minLength: 2,
    maxLength: 100,
  },
  price: {
    type: Number,
    required: [true, 'Subscription price is required'],
    min: [0, 'Price must be greater than 0']
  },
  currency: {
    type: String,
    enum: ['USD', 'EUR', 'GBP'],
    default: 'USD'
  },
  frequency: {
    type: String,
    enum: ['daily', 'weekly', 'monthly', 'yearly'],
    required: true,
  },
  category: {
    type: String,
    enum: ['sports', 'news', 'entertainment', 'lifestyle', 'technology', 'finance', 'politics', 'other'],
    required: true,
  },
  paymentMethod: {
    type: String,
    required: true,
    trim: true,
  },
  status: {
    type: String,
    enum: ['active', 'cancelled', 'expired'],
    default: 'active'
  },
  startDate: {
    type: Date,
    required: true,
    validate: {
      validator: function (value) {
        return value <= Date.now();
      },
      message: 'Start date must be in the past',
    }
  },
  renewalDate: {
    type: Date,
    validate: {
      validator: function (value) {
        return value > this.startDate;
      },
      message: 'Renewal date must be after the start date',
    }
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true,
  }
}, { timestamps: true });


// Define renewal periods for different subscription frequencies
const renewalPeriods = {
  daily: 1,
  weekly: 7,
  monthly: 30,
  yearly: 365,
};

// Function to calculate the next valid renewal date
function getNextRenewalDate(startDate, frequency) {
  let nextRenewalDate = new Date(startDate);

  // Move renewal date forward until it's in the future
  while (nextRenewalDate <= new Date()) {
    nextRenewalDate.setDate(nextRenewalDate.getDate() + renewalPeriods[frequency]);
  }

  return nextRenewalDate;
}

// Pre-save hook to calculate renewalDate and update status
subscriptionSchema.pre('save', function (next) {
  if (!this.renewalDate || this.renewalDate <= new Date()) {
    this.renewalDate = getNextRenewalDate(this.startDate, this.frequency);
  }

  // Update subscription status
  this.status = this.renewalDate < new Date() ? 'expired' : 'active';

  next();
});

// Function to schedule reminder while respecting Upstash QStash max delay
subscriptionSchema.methods.scheduleReminder = function () {
  let reminderDate = new Date(this.renewalDate);
  reminderDate.setDate(reminderDate.getDate() - 7); // 7 days before renewal

  const maxQstashDelay = 1000000; // Max QStash delay in seconds (~11.5 days)
  const currentTime = new Date();
  let delayInSeconds = (reminderDate - currentTime) / 1000;

  if (delayInSeconds > maxQstashDelay || delayInSeconds < 0) {
    console.warn("Reminder scheduling exceeds QStash limit. Adjusting...");

    // Set the reminder to the maximum allowed delay within QStash
    reminderDate = new Date();
    reminderDate.setSeconds(reminderDate.getSeconds() + maxQstashDelay - 10); // Slightly below the limit
  }

  console.log(`Reminder scheduled for: ${reminderDate.toISOString()}`);
  return reminderDate;
};


const Subscriptions = mongoose.model('Subscriptions', subscriptionSchema);

export default Subscriptions;
