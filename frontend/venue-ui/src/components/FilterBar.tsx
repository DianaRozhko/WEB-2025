import React from 'react';

export default function FilterBar({value,onChange}:{value:string,onChange:(v:string)=>void}){
  return (
    <select value={value} onChange={e=>onChange(e.target.value)}>
      <option value="">усі типи</option>
      <option value="football">football</option>
      <option value="tennis">tennis</option>
      <option value="basketball">basketball</option>
      <option value="other">other</option>
    </select>);
}
