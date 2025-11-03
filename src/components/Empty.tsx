import React from 'react';


export default function Empty({ text }: { text: string }) {
return (
<div className="rounded-2xl border border-dashed border-slate-300 p-8 text-center text-slate-500 bg-white">
{text}
</div>
);
}