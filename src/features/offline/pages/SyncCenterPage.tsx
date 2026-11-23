import { useEffect, useState } from 'react';
import { Icon, type Nav } from '../../auth/components/AuthUI';
import { getSession } from '../../auth/components/mockAuth';
import { Action, Banner, Chip, Panel, Screen } from '../../shared/components/NextUI';
import { getSyncItems, saveSyncItems, type DemoSyncItem } from '../../shared/lib/demoData';
export default function SyncCenterPage({navigate}:{navigate:Nav}){
 const account=getSession();
 const [records,setRecords]=useState<DemoSyncItem[]>(account?getSyncItems(account):[]);
 const [online,setOnline]=useState(navigator.onLine);
 const [message,setMessage]=useState('');
 useEffect(()=>{const update=()=>setOnline(navigator.onLine);window.addEventListener('online',update);window.addEventListener('offline',update);return()=>{window.removeEventListener('online',update);window.removeEventListener('offline',update)}},[]);
 if(!account)return null;
 const pending=records.filter(r=>r.state==='pending').length,conflicts=records.filter(r=>r.state==='conflict').length,synced=records.filter(r=>r.state==='synced').length;
 function runMockSync(id?:string){if(!account)return;if(!online){setMessage('You appear offline. This demo cannot simulate syncing until connected.');return;}const next=records.map(r=>r.state==='pending'&&(!id||r.id===id)?{...r,state:'synced' as const}:r);setRecords(next);saveSyncItems(account,next);setMessage('Demo queue updated locally. No records have been sent to a server.');}
 function addMock(){if(!account)return;const next=[{id:`sample-${Date.now()}`,kind:'listing' as const,title:'Milk listing edited (sample)',meta:'Available quantity updated',state:'pending' as const,createdAt:new Date().toISOString(),localQty:55},...records];setRecords(next);saveSyncItems(account,next);setMessage('A sample pending operation was added to local browser storage.');}
 return <Screen account={account} navigate={navigate} title="Offline Sync Center" subtitle="Review your locally queued updates, sync statuses and conflicts." image="/images/offline-sync.webp" eyebrow="OFFLINE-FIRST DEMO">
  <Banner tone={online?'green':'amber'}><Icon name={online?'check':'wifi-off'} size={18}/><span><strong>{online?'Internet connection detected':'You appear offline'}</strong><br/>Sync controls below are a frontend simulation. Backend synchronization is not connected yet.</span></Banner>
  <div className="ml2-metric-grid"><div className="ml2-metric"><span className="ml2-metric-icon"><Icon name="calendar"/></span><strong>{pending}</strong><span>Pending</span></div><div className="ml2-metric"><span className="ml2-metric-icon"><Icon name="check"/></span><strong>{synced}</strong><span>Synced demo</span></div><div className="ml2-metric"><span className="ml2-metric-icon"><Icon name="info"/></span><strong>{conflicts}</strong><span>Conflicts</span></div></div>
  <Panel title="Local operation queue" icon="milk" action={<Chip tone="blue">{records.length} records</Chip>}>
   <div className="ml2-sync-list">{records.length===0&&<p className="ml2-notice">No local operations yet.</p>}{records.map(r=><div className="ml2-sync-item" key={r.id}><span className="ml2-info-icon"><Icon name={r.kind==='listing'?'milk':r.kind==='collection'?'truck':'cart'} size={19}/></span><span className="ml2-sync-copy"><strong>{r.title}</strong><small>{r.meta}</small></span><Chip tone={r.state==='synced'?'green':r.state==='pending'?'amber':'red'}>{r.state}</Chip>{r.state==='conflict'?<button onClick={()=>navigate(`/app/sync/conflicts/${r.id}`)}>Review</button>:r.state==='pending'?<button onClick={()=>runMockSync(r.id)}>Retry</button>:null}</div>)}</div>
  </Panel>
  {message&&<Banner tone="blue"><Icon name="info" size={18}/>{message}</Banner>}
  <div className="ml2-action-row"><Action onClick={()=>runMockSync()} disabled={!online||pending===0}><Icon name="check" size={16}/>Simulate sync ({pending})</Action><Action secondary onClick={addMock}>+ Sample action</Action></div><p className="ml2-notice">Server-side conflict handling, IndexedDB outbox and real REST API transmission belong to the backend/offline integration phase. This screen demonstrates interface states only.</p>
 </Screen>;
}
