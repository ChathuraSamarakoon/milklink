import RegistrationForm from './RegistrationForm';
import type { Nav } from '../components/AuthUI';
export default function BuyerRegisterPage({navigate}:{navigate:Nav}) {return <RegistrationForm role="buyer" navigate={navigate}/>;}
