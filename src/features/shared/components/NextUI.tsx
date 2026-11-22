import type { ReactNode } from 'react';
import { Brand, Icon, type IconName, type Nav, type Role } from '../../auth/components/AuthUI';
import type { MockAccount } from '../../auth/components/mockAuth';
import './NextUI.css';

export function Screen({ account, navigate, title, subtitle, image, theme, children, eyebrow, back, footer }: {
 account:MockAccount; navigate:Nav; title:string; subtitle:string; image:string; theme?:Role|'common'; children:ReactNode; eyebrow?:string; back?:string;footer?:ReactNode;
}) {
 const role=theme ?? account.role;
 return <main className={`ml2-root ml-theme-${role}`}>
  <div className="ml2-app">
   <header className="ml2-header">
    <button className="ml2-header-icon" aria-label="Back" onClick={()=>navigate(back ?? `/${account.role}`)}><Icon name="arrow-left" size={19}/></button>
    <Brand/>
    <button title="Profile" className="ml2-header-avatar" onClick={()=>navigate('/app/profile')}>{account.name[0]?.toUpperCase()||'M'}</button>
   </header>
   <div className="ml2-grid">
    <aside className="ml2-story" style={{backgroundImage:`linear-gradient(0deg,rgba(3,35,34,.80),transparent 60%),url(${image})`}}>
     <div className="ml2-story-overlay"><span className="ml2-story-pill">MILKLINK • FARM TO MARKET</span><h2>Better connections.<br/>Better opportunities.</h2><p>Simple, reliable dairy trading for farmers, buyers and collectors.</p></div>
    </aside>
    <div className="ml2-content">
     <div className="ml2-mobile-cover" style={{backgroundImage:`url(${image})`}} role="img" aria-label="MilkLink dairy-themed illustration"/>
     <div className="ml2-content-inner">
      <div className="ml2-eyebrow">{eyebrow ?? 'YOUR MILKLINK SPACE'}</div>
      <h1>{title}</h1><p className="ml2-subtitle">{subtitle}</p>
      {children}
      {footer ?? <p className="ml2-prototype-note"><Icon name="info" size={14}/> Interactive UI prototype · Mock data · No backend connected</p>}
     </div>
    </div>
   </div>
  </div>
 </main>;
}
export function Panel({title,icon,action,children, className=''}:{title:string;icon?:IconName;action?:ReactNode;children:ReactNode;className?:string}){return <section className={`ml2-panel ${className}`}><div className="ml2-panel-heading"><h2>{icon && <Icon name={icon} size={19}/>} {title}</h2>{action}</div>{children}</section>}
export function Action({children,onClick,secondary=false,disabled=false,className='',type='button'}:{children:ReactNode;onClick?:()=>void;secondary?:boolean;disabled?:boolean;className?:string;type?:'button'|'submit'}){return <button disabled={disabled} onClick={onClick} type={type} className={`ml2-action ${secondary?'ml2-secondary':''} ${className}`}>{children}</button>}
export function Chip({children,tone='neutral'}:{children:ReactNode;tone?:'neutral'|'green'|'blue'|'amber'|'red'}){return <span className={`ml2-chip ml2-chip-${tone}`}>{children}</span>}
export function InfoRow({icon,label,value,onClick}:{icon:IconName;label:string;value?:string;onClick?:()=>void}){return <button className="ml2-info-row" type="button" onClick={onClick} disabled={!onClick}><span className="ml2-info-icon"><Icon name={icon} size={19}/></span><span><strong>{label}</strong>{value&&<small>{value}</small>}</span>{onClick &&<Icon name="chevron" size={17}/>}</button>}
export function Banner({children,tone='green'}:{children:ReactNode;tone?:'green'|'amber'|'blue'}){return <div className={`ml2-banner ml2-banner-${tone}`}>{children}</div>}
export function BottomNav({navigate,active='Home'}:{navigate:Nav;active?:string}){
 const items:{label:string;icon:IconName;url:string}[]=[
  {label:'Home',icon:'home',url:'/farmer'},
  {label:'Listings',icon:'milk',url:'/farmer/listings'},
  {label:'Orders',icon:'cart',url:'/farmer/orders'},
  {label:'History',icon:'calendar',url:'/farmer/history'},
  {label:'Profile',icon:'user',url:'/app/profile'},
 ];
 return <nav className="ml2-bottom-nav" aria-label="Farmer navigation">{items.map(x=><button key={x.label} className={active===x.label?'ml2-active':''} onClick={()=>navigate(x.url)}><Icon name={x.icon} size={21}/><span>{x.label}</span></button>)}</nav>;
}
