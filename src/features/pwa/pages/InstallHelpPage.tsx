import { useEffect, useState } from 'react';
import { Icon, type Nav } from '../../auth/components/AuthUI';
import { getSession } from '../../auth/components/mockAuth';
import { Action, Banner, Panel, Screen } from '../../shared/components/NextUI';

type InstallEvent = Event & { prompt:()=>Promise<void>; userChoice:Promise<{outcome:string}> };
let capturedInstallEvent:InstallEvent|null=null;
// Capture the install event at app startup, before users navigate to this page.
if (typeof window !== 'undefined') window.addEventListener('beforeinstallprompt', e => {e.preventDefault();capturedInstallEvent=e as InstallEvent});
export default function InstallHelpPage({navigate}:{navigate:Nav}){
 const account=getSession();
 const [event,setEvent]=useState<InstallEvent|null>(capturedInstallEvent);
 const [result,setResult]=useState('');
 useEffect(()=>{const handle=(e:Event)=>{e.preventDefault();capturedInstallEvent=e as InstallEvent;setEvent(e as InstallEvent)};window.addEventListener('beforeinstallprompt',handle);return()=>window.removeEventListener('beforeinstallprompt',handle)},[]);
 if(!account)return null;
 const isIOS=/iphone|ipad|ipod/i.test(navigator.userAgent);
 const installed=window.matchMedia?.('(display-mode: standalone)').matches ?? false;
 async function install(){if(!event){setResult('Use your browser menu instructions below to add MilkLink to your home screen.');return;}try{await event.prompt();const choice=await event.userChoice;setResult(choice.outcome==='accepted'?'Install request accepted by the browser.':'Install request dismissed.');capturedInstallEvent=null;setEvent(null)}catch{setResult('Browser install prompt unavailable. Follow the steps below.')}}
 return <Screen account={account} navigate={navigate} title="Install MilkLink" subtitle="Keep MilkLink one tap away on your phone or desktop." image="/images/install-pwa.webp" eyebrow="YOUR INSTALLABLE PWA" back="/app/profile">
  <div className="ml2-install-hero"><span className="ml2-install-logo"><Icon name="drop" size={31}/></span><span><strong>MilkLink · Farm to Market</strong><small>Responsive PWA designed for dairy farmers, buyers and collectors.</small></span></div>
  <Panel title="Why install?" icon="phone"><div className="ml2-info-row" style={{cursor:'default'}}><span className="ml2-info-icon"><Icon name="home"/></span><span><strong>Quick app access</strong><small>Launch from your device home screen.</small></span></div><div className="ml2-info-row" style={{cursor:'default'}}><span className="ml2-info-icon"><Icon name="wifi-off"/></span><span><strong>Offline-ready design</strong><small>Farmer and collector offline actions require a future real sync integration.</small></span></div><div className="ml2-info-row" style={{cursor:'default'}}><span className="ml2-info-icon"><Icon name="shield"/></span><span><strong>Secure browser capabilities</strong><small>HTTPS or localhost is required for supported PWA features.</small></span></div></Panel>
  <Panel title="Install on your device" icon="phone"><ol className="ml2-steps">{isIOS?<><li>Open MilkLink in Safari.</li><li>Tap Share and select <strong>Add to Home Screen</strong>.</li><li>Confirm the MilkLink name and tap <strong>Add</strong>.</li></>:<><li>Open MilkLink in your browser.</li><li>Use the browser's <strong>Install app</strong> button or menu, if available.</li><li>Confirm the install and open it from your home screen.</li></>}</ol></Panel>
  {installed&&<Banner><Icon name="check" size={18}/>MilkLink appears to be running in installed app mode.</Banner>}
  {result&&<Banner tone="blue"><Icon name="info" size={18}/>{result}</Banner>}
  <Action className="ml2-action-block" disabled={installed} onClick={install}><Icon name="drop" size={17}/>{installed?'Already installed':event?'Install MilkLink':'Show install instructions'}</Action>
  <p className="ml2-notice">Browser installation availability depends on the device and browser. The icon/manifest and app-shell service worker are provided; real offline data synchronization remains a later integration.</p>
 </Screen>;
}
