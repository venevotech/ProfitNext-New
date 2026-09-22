import { Order, SiteSettings, AffiliatePartner, WithdrawalRequest } from '../core/types.ts';

export async function forwardOrderToTelegram(order: Order, settings: SiteSettings): Promise<boolean> {
  const groupUrl = settings.telegramGroupLink || 'https://t.me/+9EvZ7JHTIK4zZTk1';
  const botToken = settings.telegramBotToken?.trim();
  const chatId = settings.telegramChatId?.trim();

  const msgHtml = `🛒 <b>নতুন কাস্টমার অর্ডার — ProfitNext</b>\n` +
    `━━━━━━━━━━━━━━━━━━\n` +
    `🆔 <b>Order ID:</b> #${order.id}\n` +
    `👤 <b>Customer:</b> ${order.customerName}\n` +
    `📱 <b>Mobile:</b> ${order.phone}\n` +
    (order.email ? `✉️ <b>Email:</b> ${order.email}\n` : '') +
    `📦 <b>Product:</b> ${order.productTitle}\n` +
    `💰 <b>Amount:</b> ৳${order.amount}\n` +
    `💳 <b>TrxID:</b> <code>${order.trxId}</code>\n` +
    `🎟️ <b>Affiliate Code:</b> ${order.affiliateCode || 'Direct'}\n` +
    `💵 <b>Commission:</b> ৳${order.commission || 0}\n` +
    `📅 <b>Date:</b> ${order.date}\n` +
    `━━━━━━━━━━━━━━━━━━\n` +
    `📢 <b>Group:</b> <a href="${groupUrl}">ProfitNext Telegram Group</a>`;

  if (botToken && chatId) {
    try {
      const res = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: chatId,
          text: msgHtml,
          parse_mode: 'HTML'
        })
      });
      const data = await res.json();
      return !!data.ok;
    } catch (err) {
      console.warn('[Telegram] Auto send error:', err);
    }
  }
  return false;
}

export async function forwardAffiliateToTelegram(aff: AffiliatePartner, settings: SiteSettings): Promise<boolean> {
  const groupUrl = settings.telegramGroupLink || 'https://t.me/+9EvZ7JHTIK4zZTk1';
  const botToken = settings.telegramBotToken?.trim();
  const chatId = settings.telegramChatId?.trim();

  const msgHtml = `💼 <b>নতুন অ্যাফিলিয়েট পার্টনার — ProfitNext</b>\n` +
    `━━━━━━━━━━━━━━━━━━\n` +
    `🆔 <b>Affiliate Code:</b> <code>${aff.code}</code>\n` +
    `👤 <b>Name:</b> ${aff.name}\n` +
    `📱 <b>Mobile:</b> ${aff.phone}\n` +
    `💳 <b>TrxID:</b> <code>${aff.trxId || 'Verified'}</code>\n` +
    `━━━━━━━━━━━━━━━━━━\n` +
    `📢 <b>Group:</b> <a href="${groupUrl}">ProfitNext Telegram Group</a>`;

  if (botToken && chatId) {
    try {
      const res = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: chatId,
          text: msgHtml,
          parse_mode: 'HTML'
        })
      });
      const data = await res.json();
      return !!data.ok;
    } catch (err) {
      console.warn('[Telegram] Auto send error:', err);
    }
  }
  return false;
}

export async function forwardWithdrawalToTelegram(wd: WithdrawalRequest, settings: SiteSettings): Promise<boolean> {
  const groupUrl = settings.telegramGroupLink || 'https://t.me/+9EvZ7JHTIK4zZTk1';
  const botToken = settings.telegramBotToken?.trim();
  const chatId = settings.telegramChatId?.trim();

  const msgHtml = `💸 <b>নতুন উইথড্র রিকোয়েস্ট — ProfitNext</b>\n` +
    `━━━━━━━━━━━━━━━━━━\n` +
    `🆔 <b>Request ID:</b> #${wd.id}\n` +
    `👤 <b>Name:</b> ${wd.name} (${wd.affiliateCode})\n` +
    `💰 <b>Amount:</b> ৳${wd.amount}\n` +
    `💳 <b>Method:</b> ${wd.method} (${wd.number})\n` +
    `━━━━━━━━━━━━━━━━━━\n` +
    `📢 <b>Group:</b> <a href="${groupUrl}">ProfitNext Telegram Group</a>`;

  if (botToken && chatId) {
    try {
      const res = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: chatId,
          text: msgHtml,
          parse_mode: 'HTML'
        })
      });
      const data = await res.json();
      return !!data.ok;
    } catch (err) {
      console.warn('[Telegram] Auto send error:', err);
    }
  }
  return false;
}
