import React from 'react';
import { Person, Role } from '../types';


interface Props {
role: Role;
setRole: (r: Role) => void;
staff: Person[];
drivers: Person[];
activeUser: string;
setActiveUser: (id: string) => void;
}


export default function RoleSwitcher({ role, setRole, staff, drivers, activeUser, setActiveUser }: Props) {
return (
<div className="flex items-center gap-2 text-sm">
<select
className="border border-slate-300 rounded-xl px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-slate-300"
value={role}
onChange={(e) => {
const next = e.target.value as Role;
setRole(next);
if (next === 'staff') setActiveUser(staff[0]?.id || 'u1');
if (next === 'officer') setActiveUser('officer');
if (next === 'driver') setActiveUser(drivers[0]?.id || 'd1');
}}
>
<option value="staff">Staff (Requester)</option>
<option value="officer">Fleet Officer</option>
<option value="driver">Driver</option>
</select>


<select className="border border-slate-300 rounded-xl px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-slate-300" value={activeUser} onChange={(e) => setActiveUser(e.target.value)}>
{role === 'staff' &&
staff.map((s) => (
<option key={s.id} value={s.id}>
{s.name}
</option>
))}
{role === 'driver' &&
drivers.map((d) => (
<option key={d.id} value={d.id}>
{d.name}
</option>
))}
{role === 'officer' && <option value="officer">Officer</option>}
</select>
</div>
);
}
