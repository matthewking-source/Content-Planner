export const CHANNELS = [
  { key: 'Facebook',         group: 'Digital',     text: '#1877F2', bg: '#e8f0fe' },
  { key: 'Instagram',        group: 'Digital',     text: '#E4405F', bg: '#fce4ec' },
  { key: 'LinkedIn',         group: 'Digital',     text: '#0A66C2', bg: '#e1f0fa' },
  { key: 'Website',          group: 'Digital',     text: '#2E7D32', bg: '#e8f5e9' },
  { key: 'Email',            group: 'Digital',     text: '#F57C00', bg: '#fff3e0' },
  { key: 'School outreach',  group: 'Digital',     text: '#7B1FA2', bg: '#f3e5f5' },
  { key: 'Print / Flyers',   group: 'Traditional', text: '#5D4037', bg: '#efebe9' },
  { key: 'Press / PR',       group: 'Traditional', text: '#B71C1C', bg: '#ffebee' },
  { key: 'Events / Direct mail', group: 'Traditional', text: '#00695C', bg: '#e0f2f1' },
]

export const CHANNEL_KEYS = CHANNELS.map((c) => c.key)

const CHANNEL_MAP = Object.fromEntries(CHANNELS.map((c) => [c.key, c]))

export function channelStyle(key) {
  const c = CHANNEL_MAP[key]
  if (!c) return { text: '#374151', bg: '#e5e7eb' }
  return { text: c.text, bg: c.bg }
}

export function channelsByGroup() {
  return {
    Digital: CHANNELS.filter((c) => c.group === 'Digital'),
    Traditional: CHANNELS.filter((c) => c.group === 'Traditional'),
  }
}

export const STATUSES = ['Planned', 'Draft', 'Ready', 'Published']

export const STATUS_STYLES = {
  Planned:   { text: '#374151', bg: '#e5e7eb' },
  Draft:     { text: '#92400e', bg: '#fef3c7' },
  Ready:     { text: '#065f46', bg: '#d1fae5' },
  Published: { text: '#1e40af', bg: '#dbeafe' },
}

// Content type suggestions by channel — clicking a chip fills the input.
// The user can still type anything free-form.
export const CONTENT_TYPE_SUGGESTIONS = {
  Facebook:                ['Post', 'Post (link)', 'Post (multi)', 'Story', 'Reel', 'Live'],
  Instagram:               ['Post', 'Reel', 'Story', 'Carousel', 'Stories (multi)', 'Guide'],
  LinkedIn:                ['Post', 'Article', 'Carousel', 'Video'],
  Website:                 ['Latest News', 'Forthcoming Events', 'Blog post', 'Case study', 'Page update'],
  Email:                   ['Centre Newsletter', 'Fundraisers Update', 'One-off email', 'Campaign email'],
  'School outreach':       ['Email pack', 'Phone call', 'In-person visit', 'Flyer delivery'],
  'Print / Flyers':        ['Flyer', 'Poster', 'Menu insert', 'Leaflet', 'Noticeboard'],
  'Press / PR':            ['Press release', 'Media pitch', 'Interview', 'Feature article'],
  'Events / Direct mail':  ['Event', 'Direct mail', 'Invitation', 'Letter'],
}
