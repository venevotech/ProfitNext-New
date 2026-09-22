export const ADMIN_CREDENTIALS = {
  username: 'Admin',
  password: '205515100'
};

export function isAdminLoggedIn(): boolean {
  try {
    return sessionStorage.getItem('profitnext_admin_logged') === 'true';
  } catch {
    return false;
  }
}

export function setAdminLoggedIn(status: boolean): void {
  try {
    if (status) sessionStorage.setItem('profitnext_admin_logged', 'true');
    else sessionStorage.removeItem('profitnext_admin_logged');
  } catch (err) {
    console.error(err);
  }
}

export function getActiveAffiliateId(): string | null {
  try {
    return sessionStorage.getItem('profitnext_aff_logged');
  } catch {
    return null;
  }
}

export function setActiveAffiliateId(id: string | null): void {
  try {
    if (id) sessionStorage.setItem('profitnext_aff_logged', id);
    else sessionStorage.removeItem('profitnext_aff_logged');
  } catch (err) {
    console.error(err);
  }
}

export function getActivePartnerId(): string | null {
  try {
    return sessionStorage.getItem('profitnext_partner_logged');
  } catch {
    return null;
  }
}

export function setActivePartnerId(id: string | null): void {
  try {
    if (id) sessionStorage.setItem('profitnext_partner_logged', id);
    else sessionStorage.removeItem('profitnext_partner_logged');
  } catch (err) {
    console.error(err);
  }
}
