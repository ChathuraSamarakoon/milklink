import LocationMap from '../components/LocationMap';
import { useState } from 'react';
import type { Nav } from '../../auth/components/AuthUI';
import { Icon } from '../../auth/components/AuthUI';
import { getSession } from '../../auth/components/mockAuth';
import { Action, Banner, Chip, Panel, Screen } from '../../shared/components/NextUI';
import { districts, getDemoLocation, saveDemoLocation } from '../../shared/lib/demoData';

export default function LocationSetupPage({navigate}:{navigate:Nav}){
 const account=getSession();
 const prev=account?getDemoLocation(account):null;
 const [district,setDistrict]=useState(prev?.district||'Kandy');
 const [coord,setCoord]=useState<{lat:number;lng:number}|null>(prev?.lat!==undefined&&prev.lng!==undefined?{lat:prev.lat,lng:prev.lng}:null);
 const [busy,setBusy]=useState(false),[feedback,setFeedback]=useState('');
 if(!account)return null;
 function requestGPS(){if(!navigator.geolocation){setFeedback('GPS is not available in this browser. Choose a district manually.');return;}setBusy(true);setFeedback('');navigator.geolocation.getCurrentPosition(pos=>{setCoord({lat:pos.coords.latitude,lng:pos.coords.longitude});setBusy(false);setFeedback('Location permission granted. Confirm to save locally.');},()=>{setBusy(false);setFeedback('Location unavailable or permission denied. You can continue by selecting a district.');},{enableHighAccuracy:false,timeout:12000,maximumAge:30000});}
 function save(){if(!account)return;saveDemoLocation(account,{district,...(coord?coord:{}),source:coord?'gps':'manual',updatedAt:new Date().toISOString()});setFeedback('Location saved for this demo profile.');}
 return <Screen account={account} navigate={navigate} title="Location Setup" subtitle="Set the area used for location-aware farmer matching and pickup details." image="/images/location-landscape.webp" eyebrow="LOCATION & PRIVACY">
  <Banner tone="blue"><Icon name="pin" size={18}/>GPS access is optional. Your exact farm location is intended to be shared with an authorized buyer only after order acceptance.</Banner>
  <Panel title="Your location" icon="pin" action={<Chip tone={coord?'green':'blue'}>{coord?'GPS selected':'Manual area'}</Chip>}>
   <LocationMap district={district} coordinates={coord}/>
   <div className="ml2-form-grid"><label className="ml2-field">District<select value={district} onChange={e=>{setDistrict(e.target.value);setCoord(null)}}>{districts.map(d=><option key={d}>{d}</option>)}</select></label><label className="ml2-field">Coordinates<input readOnly value={coord?`${coord.lat.toFixed(4)}, ${coord.lng.toFixed(4)}`:'Not selected'} /></label></div>
   {feedback&&<p className="ml2-notice" role="status">{feedback}</p>}
   <div className="ml2-action-row" style={{marginTop:14}}><Action secondary disabled={busy} onClick={requestGPS}><Icon name="pin" size={17}/>{busy?'Checking GPS…':'Use my GPS'}</Action><Action onClick={save}><Icon name="check" size={17}/>Confirm location</Action></div>
  </Panel><Panel title="How we protect your location" icon="shield"><p className="ml2-notice">Buyers see approximate farm areas before their order is accepted. Precise location access must be restricted on the server when the API is implemented.</p></Panel>
 </Screen>;
}
