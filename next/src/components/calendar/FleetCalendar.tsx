"use client"
import React from 'react'
import FullCalendar from '@fullcalendar/react'
import timeGridPlugin from '@fullcalendar/timegrid'
import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin from '@fullcalendar/interaction'
import { Button } from '@/components/ui/button'

type EventInput = {
  id: string
  title: string
  start: string
  end: string
  status?: 'Booked' | 'InUse' | 'Completed'
}

export default function FleetCalendar({ events, initialDate }: { events: EventInput[]; initialDate?: string }) {
  const ref = React.useRef<FullCalendar | null>(null)
  const [title, setTitle] = React.useState<string>('')
  const [view, setView] = React.useState<'timeGridDay' | 'timeGridWeek' | 'dayGridMonth'>('timeGridWeek')

  const getApi = () => (ref.current as any)?.getApi?.()
  const onPrev = () => getApi()?.prev()
  const onNext = () => getApi()?.next()
  const onToday = () => getApi()?.today()
  const onView = (v: typeof view) => { getApi()?.changeView(v); setView(v) }

  return (
    <div className="fc-theme-ifrc rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="grid grid-cols-3 items-center gap-3 p-8 pb-4">
        <div className="flex items-center gap-2 justify-start">
          <Button variant="outline" size="sm" onClick={onPrev}>Prev</Button>
          <Button variant="outline" size="sm" onClick={onToday}>Today</Button>
          <Button variant="outline" size="sm" onClick={onNext}>Next</Button>
        </div>
        <div className="text-center text-base font-medium text-slate-900">{title}</div>
        <div className="flex items-center gap-2 justify-end">
          <Button variant={view==='timeGridDay'?'default':'outline'} size="sm" onClick={() => onView('timeGridDay')}>Day</Button>
          <Button variant={view==='timeGridWeek'?'default':'outline'} size="sm" onClick={() => onView('timeGridWeek')}>Week</Button>
          <Button variant={view==='dayGridMonth'?'default':'outline'} size="sm" onClick={() => onView('dayGridMonth')}>Month</Button>
        </div>
      </div>
      <div className="px-8 pb-8">
        <FullCalendar
          ref={ref as any}
          plugins={[timeGridPlugin, dayGridPlugin, interactionPlugin]}
          initialView="timeGridWeek"
          headerToolbar={false}
          height="auto"
          nowIndicator
          slotMinTime="06:00:00"
          slotMaxTime="22:00:00"
          events={events}
          eventClassNames={(arg) => {
            const s = (arg.event.extendedProps as any)?.status || (arg.event as any)._def?.extendedProps?.status || (arg.event as any).extendedProps?.status
            return s ? [`fc-status-${s}`] : []
          }}
          eventContent={(arg) => {
            const s = (arg.event.extendedProps as any)?.status
            const time = arg.timeText ? `<span class=\"fc-evt-time\">${arg.timeText}</span>` : ''
            return { html: `<div class=\"fc-evt\"><div class=\"fc-evt-title\">${time}<span class=\"fc-evt-text\">${arg.event.title}</span></div>${s ? `<span class=\"fc-evt-badge\">${s}</span>` : ''}</div>` }
          }}
          initialDate={initialDate}
          datesSet={(info) => { setTitle(info.view.title); setView(info.view.type as any) }}
          eventMouseEnter={(info) => {
            const ex: any = info.event.extendedProps || {}
            const rect = (info.el as HTMLElement).getBoundingClientRect()
            const html = `
              <div class="text-xs">
                <div><span class="font-medium">Vehicle:</span> ${info.event.title.split(' - ')[0]}</div>
                <div><span class="font-medium">Purpose:</span> ${info.event.title.split(' - ').slice(1).join(' - ')}</div>
                <div><span class="font-medium">Status:</span> ${ex.status || ''}</div>
                <div><span class="font-medium">Driver:</span> ${ex.driver || ''}</div>
                <div><span class="font-medium">Requester:</span> ${ex.requester || ''}</div>
                <div><span class="font-medium">From:</span> ${ex.startLocation || ''}</div>
                <div><span class="font-medium">To:</span> ${ex.endLocation || ''}</div>
              </div>`
            const x = rect.left + window.scrollX + rect.width + 8
            const y = rect.top + window.scrollY + 8
            const tip = document.createElement('div')
            tip.className = 'pointer-events-none fixed z-50 rounded-md border border-slate-200 bg-white p-2 text-slate-800 shadow-md'
            tip.style.left = `${x}px`
            tip.style.top = `${y}px`
            tip.innerHTML = html
            tip.setAttribute('data-fc-tip', info.event.id)
            document.body.appendChild(tip)
          }}
          eventMouseLeave={(info) => {
            const tip = document.querySelector(`[data-fc-tip="${info.event.id}"]`)
            if (tip && tip.parentElement) tip.parentElement.removeChild(tip)
          }}
        />
      </div>
    </div>
  )
}
