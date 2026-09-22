import { AffiliatePartner, CouponItem, SiteSettings } from '../core/types.ts';

export interface DiscountResult {
  discountAmount: number;
  finalPrice: number;
  appliedCode: string;
  source: 'affiliate' | 'coupon' | 'none';
}

/**
 * Pure function: calculates customer discount based on code
 */
export function calculateDiscount(
  basePrice: number,
  code: string,
  affiliates: AffiliatePartner[],
  coupons: CouponItem[],
  settings: SiteSettings
): DiscountResult {
  const cleanCode = (code || '').trim().toUpperCase();
  if (!cleanCode) {
    return { discountAmount: 0, finalPrice: basePrice, appliedCode: '', source: 'none' };
  }

  // Check if matching active affiliate code
  const matchedAff = affiliates.find(a => a.code.toUpperCase() === cleanCode && a.status === 'approved');
  if (matchedAff) {
    const pct = settings.customerDiscountPercent || 10;
    const discount = Math.round((basePrice * pct) / 100);
    return {
      discountAmount: discount,
      finalPrice: Math.max(0, basePrice - discount),
      appliedCode: matchedAff.code,
      source: 'affiliate'
    };
  }

  // Check coupon list
  const matchedCoupon = coupons.find(c => c.code.toUpperCase() === cleanCode && c.active);
  if (matchedCoupon) {
    let discount = 0;
    if (matchedCoupon.type === 'percent') {
      discount = Math.round((basePrice * matchedCoupon.amount) / 100);
    } else {
      discount = matchedCoupon.amount;
    }
    return {
      discountAmount: discount,
      finalPrice: Math.max(0, basePrice - discount),
      appliedCode: matchedCoupon.code,
      source: 'coupon'
    };
  }

  return { discountAmount: 0, finalPrice: basePrice, appliedCode: '', source: 'none' };
}

/**
 * Pure function: calculates affiliate commission split (L1 and L2)
 */
export function calculateCommissions(
  paidAmount: number,
  affiliateCode: string,
  affiliates: AffiliatePartner[],
  settings: SiteSettings
): { l1Commission: number; l2Commission: number; l1AffiliateId?: string; l2PartnerId?: string } {
  if (!affiliateCode || affiliateCode === 'Direct') {
    return { l1Commission: 0, l2Commission: 0 };
  }

  const clean = affiliateCode.toUpperCase();
  const aff = affiliates.find(a => a.code.toUpperCase() === clean);
  if (!aff) {
    return { l1Commission: 0, l2Commission: 0 };
  }

  const l1Rate = settings.l1Rate || 20;
  const l1Commission = Math.round((paidAmount * l1Rate) / 100);

  let l2Commission = 0;
  if (settings.mlmEnabled && aff.partnerId && aff.partnerId !== 'direct') {
    const l2Rate = settings.l2Rate || 5;
    l2Commission = Math.round((paidAmount * l2Rate) / 100);
  }

  return {
    l1Commission,
    l2Commission,
    l1AffiliateId: aff.id,
    l2PartnerId: aff.partnerId
  };
}
