import RegistrationForm from './RegistrationForm';
import type { Nav } from '../components/AuthUI';
export default function FarmerRegisterPage({navigate}:{navigate:Nav}) {return <RegistrationForm role="farmer" navigate={navigate}/>;}
