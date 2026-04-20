const S = (props) => ({
  width: 16,
  height: 16,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 2,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  ...props,
})

export const IconPlus   = (p) => (<svg {...S(p)}><path d="M12 5v14M5 12h14"/></svg>)
export const IconClose  = (p) => (<svg {...S(p)}><path d="M18 6 6 18M6 6l12 12"/></svg>)
export const IconChevL  = (p) => (<svg {...S(p)}><path d="m15 18-6-6 6-6"/></svg>)
export const IconChevR  = (p) => (<svg {...S(p)}><path d="m9 18 6-6-6-6"/></svg>)
export const IconChevDn = (p) => (<svg {...S(p)}><path d="m6 9 6 6 6-6"/></svg>)
export const IconChevUp = (p) => (<svg {...S(p)}><path d="m18 15-6-6-6 6"/></svg>)
export const IconSearch = (p) => (<svg {...S(p)}><circle cx="11" cy="11" r="7"/><path d="m21 21-4.3-4.3"/></svg>)
export const IconDownload = (p) => (<svg {...S(p)}><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><path d="m7 10 5 5 5-5"/><path d="M12 15V3"/></svg>)
export const IconCalendar = (p) => (<svg {...S(p)}><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></svg>)
export const IconWeek   = (p) => (<svg {...S(p)}><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18M8 10v12M16 10v12"/></svg>)
export const IconDay    = (p) => (<svg {...S(p)}><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/><path d="M12 14v4"/></svg>)
export const IconList   = (p) => (<svg {...S(p)}><path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01"/></svg>)
export const IconTrash  = (p) => (<svg {...S(p)}><path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><path d="M10 11v6M14 11v6"/></svg>)
export const IconCopy   = (p) => (<svg {...S(p)}><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>)
export const IconComment = (p) => (<svg {...S(p)}><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>)
export const IconFilter = (p) => (<svg {...S(p)}><path d="M22 3H2l8 9.46V19l4 2v-8.54z"/></svg>)
export const IconSparkle= (p) => (<svg {...S(p)}><path d="M12 3v3M12 18v3M3 12h3M18 12h3M5.64 5.64l2.12 2.12M16.24 16.24l2.12 2.12M5.64 18.36l2.12-2.12M16.24 7.76l2.12-2.12"/></svg>)
export const IconCheck  = (p) => (<svg {...S(p)}><path d="M20 6 9 17l-5-5"/></svg>)
export const IconCommand= (p) => (<svg {...S(p)}><path d="M18 3a3 3 0 0 0-3 3v12a3 3 0 0 0 3 3 3 3 0 0 0 3-3 3 3 0 0 0-3-3H6a3 3 0 0 0-3 3 3 3 0 0 0 3 3 3 3 0 0 0 3-3V6a3 3 0 0 0-3-3 3 3 0 0 0-3 3 3 3 0 0 0 3 3h12a3 3 0 0 0 3-3 3 3 0 0 0-3-3z"/></svg>)
export const IconMenu   = (p) => (<svg {...S(p)}><path d="M4 6h16M4 12h16M4 18h16"/></svg>)
export const IconClock  = (p) => (<svg {...S(p)}><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>)
export const IconAlert  = (p) => (<svg {...S(p)}><path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><path d="M12 9v4M12 17h.01"/></svg>)
export const IconTrend  = (p) => (<svg {...S(p)}><path d="M22 7 13.5 15.5 8.5 10.5 2 17"/><path d="M16 7h6v6"/></svg>)
export const IconFolder = (p) => (<svg {...S(p)}><path d="M4 20h16a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.93a2 2 0 0 1-1.66-.9l-.82-1.2A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13c0 1.1.9 2 2 2z"/></svg>)
export const IconUser   = (p) => (<svg {...S(p)}><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>)
export const IconGrid   = (p) => (<svg {...S(p)}><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>)
export const IconArrowR = (p) => (<svg {...S(p)}><path d="M5 12h14M12 5l7 7-7 7"/></svg>)
