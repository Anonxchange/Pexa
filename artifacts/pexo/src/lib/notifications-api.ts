import { getSupabase } from "@/lib/supabase";
import { getRealtimeCryptoPrices } from "@/lib/crypto-prices";

const NOTIFICATION_PREFS_STORAGE_KEY = "pexly-notif-prefs";

function getLocalNotificationPrefs(): Record<string, boolean> {
  try {
    const raw = localStorage.getItem(NOTIFICATION_PREFS_STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

export interface Notification {
  id: string;
  user_id: string;
  title: string;
  message: string;
  type: 'trade' | 'price_alert' | 'system' | 'payment' | 'announcement' | 'account_change';
  read: boolean;
  created_at: string;
  metadata?: Record<string, any>;
}

export interface Announcement {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  image_url: string | null;
  author: string;
  read_time: string;
  created_at: string;
}

export async function getNotifications(): Promise<Notification[]> {
  try {
    const supabase = await getSupabase();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return [];

    const { data, error } = await supabase
      .from('notifications')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(50);

    if (error) { console.error('Error fetching notifications:', error); return []; }
    return data || [];
  } catch {
    return [];
  }
}

export async function markAsRead(notificationId: string): Promise<boolean> {
  try {
    const supabase = await getSupabase();
    const { error } = await supabase
      .from('notifications')
      .update({ read: true })
      .eq('id', notificationId);
    if (error) { console.error('Error marking notification as read:', error); return false; }
    return true;
  } catch {
    return false;
  }
}

export async function markAllAsRead(): Promise<boolean> {
  try {
    const supabase = await getSupabase();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return false;

    const { error } = await supabase
      .from('notifications')
      .update({ read: true })
      .eq('user_id', user.id)
      .eq('read', false);

    if (error) { console.error('Error marking all as read:', error); return false; }
    return true;
  } catch {
    return false;
  }
}

export async function deleteNotification(notificationId: string): Promise<boolean> {
  try {
    const supabase = await getSupabase();
    const { error } = await supabase.from('notifications').delete().eq('id', notificationId);
    if (error) { console.error('Error deleting notification:', error); return false; }
    return true;
  } catch {
    return false;
  }
}

export async function createNotification(
  userId: string,
  title: string,
  message: string,
  type: Notification['type'],
  metadata?: Record<string, any>
): Promise<boolean> {
  try {
    const supabase = await getSupabase();
    const { error } = await supabase.from('notifications').insert({ user_id: userId, title, message, type, read: false, metadata });
    if (error) { console.error('Error creating notification:', error); return false; }
    return true;
  } catch {
    return false;
  }
}

export async function createMessageNotification(
  recipientId: string,
  senderId: string,
  senderName: string,
  senderAvatar: string | null,
  messageContent: string,
  tradeId: string,
  tradeStatus?: string,
  counterpartCountry?: string
): Promise<boolean> {
  try {
    const supabase = await getSupabase();

    const { data: existingNotification } = await supabase
      .from('notifications')
      .select('*')
      .eq('user_id', recipientId)
      .eq('metadata->>tradeId', tradeId)
      .eq('metadata->>messageType', 'chat')
      .single();

    if (existingNotification) {
      const newCount = (existingNotification.metadata?.messageCount || 1) + 1;
      const { error } = await supabase
        .from('notifications')
        .update({
          message: `${newCount} new messages`,
          read: false,
          created_at: new Date().toISOString(),
          metadata: {
            ...existingNotification.metadata,
            messageCount: newCount,
            lastMessage: messageContent,
            lastMessageAt: new Date().toISOString(),
            tradeStatus: tradeStatus || existingNotification.metadata?.tradeStatus,
            counterpart_country: counterpartCountry || existingNotification.metadata?.counterpart_country,
          },
        })
        .eq('id', existingNotification.id);
      if (error) { console.error('Error updating message notification:', error); return false; }
    } else {
      const { error } = await supabase.from('notifications').insert({
        user_id: recipientId,
        title: senderName,
        message: messageContent,
        type: 'trade',
        read: false,
        metadata: {
          tradeId,
          counterpart_name: senderName,
          counterpart_avatar: senderAvatar,
          counterpart_country: counterpartCountry || 'Nigeria',
          url: `/trade/${tradeId}`,
          messageType: 'chat',
          messageCount: 1,
          lastMessage: messageContent,
          lastMessageAt: new Date().toISOString(),
          tradeStatus: tradeStatus || 'active',
        },
      });
      if (error) { console.error('Error creating message notification:', error); return false; }
    }
    return true;
  } catch {
    return false;
  }
}

export function subscribeToNotifications(
  userId: string,
  callback: (notification: Notification) => void
): () => void {
  let cleanup: (() => void) | null = null;

  getSupabase()
    .then((supabase) => {
      const channel = supabase
        .channel('notifications')
        .on(
          'postgres_changes',
          { event: 'INSERT', schema: 'public', table: 'notifications', filter: `user_id=eq.${userId}` },
          (payload) => { callback(payload.new as Notification); }
        )
        .subscribe();

      cleanup = () => { supabase.removeChannel(channel); };
    })
    .catch(() => {
      // Supabase not configured — realtime disabled, notifications still work from initial fetch
    });

  return () => { cleanup?.(); };
}

export async function createAccountChangeNotification(
  userId: string,
  changeType: 'password_changed' | '2fa_enabled' | '2fa_disabled' | 'email_changed' | 'phone_changed' | 'login_attempt',
  metadata?: Record<string, any>
): Promise<boolean> {
  const changeMessages: Record<string, { title: string; message: string }> = {
    password_changed:  { title: 'Password Changed',                    message: 'Your account password has been successfully changed.' },
    '2fa_enabled':     { title: 'Two-Factor Authentication Enabled',   message: 'Two-factor authentication has been enabled on your account for added security.' },
    '2fa_disabled':    { title: 'Two-Factor Authentication Disabled',  message: 'Two-factor authentication has been disabled on your account.' },
    email_changed:     { title: 'Email Address Changed',               message: 'Your account email address has been updated.' },
    phone_changed:     { title: 'Phone Number Changed',                message: 'Your account phone number has been updated.' },
    login_attempt:     { title: 'New Sign-In Detected',                message: 'Your account was accessed from a new location or device.' },
  };
  const change = changeMessages[changeType] || { title: 'Account Changed', message: 'Your account has been modified.' };

  try {
    const supabase = await getSupabase();
    const { error } = await supabase.from('notifications').insert({
      user_id: userId, title: change.title, message: change.message,
      type: 'system', read: false, metadata: { changeType, notificationSubtype: 'account_change', ...metadata },
    });
    if (error) { console.error('Error creating account change notification:', error); return false; }
    return true;
  } catch {
    return false;
  }
}

export async function sendCoinReceivedNotification(
  userId: string,
  tx: { id: string; crypto_symbol: string; amount: number; type: string; tx_hash?: string | null; from_address?: string | null }
): Promise<void> {
  try {
    const supabase = await getSupabase();

    const prefs = getLocalNotificationPrefs();
    if (prefs && prefs.transaction_updates === false) return;

    const amount = Number(tx.amount);
    const symbol = tx.crypto_symbol?.toUpperCase() ?? '';
    const formattedAmount = amount < 0.0001
      ? amount.toExponential(4)
      : amount.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 8 });

    const sourceLabel: Record<string, string> = { deposit: 'external transfer', swap: 'swap', escrow_release: 'completed trade' };
    const source = sourceLabel[tx.type] ?? 'transfer';

    const message = tx.from_address
      ? `${formattedAmount} ${symbol} received from ${tx.from_address.slice(0, 6)}…${tx.from_address.slice(-4)} via ${source}.`
      : `${formattedAmount} ${symbol} received via ${source}.`;

    await supabase.from('notifications').insert({
      user_id: userId, title: `${formattedAmount} ${symbol} Received`, message,
      type: 'payment', read: false,
      metadata: { transactionId: tx.id, crypto_symbol: symbol, amount, txType: tx.type, tx_hash: tx.tx_hash ?? null, from_address: tx.from_address ?? null, url: '/wallet' },
    });
  } catch {
    // Never block the calling flow
  }
}

export async function sendLoginNotificationIfEnabled(
  userId: string,
  deviceInfo: { browser: string; os: string; deviceName: string },
  ipAddress: string,
  country = '',
  isp = ''
): Promise<void> {
  try {
    const supabase = await getSupabase();

    const prefs = getLocalNotificationPrefs();
    if (prefs && prefs.login_notifications === false) return;

    const now = new Date();
    const timeStr = now.toLocaleString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit', hour12: true });

    // Build location string: "Nigeria, Airtel Nigeria, 102.89.x.x" etc.
    const locationParts: string[] = [];
    if (country) locationParts.push(country);
    if (isp && isp !== country) locationParts.push(isp);
    if (ipAddress && ipAddress !== 'unknown') locationParts.push(ipAddress);
    const locationStr = locationParts.length > 0 ? ` from ${locationParts.join(', ')}` : '';

    const message = `Signed in on ${deviceInfo.deviceName} via ${deviceInfo.browser} (${deviceInfo.os})${locationStr}. ${timeStr}`;

    await supabase.from('notifications').insert({
      user_id: userId,
      title: 'New Sign-In to Your Account',
      message,
      type: 'system',
      read: false,
      metadata: {
        changeType: 'login_attempt',
        notificationSubtype: 'account_change',
        browser: deviceInfo.browser,
        os: deviceInfo.os,
        deviceName: deviceInfo.deviceName,
        ipAddress,
        country,
        isp,
        signedInAt: now.toISOString(),
      },
    });
  } catch {
    // Never block the auth flow
  }
}

// ─── Market Movers ───────────────────────────────────────────────────────────
// Fires once per 24h per user (localStorage gate) when market_movers pref is on.
// Picks ONE random coin from top gainers / losers / trending and inserts a single
// price_alert notification styled like a news flash (Bybit-style).
// Uses the app's shared crypto price feed for market-mover notifications.

const COIN_NAMES: Record<string, string> = {
  BTC:'Bitcoin', ETH:'Ethereum', BNB:'BNB', SOL:'Solana', XRP:'XRP',
  DOGE:'Dogecoin', ADA:'Cardano', AVAX:'Avalanche', DOT:'Polkadot',
  MATIC:'Polygon', LINK:'Chainlink', LTC:'Litecoin', UNI:'Uniswap',
  ATOM:'Cosmos', NEAR:'NEAR Protocol', APT:'Aptos', ARB:'Arbitrum',
  OP:'Optimism', PEPE:'Pepe', WIF:'dogwifhat', TON:'Toncoin',
  SUI:'Sui', INJ:'Injective', TIA:'Celestia', NOT:'Notcoin',
};

function mmCoinName(sym: string) { return COIN_NAMES[sym.toUpperCase()] || sym; }

function mmFmtPrice(p: number) {
  if (p >= 1000) return `$${p.toLocaleString('en-US', { maximumFractionDigits: 2 })}`;
  if (p >= 1)    return `$${p.toFixed(2)}`;
  if (p >= 0.01) return `$${p.toFixed(4)}`;
  return `$${p.toFixed(6)}`;
}

async function fetchMarketTickers() {
  const symbols = Object.keys(COIN_NAMES);
  const prices = await getRealtimeCryptoPrices(symbols);
  return Object.values(prices).map((price) => ({
    symbol: `${price.symbol.toUpperCase()}USDT`,
    lastPrice: String(price.current_price),
    priceChangePercent: String(price.price_change_percentage_24h),
    quoteVolume: String(price.total_volume),
  }));
}

export async function fetchAndCreateMarketMoversNotifications(userId: string): Promise<void> {
  try {
    const supabase = await getSupabase();

    // Respect the local preference; user_profiles has no notification_preferences column.
    const prefs = getLocalNotificationPrefs();
    if (prefs && prefs.market_movers === false) return;

    // ── Bybit-style catch-up model ───────────────────────────────────────────
    // On every app open, scan today + yesterday for missing slots and insert
    // any that are absent — with created_at backdated to the slot's scheduled
    // time. This means:
    //   • Notifications always show "8:00 AM" / "1:00 PM" / "8:00 PM",
    //     not the time the user happened to open the app.
    //   • A user who was offline all day opens the next morning and sees
    //     yesterday's 3 notifications timestamped correctly.
    //
    // Slot schedule (local time):  morning=08:00  afternoon=13:00  night=20:00
    // Dedup key: metadata.dateStr + metadata.slot (server-side via Supabase).

    type MMSlot = 'morning' | 'night';
    const SLOT_HOUR: Record<MMSlot, number> = { morning: 8, night: 20 };

    type SlotEntry = { dateStr: string; slot: MMSlot; scheduledAt: Date };

    const now = new Date();
    const pairsToCheck: SlotEntry[] = [];

    // 2 days back → yesterday → today — past first so they
    // appear in chronological order in the notifications list.
    for (let daysBack = 2; daysBack >= 0; daysBack--) {
      const day = new Date(now);
      day.setDate(day.getDate() - daysBack);
      const dateStr = day.toDateString(); // e.g. "Sun Jun 06 2026"

      for (const slot of (['morning', 'night'] as MMSlot[])) {
        const scheduled = new Date(day);
        scheduled.setHours(SLOT_HOUR[slot], 0, 0, 0);
        // Only include if the scheduled time has already passed
        if (scheduled <= now) pairsToCheck.push({ dateStr, slot, scheduledAt: scheduled });
      }
    }

    if (pairsToCheck.length === 0) return;

    // Fast local gate — skip pairs we already confirmed inserted this session
    const needed = pairsToCheck.filter(
      ({ dateStr, slot }) =>
        localStorage.getItem(`pexly_mm_${dateStr}_${slot}_${userId}`) !== 'sent'
    );
    if (needed.length === 0) return;

    // Server-side dedup — query last 3 days of price_alert rows
    const twoDaysAgo = new Date(now);
    twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);
    twoDaysAgo.setHours(0, 0, 0, 0);

    const { data: existing } = await supabase
      .from('notifications')
      .select('metadata, created_at')
      .eq('user_id', userId)
      .eq('type', 'price_alert')
      .gte('created_at', twoDaysAgo.toISOString());

    // Build "dateStr:slot" set — handle both new records (metadata.dateStr) and
    // old records without dateStr (fall back to created_at date).
    const sentSet = new Set<string>(
      (existing ?? []).map((r: any) => {
        const slot    = r.metadata?.slot    as string | undefined;
        if (!slot) return null;
        const dateStr = r.metadata?.dateStr as string | undefined
          ?? new Date(r.created_at as string).toDateString();
        return `${dateStr}:${slot}`;
      }).filter(Boolean) as string[]
    );

    const missing = needed.filter(({ dateStr, slot }) => !sentSet.has(`${dateStr}:${slot}`));
    if (missing.length === 0) {
      needed.forEach(({ dateStr, slot }) =>
        localStorage.setItem(`pexly_mm_${dateStr}_${slot}_${userId}`, 'sent')
      );
      return;
    }

    // Fetch market data once for all missing pairs
    const spotRaw = await fetchMarketTickers();

    if (spotRaw.length === 0) return;

    const coins = spotRaw
      .filter(t => {
        if (!t.symbol.endsWith('USDT')) return false;
        const vol = parseFloat(t.quoteVolume);
        const chg = parseFloat(t.priceChangePercent);
        return vol > 2_000_000 && Math.abs(chg) < 200;
      })
      .map(t => ({
        symbol: t.symbol.replace('USDT', ''),
        pair:   `${t.symbol.replace('USDT', '')}/USDT`,
        price:  parseFloat(t.lastPrice),
        change: parseFloat(t.priceChangePercent),
        volume: parseFloat(t.quoteVolume),
        isPerp: false,
      }));

    if (coins.length === 0) return;

    const byChange = [...coins].sort((a, b) => b.change - a.change);
    const gainers  = byChange.slice(0, 3);
    const losers   = byChange.slice(-3).reverse();
    const hot      = [...coins].sort((a, b) => b.volume - a.volume).slice(0, 3);

    type Entry = { title: string; message: string; metadata: Record<string, any> };
    const buildCandidates = (): Entry[] => [
      ...gainers.map(c => ({
        title:    `📈 Market Update: ${c.symbol} surges ${c.change.toFixed(1)}% today`,
        message:  `${mmCoinName(c.symbol)} is one of today's top performers, now trading at ${mmFmtPrice(c.price)} — a ${c.change.toFixed(1)}% gain in the last 24h. Tap to trade.`,
        metadata: { symbol: c.symbol, pair: c.pair, marketType: c.isPerp ? 'perp' : 'spot', priceChange: c.change, price: c.price, category: 'gainer' },
      })),
      ...losers.map(c => ({
        title:    `📉 Market Update: ${c.symbol} drops ${Math.abs(c.change).toFixed(1)}% today`,
        message:  `${mmCoinName(c.symbol)} has fallen ${Math.abs(c.change).toFixed(1)}% in the last 24h and is now at ${mmFmtPrice(c.price)}. Tap to view.`,
        metadata: { symbol: c.symbol, pair: c.pair, marketType: c.isPerp ? 'perp' : 'spot', priceChange: c.change, price: c.price, category: 'loser' },
      })),
      ...hot.map(c => ({
        title:    `🔥 Trending Now: ${c.symbol} is the talk of the market`,
        message:  `${mmCoinName(c.symbol)} is one of today's most actively traded assets, currently at ${mmFmtPrice(c.price)}${c.change >= 0 ? ` (+${c.change.toFixed(1)}%)` : ` (${c.change.toFixed(1)}%)`}. Tap to trade.`,
        metadata: { symbol: c.symbol, pair: c.pair, marketType: c.isPerp ? 'perp' : 'spot', priceChange: c.change, price: c.price, category: 'hot' },
      })),
    ];

    // Insert one notification per missing pair with backdated created_at
    for (const { dateStr, slot, scheduledAt } of missing) {
      const candidates = buildCandidates();
      const pick = candidates[Math.floor(Math.random() * candidates.length)];
      if (!pick) continue;

      await supabase.from('notifications').insert({
        user_id:    userId,
        title:      pick.title,
        message:    pick.message,
        type:       'price_alert',
        read:       false,
        metadata:   { ...pick.metadata, slot, dateStr },
        created_at: scheduledAt.toISOString(), // ← backdated: shows "8:00 AM" not app-open time
      });

      localStorage.setItem(`pexly_mm_${dateStr}_${slot}_${userId}`, 'sent');
    }
  } catch {
    // Never block the auth flow
  }
}
// ─────────────────────────────────────────────────────────────────────────────

export async function getAnnouncements(): Promise<Announcement[]> {
  try {
    const supabase = await getSupabase();
    const { data, error } = await supabase
      .from('blog_posts')
      .select('id, title, excerpt, content, category, image_url, author, read_time, created_at')
      .eq('category', 'Announcement')
      .order('created_at', { ascending: false })
      .limit(20);
    if (error) { console.error('Error fetching announcements:', error); return []; }
    return data || [];
  } catch {
    return [];
  }
}

export interface WalletTx {
  id: string;
  type: 'deposit' | 'withdrawal';
  crypto_symbol: string;
  amount: number;
  status: 'pending' | 'completed' | 'failed' | 'cancelled';
  tx_hash: string | null;
  from_address: string | null;
  to_address: string | null;
  created_at: string;
}

export async function getDeposits(): Promise<WalletTx[]> {
  try {
    const supabase = await getSupabase();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return [];
    const { data, error } = await supabase
      .from('wallet_transactions')
      .select('id, type, crypto_symbol, amount, status, tx_hash, from_address, to_address, created_at')
      .eq('user_id', user.id)
      .eq('type', 'deposit')
      .order('created_at', { ascending: false })
      .limit(50);
    if (error) { console.error('Error fetching deposits:', error); return []; }
    return (data || []) as WalletTx[];
  } catch {
    return [];
  }
}

export async function getWithdrawals(): Promise<WalletTx[]> {
  try {
    const supabase = await getSupabase();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return [];
    const { data, error } = await supabase
      .from('wallet_transactions')
      .select('id, type, crypto_symbol, amount, status, tx_hash, from_address, to_address, created_at')
      .eq('user_id', user.id)
      .eq('type', 'withdrawal')
      .order('created_at', { ascending: false })
      .limit(50);
    if (error) { console.error('Error fetching withdrawals:', error); return []; }
    return (data || []) as WalletTx[];
  } catch {
    return [];
  }
}

export function subscribeToAnnouncements(
  callback: (announcement: Announcement) => void
): () => void {
  let cleanup: (() => void) | null = null;

  getSupabase()
    .then((supabase) => {
      const channel = supabase
        .channel('announcements')
        .on(
          'postgres_changes',
          { event: 'INSERT', schema: 'public', table: 'blog_posts', filter: `category=eq.Announcement` },
          (payload) => { callback(payload.new as Announcement); }
        )
        .subscribe();
      cleanup = () => { supabase.removeChannel(channel); };
    })
    .catch(() => {});

  return () => { cleanup?.(); };
}
