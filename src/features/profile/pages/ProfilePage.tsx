import './ProfilePage.css';
import { useState } from 'react';
import type { Nav } from '../../auth/components/AuthUI';
import { Icon } from '../../auth/components/AuthUI';
import { getSession, signOut } from '../../auth/components/mockAuth';
import { Action, Banner, Chip, InfoRow, Panel, Screen } from '../../shared/components/NextUI';
import { getDemoLocation, getDemoProfile, saveDemoProfile, type DemoProfile, districts } from '../../shared/lib/demoData';

export default function ProfilePage({navigate}:{navigate:Nav}){
 const account=getSession();
 const [editing,setEditing]=useState(false),[notice,setNotice]=useState('');
 const [profile,setProfile]=useState<DemoProfile>(account ? getDemoProfile(account) : {name:'',phone:'',email:'',detail:'',district:'Kandy'});
 if(!account)return null;
 const savedLocation=getDemoLocation(account);
 function update(key:keyof DemoProfile,v:string){setProfile(prev=>({...prev,[key]:v}))}
 function submit(){if(!account)return;if(profile.name.trim().length<2||!/^07\d{8}$/.test(profile.phone)){setNotice('Enter a name and a valid Sri Lankan mobile number (07XXXXXXXX).');return;}saveDemoProfile(account,profile);setEditing(false);setNotice('Your demo profile changes were saved on this device.');}
 return <Screen className="profile-reference-page" account={account} navigate={navigate} title="My Profile" subtitle="Your account, role and farm/business information in one place." image="/images/profile-banner-v2.webp" eyebrow="ACCOUNT & PERSONAL DETAILS" footer={<></>} cover={
   <div className="profile-cover">
    <img src="/images/profile-banner-v2.webp" alt="A smiling dairy farmer on a green Sri Lankan farm"/>
    <div className="profile-cover-title">{account.role === 'farmer' ? 'Farmer Profile' : 'My Profile'}<Icon name="leaf" size={19}/><span/></div>
    <svg className="profile-cover-wave" viewBox="0 0 1000 110" preserveAspectRatio="none" aria-hidden="true"><path fill="#8bce16" d="M0 5C250 130 430 120 680 55S900 30 1000 65V110H0Z"/><path fill="#008337" d="M0 35C220 145 440 125 700 78S900 40 1000 90V110H0Z"/></svg>
   </div>
  }>
  <Panel className="profile-overview" title="Profile overview" icon="user" action={<Chip tone="green">{account.role.toUpperCase()}</Chip>}>
   <div className="ml2-profile-head"><img className="ml2-profile-avatar" src="/images/profile-farmer.webp" alt="Dairy farmer portrait"/><div><h2>{profile.name}</h2><Chip tone="green"><Icon name="leaf" size={15}/>{account.role[0].toUpperCase()+account.role.slice(1)} account</Chip><p>{profile.detail || 'MilkLink member'}</p></div></div>
   {notice && <Banner tone={notice.startsWith('Enter')?'amber':'green'}><Icon name="info" size={17}/>{notice}</Banner>}
   {editing ? <div className="ml2-form">
    <label className="ml2-field">Full name<input value={profile.name} onChange={e=>update('name',e.target.value)}/></label>
    <div className="ml2-form-grid"><label className="ml2-field">Mobile number<input value={profile.phone} onChange={e=>update('phone',e.target.value)}/></label><label className="ml2-field">District<select value={profile.district} onChange={e=>update('district',e.target.value)}>{districts.map(d=><option key={d}>{d}</option>)}</select></label></div>
    <label className="ml2-field">{account.role==='farmer'?'Farm name':account.role==='buyer'?'Business / organization':'Details'}<input value={profile.detail} onChange={e=>update('detail',e.target.value)}/></label>
    <label className="ml2-field">Email address<input value={profile.email} onChange={e=>update('email',e.target.value)} type="email"/></label>
    <div className="ml2-action-row"><Action onClick={submit}><Icon name="check" size={16}/>Save changes</Action><Action secondary onClick={()=>{setEditing(false);setProfile(getDemoProfile(account));setNotice('')}}>Cancel</Action></div>
   </div> : <><InfoRow icon="user" label="Account name" value={profile.name}/><InfoRow icon="phone" label="Mobile number" value={profile.phone}/><InfoRow icon="mail" label="Email address" value={profile.email}/><InfoRow icon="building" label={account.role==='farmer'?'Farm': 'Organization / details'} value={profile.detail}/><InfoRow icon="pin" label="District" value={profile.district}/><Action className="ml2-action-block" onClick={()=>setEditing(true)}><Icon name="user" size={17}/> Edit profile</Action></>}
  </Panel>
  <details className="profile-preferences"><summary><Icon name="admin" size={24}/><span>Preferences &amp; tools</span><Icon name="chevron" size={20}/></summary><div className="profile-preferences-content"><InfoRow icon="pin" label="Location setup" value={savedLocation?`${savedLocation.district} · ${savedLocation.source.toUpperCase()}`:'Choose your farm / pickup area'} onClick={()=>navigate('/app/location')}/><InfoRow icon="wifi-off" label="Offline Sync Center" value="Review pending local changes" onClick={()=>navigate('/app/sync')}/><InfoRow icon="phone" label="Install MilkLink" value="Open like an app from your home screen" onClick={()=>navigate('/install')}/>
  <Action secondary className="ml2-action-block" onClick={()=>{signOut();navigate('/login')}}><Icon name="logout" size={17}/>Sign out</Action></div></details>
 </Screen>;
}
