import RegistrationForm from './RegistrationForm';
import type { Nav } from '../components/AuthUI';
export default function CollectorRegisterPage({navigate}:{navigate:Nav}) {return <RegistrationForm role="collector" navigate={navigate}/>;}
