export default function VenueCard({v}:{v:any}){
  return(
  <div style={{border:'1px solid #ccc',padding:'1rem',borderRadius:8}}>
    <h3>{v.name}</h3>
    <p>{v.location}</p>
    <p><b>{v.type}</b></p>
  </div>);
}
