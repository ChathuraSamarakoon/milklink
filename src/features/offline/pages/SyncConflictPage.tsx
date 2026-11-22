import { useState } from 'react';
import { Icon, type Nav } from '../../auth/components/AuthUI';
import { getSession } from '../../auth/components/mockAuth';
import { Action, Banner, Chip, Panel, Screen } from '../../shared/components/NextUI';
import { getSyncItems, saveSyncItems } from '../../shared/lib/demoData';

export default function SyncConflictPage({navigate,id}:{navigate:Nav;id:string}){
 const account=getSession();
 const record=account?getSyncItems(account).find(r=>r.id===id):undefined;
 const [choice,setChoice]=useState<'server'|'local'|null>(null);
 const [message,setMessage]=useState('');
 if(!account)return null;
 function resolve(){if(!record||!choice)return;const items=getSyncItems(account);const next=items.map(r=>r.id===record.id?{...r,state:choice==='local'?'pending' as const:'synced' as const,note:choice==='local'?'Local operation re-queued for review (demo only).':'Server value selected in local demo.'}:r);saveSyncItems(account,next);setMessage(choice==='server'?'Sample server value chosen.':'Sample local change returned to the pending queue.');}
 return <Screen account={account} navigate={navigate} title="Sync Conflict Detail" subtitle="Review different values and choose how this demo record should be handled." image="/images/sync-conflict.webp" eyebrow="DATA SAFETY" back="/app/sync">
  {!record ? <Panel title="Record not found" icon="info"><p className="ml2-notice">This conflict is not available. Open Sync Center to review the local queue.</p><Action onClick={()=>navigate('/app/sync')}>Back to Sync Center</Action></Panel> : <>
   <Banner tone="amber"><Icon name="info" size={18}/>An offline action may conflict with current server records. In the real application, the server is the source of truth.</Banner>
   <Panel title="Conflicting record" icon="milk" action={<Chip tone={record.state==='conflict'?'red':'green'}>{record.state.toUpperCase()}</Chip>}><div className="ml2-sync-item" style={{marginBottom:14}}><span className="ml2-info-icon"><Icon name="milk"/></span><span className="ml2-sync-copy"><strong>{record.title}</strong><small>{record.id.toUpperCase()} · {record.meta}</small></span></div><p className="ml2-notice">{record.note ?? 'This record has been reviewed.'}</p></Panel>
   <Panel title="Compare changes" icon="shield"><div className="ml2-comparison"><div className="ml2-compare-col"><strong>Local version</strong><small>Saved on your device</small><b>{record.localQty ?? 50} L</b><span>Requested / available milk</span></div><div className="ml2-compare-col"><strong>Server version</strong><small>Simulated remote state</small><b>{record.serverQty ?? 40} L</b><span>Current recorded quantity</span></div></div></Panel>
   <Panel title="Choose a demo resolution" icon="check"><div className="ml2-choice-list"><button className={`ml2-choice ${choice==='server'?'selected':''}`} onClick={()=>setChoice('server')}><Icon name="shield" size={22}/><span>Use sample server data<small>Mark local conflict resolved in this demo</small></span></button><button className={`ml2-choice ${choice==='local'?'selected':''}`} onClick={()=>setChoice('local')}><Icon name="milk" size={22}/><span>Keep local change pending<small>Re-queue for a future server validation</small></span></button></div><p className="ml2-notice">Real synchronization must never allow this choice to overwrite server orders or reserved quantities without server-side checks.</p></Panel>
   {message&&<Banner><Icon name="check" size={17}/>{message} <button onClick={()=>navigate('/app/sync')} style={{marginLeft:'auto',border:0,background:'transparent',color:'inherit',fontWeight:900}}>View queue →</button></Banner>}
   <Action className="ml2-action-block" disabled={!choice||record.state!=='conflict'} onClick={resolve}><Icon name="check" size={18}/>Confirm demo choice</Action>
  </>}
 </Screen>;
}
