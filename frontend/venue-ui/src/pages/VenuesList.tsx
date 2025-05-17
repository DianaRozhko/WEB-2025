import { useEffect,useState } from 'react';
import { fetchVenues } from '../api/venueService';
import FilterBar from '../components/FilterBar';
import VenueCard from '../components/VenueCard';

export default function VenuesList(){
  const [venues,setVenues]=useState<any[]>([]);
  const [filter,setFilter]=useState('');

  useEffect(()=>{ fetchVenues().then(setVenues).catch(alert); },[]);

  const visible=filter?venues.filter(v=>v.type===filter):venues;

  return(
    <div style={{maxWidth:800,margin:'2rem auto'}}>
      <h2>Майданчики</h2>
      <FilterBar value={filter} onChange={setFilter}/>
      <div style={{display:'grid',gap:'1rem',marginTop:'1rem'}}>
        {visible.map(v=><VenueCard key={v.id} v={v}/>)}
      </div>
    </div>);
}
