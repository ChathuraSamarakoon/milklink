import type { MockAccount } from '../../auth/components/mockAuth';

export type DemoProfile = { name: string; phone: string; email: string; detail: string; district: string };
export type DemoLocation = { district: string; lat?: number; lng?: number; source: 'gps' | 'manual'; updatedAt: string };
export type DemoSyncItem = {
 id: string; kind: 'listing' | 'order' | 'collection'; title: string; meta: string;
 state: 'pending' | 'synced' | 'conflict'; createdAt: string;
 localQty?: number; serverQty?: number; note?: string;
};
export type DemoListing = { id:string; litres:number; price:number; date:string; status:'active' | 'expired' };
const key = (account: MockAccount, type:string) => `milklink-phase2-${type}-${account.id}`;
function read<T>(k:string, fallback:T):T {try { const v=localStorage.getItem(k); return v ? JSON.parse(v) as T : fallback; }catch{return fallback;}}
function write<T>(k:string,v:T){try{localStorage.setItem(k,JSON.stringify(v))}catch{/* optional browser storage */}}
export const districts = ['Colombo','Gampaha','Kalutara','Kandy','Matale','Nuwara Eliya','Galle','Matara','Hambantota','Anuradhapura','Polonnaruwa','Kurunegala','Puttalam','Badulla','Monaragala','Ratnapura','Kegalle','Jaffna','Kilinochchi','Mannar','Vavuniya','Mullaitivu','Trincomalee','Batticaloa','Ampara'];
export function getDemoProfile(account:MockAccount):DemoProfile {return read(key(account,'profile'),{name:account.name,phone:account.phone,email:account.email,detail:account.detail,district:'Kandy'});}
export function saveDemoProfile(account:MockAccount,value:DemoProfile){write(key(account,'profile'),value)}
export function getDemoLocation(account:MockAccount): DemoLocation | null {return read<DemoLocation|null>(key(account,'location'),null)}
export function saveDemoLocation(account:MockAccount, value:DemoLocation){write(key(account,'location'),value)}
export function sampleSyncItems(account:MockAccount):DemoSyncItem[]{
 const now=new Date().toISOString();
 return [
  {id:'sync-101',kind:'listing',title:'Milk listing updated',meta:'Available quantity • 65 L',state:'pending',createdAt:now,localQty:65},
  {id:'sync-102',kind:'order',title:'Order acceptance',meta:'Order #ML-2048 • reservation changed',state:'conflict',createdAt:now,localQty:50,serverQty:40,note:'Available milk has changed since this offline action was saved.'},
  {id:'sync-103',kind:'collection',title:'Collection recorded',meta:'Pickup #ML-2039 • 28 L',state:'synced',createdAt:now,localQty:28},
 ];
}
export function getSyncItems(account:MockAccount):DemoSyncItem[]{return read(key(account,'sync'),sampleSyncItems(account))}
export function saveSyncItems(account:MockAccount,values:DemoSyncItem[]){write(key(account,'sync'),values)}
export function demoListings(account:MockAccount):DemoListing[]{return read(key(account,'listings'),[
  {id:'L-1001',litres:85,price:190,date:'2026-11-24',status:'active'},
  {id:'L-1002',litres:45,price:200,date:'2026-11-25',status:'active'},
  {id:'L-0997',litres:40,price:185,date:'2026-11-19',status:'expired'},
]);}
export function saveDemoListings(account:MockAccount,values:DemoListing[]){write(key(account,'listings'),values)}
