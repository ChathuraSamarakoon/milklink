import { useState, type FormEvent } from 'react';
import { Button, DemoDisclaimer, Field, Icon, PageFrame, type Nav, type Role, type IconName } from '../components/AuthUI';
import { registerMockAccount } from '../components/mockAuth';

type FormKey = 'fullName' | 'farmName' | 'organization' | 'contactPerson' | 'email' | 'mobile' | 'district' | 'businessType' | 'vehicleNo' | 'password' | 'confirm';
type FormValues = Record<FormKey,string>;
const blank: FormValues = { fullName:'', farmName:'', organization:'', contactPerson:'', email:'', mobile:'', district:'', businessType:'', vehicleNo:'', password:'', confirm:'' };
const districts = ['Colombo','Gampaha','Kalutara','Kandy','Matale','Nuwara Eliya','Galle','Matara','Hambantota','Kurunegala','Puttalam','Anuradhapura','Polonnaruwa','Badulla','Monaragala','Ratnapura','Kegalle','Jaffna','Kilinochchi','Mannar','Mullaitivu','Vavuniya','Trincomalee','Batticaloa','Ampara'];
const businesses = ['Dairy shop','Hotel / Restaurant','Independent milk buyer','Milk collection business','Other'];
const assets: Record<string,string> = { farmer:'/images/farmer-registration.webp', buyer:'/images/buyer-registration.webp', collector:'/images/collector-registration.webp' };
const labels: Record<string,string> = { farmer:'Farmer', buyer:'Buyer', collector:'Collector' };

export default function RegistrationForm({ role, navigate }: { role: Exclude<Role,'admin'>; navigate: Nav }) {
  const [values, setValues] = useState<FormValues>(blank);
  const [errors, setErrors] = useState<Record<string,string>>({});
  const [agree,setAgree] = useState(false);
  const [showPassword,setShowPassword] = useState(false);
  const [submitting,setSubmitting] = useState(false);
  const [message,setMessage] = useState('');
  const change = (name: FormKey) => (value:string) => {setValues(v=>({...v,[name]:value}));setErrors(e=>({...e,[name]:''}));setMessage('');};
  const formField = (key:FormKey,label:string,icon:IconName,placeholder:string,required=true, type='text') => <Field label={label} icon={icon} placeholder={placeholder} value={values[key]} onChange={change(key)} required={required} type={type} error={errors[key]}/>;
  const selectField = (key: 'district' | 'businessType', label:string, options: string[]) => <label className="ml-field"><span className="ml-field-label">{label} <b>*</b></span><span className={`ml-field-shell ml-select-shell ${errors[key]?'ml-field-shell--error':''}`}><Icon name={key==='district'?'pin':'building'} size={20}/><select value={values[key]} required onChange={e=>change(key)(e.target.value)}><option value="">Select {label.toLowerCase()}</option>{options.map(v=><option key={v} value={v}>{v}</option>)}</select></span>{errors[key] && <span className="ml-field-error">{errors[key]}</span>}</label>;
  function validate(): Record<string,string> {
    const e: Record<string,string> = {};
    const required: FormKey[] = role==='farmer' ? ['fullName','farmName','mobile','district'] : role==='buyer' ? ['organization','contactPerson','mobile','email','businessType'] : ['fullName','mobile','district'];
    required.forEach(k=>{if(!values[k].trim())e[k]='This field is required.';});
    const normalized = values.mobile.replace(/[\s-]/g,'');
    if (normalized && !/^(?:0\d{9}|\+94\d{9})$/.test(normalized)) e.mobile='Enter a valid Sri Lankan mobile number.';
    if (values.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) e.email='Enter a valid email address.';
    if (values.password.length<8) e.password='Use at least 8 characters.';
    if (values.password !== values.confirm) e.confirm='Passwords do not match.';
    if (!agree)e.agree='Please agree to continue.';
    return e;
  }
  async function submit(event:FormEvent<HTMLFormElement>) {
    event.preventDefault();const err=validate();setErrors(err);if(Object.keys(err).length){setMessage('Check the highlighted fields and try again.');return;}
    setSubmitting(true);setMessage('');
    try {
      const name = role==='buyer' ? values.contactPerson.trim() : values.fullName.trim();
      const detail = role==='farmer' ? values.farmName.trim() : role==='buyer' ? values.organization.trim() : `${values.district} collector${values.vehicleNo ? ' · '+values.vehicleNo : ''}`;
      await registerMockAccount({role,name,email:values.email,phone:values.mobile,detail},values.password);
      navigate(`/${role}`);
    } catch(error) {setMessage(error instanceof Error ? error.message : 'Could not create your demo account.');}
    finally {setSubmitting(false);}
  }
  return <PageFrame image={assets[role]} theme={role} navigate={navigate} back="/register" pageClass="ml-registration-page"><section className="ml-sheet ml-registration-sheet">
    <span className="ml-section-eyebrow"><Icon name={role === 'buyer' ? 'cart' : role === 'collector' ? 'truck' : role} size={15}/> JOIN AS A {labels[role].toUpperCase()}</span>
    <h1>{labels[role]} Registration</h1>
    <p className="ml-lead">{role==='farmer'?'Create your farm profile and start listing fresh milk.':role==='buyer'?'Connect your business with nearby dairy farmers.':'Get assigned to milk pickups and record collections.'}</p>
    <div className="ml-progress-steps"><span className="active"/><span className="active"/><span/></div>
    <form className="ml-form ml-register-form" onSubmit={submit} noValidate>
      {role==='farmer' && <>{formField('fullName','Full Name','user','e.g. Nimal Perera')}{formField('farmName','Farm Name','home','e.g. Green Valley Farm')}</>}
      {role==='buyer' && <>{formField('organization','Organization / Shop Name','building','e.g. Kandy Dairy Shop')}{formField('contactPerson','Contact Person','user','e.g. Kavindu Silva')}</>}
      {role==='collector' && <>{formField('fullName','Full Name','user','e.g. Sampath Fernando')}{formField('vehicleNo','Vehicle Number (optional)','truck','e.g. CP-1234',false)}</>}
      {formField('mobile','Mobile Number','phone','07XXXXXXXX')}
      {formField('email',`Email Address${role==='buyer'?'':' (optional)'}`,'mail','you@example.com',role==='buyer','email')}
      {role==='buyer'?selectField('businessType','Business Type',businesses):selectField('district','District / Service Area',districts)}
      <div className="ml-password-divider"><Icon name="shield" size={16}/> Secure account details</div>
      <Field label="Password" icon="lock" placeholder="Minimum 8 characters" required value={values.password} onChange={change('password')} type={showPassword?'text':'password'} error={errors.password} autoComplete="new-password"><button className="ml-eye-btn" type="button" onClick={()=>setShowPassword(v=>!v)} aria-label={showPassword?'Hide password':'Show password'}><Icon name={showPassword?'eye-off':'eye'} size={19}/></button></Field>
      {formField('confirm','Confirm Password','lock','Re-enter password',true,'password')}
      <label className="ml-checkbox-line"><input type="checkbox" checked={agree} onChange={e=>{setAgree(e.target.checked);setErrors(x=>({...x,agree:''}));}}/><span>I agree to use this MilkLink demonstration for testing purposes.</span></label>
      {errors.agree && <p className="ml-field-error">{errors.agree}</p>}
      {message && <div className="ml-alert ml-alert--error" role="alert">{message}</div>}
      <Button type="submit" disabled={submitting}>{submitting?'Creating account…':`Create ${labels[role]} Account`} <Icon name="arrow" size={19}/></Button>
    </form>
    <p className="ml-switch-auth">Already have an account? <button onClick={() => navigate('/login')}>Login</button></p>
    <DemoDisclaimer/>
  </section></PageFrame>;
}
