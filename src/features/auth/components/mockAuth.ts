import type { Role } from './AuthUI';

export interface MockAccount { id: string; role: Role; name: string; email: string; phone: string; detail: string; salt?: string; passwordHash?: string; }
export interface DemoSession { account: MockAccount; }
const STORAGE_ACCOUNTS = 'milklink-demo-accounts-v1';
const STORAGE_SESSION = 'milklink-demo-session-v1';

export const sampleAccounts: { role: Role; name: string; email: string; phone: string; detail: string; password: string }[] = [
  { role: 'farmer', name: 'Nimal Perera', email: 'farmer@milklink.demo', phone: '0771234567', detail: 'Green Valley Dairy Farm', password: 'Demo@123' },
  { role: 'buyer', name: 'Kavindu Silva', email: 'buyer@milklink.demo', phone: '0772234567', detail: 'Kandy Dairy Shop', password: 'Demo@123' },
  { role: 'collector', name: 'Sampath Fernando', email: 'collector@milklink.demo', phone: '0773234567', detail: 'Milk pickup collector', password: 'Demo@123' },
  { role: 'admin', name: 'MilkLink Administrator', email: 'admin@milklink.demo', phone: '0774234567', detail: 'System administration', password: 'Demo@123' },
];
function storedAccounts(): MockAccount[] {
  try { const v = JSON.parse(localStorage.getItem(STORAGE_ACCOUNTS) || '[]'); return Array.isArray(v) ? v : []; } catch { return []; }
}
function saveAccounts(accounts: MockAccount[]) { localStorage.setItem(STORAGE_ACCOUNTS, JSON.stringify(accounts)); }
export function getSession(): MockAccount | null {
  try { const x = JSON.parse(sessionStorage.getItem(STORAGE_SESSION) || 'null'); return x?.role && x?.name ? x as MockAccount : null; } catch { return null; }
}
export function signOut() { sessionStorage.removeItem(STORAGE_SESSION); }
export function saveSession(account: MockAccount) { sessionStorage.setItem(STORAGE_SESSION, JSON.stringify(account)); }
async function hashPassword(password: string, salt: string): Promise<string> {
  const data = new TextEncoder().encode(`${salt}:${password}`);
  const hash = await crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(hash), b => b.toString(16).padStart(2, '0')).join('');
}
export async function registerMockAccount(profile: Omit<MockAccount,'id'|'salt'|'passwordHash'>, password: string) {
  const email = profile.email.trim().toLowerCase(); const phone = profile.phone.trim();
  const accounts = storedAccounts();
  if (accounts.some(a => (email && a.email === email) || a.phone === phone) || sampleAccounts.some(a => (email && a.email === email) || a.phone === phone)) {
    throw new Error('An account with this email or mobile number already exists.');
  }
  const salt = crypto.randomUUID();
  const passwordHash = await hashPassword(password, salt);
  const account: MockAccount = { ...profile, id: crypto.randomUUID(), email, phone, salt, passwordHash };
  saveAccounts([...accounts, account]);saveSession(account);return account;
}
export async function signInMock(identifier: string, password: string): Promise<MockAccount> {
  const key = identifier.toLowerCase().trim();
  const demo = sampleAccounts.find(a => a.email === key || a.phone === key);
  if (demo && demo.password === password) {
    const account: MockAccount = { id: `demo-${demo.role}`, role: demo.role, name: demo.name, email: demo.email, phone: demo.phone, detail: demo.detail };
    saveSession(account);return account;
  }
  const saved = storedAccounts().find(a => a.email === key || a.phone === key);
  if (saved?.salt && saved.passwordHash && await hashPassword(password, saved.salt) === saved.passwordHash) {
    saveSession(saved);return saved;
  }
  throw new Error('Incorrect email/mobile number or password. Try a demo account below.');
}
