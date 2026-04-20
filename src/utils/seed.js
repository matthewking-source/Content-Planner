import { supabase } from '../supabase.js'

export const SEED_ITEMS = [
  {"date":"2026-04-20","channel":"Facebook","content_type":"Post","topic":"Marathon countdown — 6 days to go. Runner profile #1 with photo + donate link","campaign":"Marathon","owner":"Matt","status":"Planned","notes":""},
  {"date":"2026-04-20","channel":"Instagram","content_type":"Story/Reel","topic":"BTS gym footage. Coach Millie on the trampoline, fun warm-up clip","campaign":"Evergreen / BTS","owner":"Millie","status":"Planned","notes":"Employee-generated content"},
  {"date":"2026-04-21","channel":"LinkedIn","content_type":"Post","topic":"Corporate sponsor shout-out ahead of marathon race day this Sunday","campaign":"Marathon","owner":"Matt","status":"Planned","notes":"Tag sponsor pages"},
  {"date":"2026-04-22","channel":"Website","content_type":"Latest News","topic":"Marathon preview article. Route, runners, how to donate. Pin fundraising link.","campaign":"Marathon","owner":"Matt","status":"Planned","notes":"Website-first workflow"},
  {"date":"2026-04-22","channel":"Facebook","content_type":"Post (link)","topic":"Share marathon preview article from website with donate CTA","campaign":"Marathon","owner":"Matt","status":"Planned","notes":""},
  {"date":"2026-04-22","channel":"Facebook","content_type":"Post","topic":"Volunteer Day at Wingate today! Photos and shout-outs for our amazing volunteers","campaign":"Volunteer Day","owner":"Matt","status":"Planned","notes":""},
  {"date":"2026-04-23","channel":"Instagram","content_type":"Reel","topic":"Disability Fitness client session. Short rebound/bike clip, no hard sell","campaign":"Evergreen / BTS","owner":"Millie","status":"Planned","notes":"Storytelling not promo"},
  {"date":"2026-04-24","channel":"Facebook","content_type":"Post","topic":"All Stars tonight reminder. Not just for severe disabilities — for any child who needs a calmer space","campaign":"All Stars promo","owner":"Matt","status":"Planned","notes":"Key messaging from Natalie"},
  {"date":"2026-04-25","channel":"Instagram","content_type":"Story","topic":"Marathon eve energy! Last prep, good-luck messages to runners","campaign":"Marathon","owner":"Millie","status":"Planned","notes":""},
  {"date":"2026-04-26","channel":"Facebook","content_type":"Post (multi)","topic":"Marathon race day! Live updates, photos, cheering posts throughout the day","campaign":"Marathon","owner":"Matt","status":"Planned","notes":"Day-of coverage"},
  {"date":"2026-04-26","channel":"Instagram","content_type":"Stories (multi)","topic":"Marathon race day stories. Start line, runners in action, finish line celebrations","campaign":"Marathon","owner":"Matt","status":"Planned","notes":"Real-time posting"},
  {"date":"2026-04-27","channel":"Facebook","content_type":"Post","topic":"Marathon thank-you. Provisional total raised, tag runners + sponsors","campaign":"Marathon","owner":"Matt","status":"Planned","notes":""},
  {"date":"2026-04-27","channel":"Instagram","content_type":"Carousel","topic":"Marathon best moments. Photo carousel for the grid","campaign":"Marathon","owner":"Matt","status":"Planned","notes":"Evergreen grid content, no dates"},
  {"date":"2026-04-28","channel":"LinkedIn","content_type":"Article","topic":"Marathon corporate recap. Total raised, sponsor recognition, corporate supporters","campaign":"Marathon","owner":"Matt","status":"Planned","notes":"Test LinkedIn article format"},
  {"date":"2026-04-29","channel":"Website","content_type":"Latest News","topic":"Marathon recap article. Full write-up with photos, total raised, thank-yous","campaign":"Marathon","owner":"Matt","status":"Planned","notes":"Website-first then repurpose"},
  {"date":"2026-04-29","channel":"Facebook","content_type":"Post (link)","topic":"Share marathon recap article from website","campaign":"Marathon","owner":"Matt","status":"Planned","notes":""},
  {"date":"2026-04-29","channel":"Facebook","content_type":"Post","topic":"Bill Clinic at Wingate today — free pop-up to help you switch utility providers. Drop in!","campaign":"Bill Clinic","owner":"Matt","status":"Planned","notes":"Light community promo"},
  {"date":"2026-04-30","channel":"Instagram","content_type":"Story","topic":"Staff intro — Meet Natalie. Fun format, not just a bio.","campaign":"Staff intros","owner":"Matt","status":"Planned","notes":""},
  {"date":"2026-05-01","channel":"Facebook","content_type":"Post","topic":"All Stars tonight. Spaces available. Your child does not need a diagnosis to come.","campaign":"All Stars promo","owner":"Matt","status":"Planned","notes":""},
  {"date":"2026-05-01","channel":"Email","content_type":"Centre Newsletter","topic":"First Centre Newsletter relaunch. Marathon recap, Minis spotlight, residential teaser, staff intro","campaign":"Newsletter relaunch","owner":"Matt","status":"Planned","notes":"Lifestyle tone, 2k list"},
  {"date":"2026-05-02","channel":"Facebook","content_type":"Post","topic":"Disability Gymnastics today 1-2pm. Spaces available. Structured, adapted, fun.","campaign":"Disability Gym promo","owner":"Matt","status":"Planned","notes":"Currently only 3 attending"},
  {"date":"2026-05-04","channel":"Facebook","content_type":"Post","topic":"Minis this week Mon + Fri 10-11am. Inclusive, parents welcome, cafe open after","campaign":"Minis promo","owner":"Matt","status":"Planned","notes":"Link cafe angle"},
  {"date":"2026-05-04","channel":"Instagram","content_type":"Reel","topic":"Minis session highlights. Kids in the gym, fun and inclusive vibes","campaign":"Minis promo","owner":"Millie","status":"Planned","notes":"Evergreen grid content"},
  {"date":"2026-05-05","channel":"LinkedIn","content_type":"Post","topic":"Volunteer Day recap. Why volunteering at Wingate matters. Photos from 22 April.","campaign":"Volunteer Day","owner":"Matt","status":"Planned","notes":"Delayed LI angle"},
  {"date":"2026-05-06","channel":"Facebook","content_type":"Post","topic":"Pop-up Soft Play this Saturday 3-4pm. Book now. Inclusive, up to age 12.","campaign":"Soft Play promo","owner":"Matt","status":"Planned","notes":"Must be FB for mum group shares"},
  {"date":"2026-05-07","channel":"Facebook","content_type":"Post","topic":"Gardening Club every Thursday 10:30-11:30am at Rieber Hall. Get outside, get your hands dirty, grow something amazing. Only 1 member — room for loads more!","campaign":"Gardening Club","owner":"Matt","status":"Planned","notes":"Currently 1 member. Needs building."},
  {"date":"2026-05-07","channel":"Instagram","content_type":"Story","topic":"Gardening club snaps. Outside, sunshine, feel-good","campaign":"Evergreen / BTS","owner":"Matt","status":"Planned","notes":""},
  {"date":"2026-05-08","channel":"Facebook","content_type":"Post","topic":"All Stars tonight + Disability Gym tomorrow. Two ways to spend the weekend.","campaign":"All Stars / Gym promo","owner":"Matt","status":"Planned","notes":""},
  {"date":"2026-05-09","channel":"Instagram","content_type":"Story","topic":"Saturday session action. All Stars or Disability Gym clips","campaign":"Evergreen / BTS","owner":"Millie","status":"Planned","notes":""},
  {"date":"2026-05-11","channel":"Facebook","content_type":"Post","topic":"Sparks sessions this week. Sports and games, pre-book, max 10. Afternoon has spaces.","campaign":"Sparks promo","owner":"Matt","status":"Planned","notes":"Build afternoon numbers"},
  {"date":"2026-05-11","channel":"Instagram","content_type":"Reel","topic":"Gym fun. Coaches doing something daft on the equipment. Uniform energy.","campaign":"Evergreen / BTS","owner":"Millie","status":"Planned","notes":"This style went viral before"},
  {"date":"2026-05-12","channel":"LinkedIn","content_type":"Post","topic":"Self-catering residential announcement. Airbnb listing now live, accessible holidays","campaign":"Residential launch","owner":"Matt","status":"Planned","notes":""},
  {"date":"2026-05-13","channel":"Website","content_type":"Latest News","topic":"Self-catering residential launch article. What it is, photos, booking link","campaign":"Residential launch","owner":"Matt","status":"Planned","notes":"Website-first"},
  {"date":"2026-05-13","channel":"Facebook","content_type":"Post (link)","topic":"Share residential launch article. Accessible self-catering holidays in Cheshire","campaign":"Residential launch","owner":"Matt","status":"Planned","notes":""},
  {"date":"2026-05-14","channel":"Instagram","content_type":"Carousel","topic":"Residential property photos. Lifestyle shots, accessible features, grounds","campaign":"Residential launch","owner":"Matt","status":"Planned","notes":"Alex photos when available"},
  {"date":"2026-05-15","channel":"Facebook","content_type":"Post","topic":"All Stars tonight + Disability Gym tomorrow. Double reminder","campaign":"All Stars / Gym promo","owner":"Matt","status":"Planned","notes":""},
  {"date":"2026-05-16","channel":"Instagram","content_type":"Story","topic":"Saturday session action. All Stars or Disability Gym clips","campaign":"Evergreen / BTS","owner":"Millie","status":"Planned","notes":""},
  {"date":"2026-05-15","channel":"School outreach","content_type":"Email pack","topic":"Send All Stars + Disability Gym flyers to Marches Trust inclusion lead (18 schools)","campaign":"School outreach","owner":"Matt/Natalie","status":"Planned","notes":"New channel, untapped"},
  {"date":"2026-05-18","channel":"Facebook","content_type":"Post","topic":"Staff intro — Meet a coach. Fun Q&A format.","campaign":"Staff intros","owner":"Matt","status":"Planned","notes":""},
  {"date":"2026-05-18","channel":"Instagram","content_type":"Reel","topic":"Arts and Crafts session. Time-lapse of a project, wholesome vibes","campaign":"Evergreen / BTS","owner":"Millie","status":"Planned","notes":""},
  {"date":"2026-05-19","channel":"LinkedIn","content_type":"Post","topic":"Residential — accessible does not mean clinical. Lifestyle positioning.","campaign":"Residential launch","owner":"Matt","status":"Planned","notes":""},
  {"date":"2026-05-20","channel":"Facebook","content_type":"Post","topic":"Fundraising Bootcamp at Reiber Hall TODAY! Sporty workout raising money for Erica. All welcome.","campaign":"Bootcamp","owner":"Matt","status":"Planned","notes":"Erica marathon fundraiser"},
  {"date":"2026-05-20","channel":"Instagram","content_type":"Story","topic":"Bootcamp BTS — warm-up, the workout, sweaty group photo at the end","campaign":"Bootcamp","owner":"Millie","status":"Planned","notes":"Real-time if possible"},
  {"date":"2026-05-21","channel":"Facebook","content_type":"Post","topic":"Bootcamp recap — total raised, thank-you to everyone who came out for Erica","campaign":"Bootcamp","owner":"Matt","status":"Planned","notes":""},
  {"date":"2026-05-21","channel":"Instagram","content_type":"Reel","topic":"Gardening Club Thursday morning. Planting, watering, sunshine. The feel-good session you did not know you needed.","campaign":"Gardening Club","owner":"Millie","status":"Planned","notes":"Outdoor BTS, feel-good"},
  {"date":"2026-05-22","channel":"Facebook","content_type":"Post","topic":"All Stars tonight. Weekly reminder with fresh photo from last week","campaign":"All Stars promo","owner":"Matt","status":"Planned","notes":""},
  {"date":"2026-05-22","channel":"Email","content_type":"Fundraisers Update","topic":"First Fundraisers Update. Marathon recap, Wingate 1000, legacy footer, residential launch","campaign":"Newsletter","owner":"Matt/Fran","status":"Planned","notes":"Corporate tone, end-of-month"},
  {"date":"2026-05-25","channel":"Facebook","content_type":"Post","topic":"Half term week — Minis Mon + Fri, siblings welcome. Pop-up Soft Play Sat.","campaign":"Half term","owner":"Matt","status":"Planned","notes":""},
  {"date":"2026-05-25","channel":"Instagram","content_type":"Reel","topic":"Trampoline tricks compilation. Coaches showing off, fun music","campaign":"Evergreen / BTS","owner":"Millie","status":"Planned","notes":""},
  {"date":"2026-05-26","channel":"LinkedIn","content_type":"Post","topic":"Wingate 1000 — what it is, why businesses should get involved, CTA","campaign":"Wingate 1000","owner":"Matt/Fran","status":"Planned","notes":""},
  {"date":"2026-05-27","channel":"Facebook","content_type":"Post","topic":"Residential — now taking July/August bookings. Link to Airbnb.","campaign":"Residential launch","owner":"Matt","status":"Planned","notes":"Paid promo begins"},
  {"date":"2026-05-28","channel":"Instagram","content_type":"Carousel","topic":"Client success story. Disability fitness journey with consent","campaign":"Storytelling","owner":"Matt","status":"Planned","notes":"Powerful grid content"},
  {"date":"2026-05-29","channel":"Facebook","content_type":"Post","topic":"All Stars + Pop-up Soft Play this weekend","campaign":"All Stars / Soft Play","owner":"Matt","status":"Planned","notes":""},
  {"date":"2026-05-30","channel":"Facebook","content_type":"Post","topic":"Pop-up Soft Play 3-4pm today! Walk-ins if space, pre-book recommended.","campaign":"Soft Play promo","owner":"Matt","status":"Planned","notes":"FB not just IG"},
  {"date":"2026-05-29","channel":"School outreach","content_type":"Email pack","topic":"Send All Stars + Disability Gym flyers to St Barts Trust inclusion lead","campaign":"School outreach","owner":"Matt/Natalie","status":"Planned","notes":""},
  {"date":"2026-06-01","channel":"Facebook","content_type":"Post","topic":"Soft Play parties available from this Saturday! Book your birthday party.","campaign":"Soft Play parties","owner":"Matt","status":"Planned","notes":"6 June start"},
  {"date":"2026-06-01","channel":"Instagram","content_type":"Reel","topic":"BTS setting up the soft play. Staff having a go, fun energy","campaign":"Evergreen / BTS","owner":"Millie","status":"Planned","notes":""},
  {"date":"2026-06-02","channel":"LinkedIn","content_type":"Post","topic":"Disability Fitness — why accessible PT matters. Prices from 12.50/session.","campaign":"Disability Fitness","owner":"Matt","status":"Planned","notes":"Value angle"},
  {"date":"2026-06-03","channel":"Website","content_type":"Forthcoming Events","topic":"Ladies Lunch page live. 28 June, save the date, early bird info","campaign":"Ladies Lunch","owner":"Matt","status":"Planned","notes":"Website-first"},
  {"date":"2026-06-03","channel":"Facebook","content_type":"Post (link)","topic":"Ladies Lunch save the date — 28 June. Link to Forthcoming Events page.","campaign":"Ladies Lunch","owner":"Matt","status":"Planned","notes":""},
  {"date":"2026-06-04","channel":"Facebook","content_type":"Post","topic":"Gardening Club — Thursdays 10:30am, Rieber Hall. Summer is the perfect time to join. No experience needed, just enthusiasm.","campaign":"Gardening Club","owner":"Matt","status":"Planned","notes":"Seasonal angle"},
  {"date":"2026-06-04","channel":"Instagram","content_type":"Story","topic":"Disability Gymnastics — Saturday session clips, adapted routines","campaign":"Disability Gym promo","owner":"Millie","status":"Planned","notes":""},
  {"date":"2026-06-05","channel":"Email","content_type":"Centre Newsletter","topic":"June Centre Newsletter. Marathon recap photos, Ladies Lunch save-the-date, residential spotlight","campaign":"Newsletter","owner":"Matt","status":"Planned","notes":"Lifestyle tone"},
  {"date":"2026-06-06","channel":"Facebook","content_type":"Post","topic":"Soft Play parties launch day! Photos from first party with consent.","campaign":"Soft Play parties","owner":"Matt","status":"Planned","notes":""},
  {"date":"2026-06-08","channel":"Facebook","content_type":"Post","topic":"This week at Wingate — Minis Mon+Fri, Sparks daily, All Stars Fri, Gym Sat","campaign":"Weekly roundup","owner":"Matt","status":"Planned","notes":""},
  {"date":"2026-06-08","channel":"Instagram","content_type":"Reel","topic":"Rebound therapy compilation. Clients bouncing, smiling, coaches spotting","campaign":"Storytelling","owner":"Millie","status":"Planned","notes":""},
  {"date":"2026-06-09","channel":"LinkedIn","content_type":"Post","topic":"Ladies Lunch — table sponsorship opportunity. Corporate supporters welcome.","campaign":"Ladies Lunch","owner":"Matt/Fran","status":"Planned","notes":"Wingate 1000 crossover"},
  {"date":"2026-06-10","channel":"Facebook","content_type":"Post","topic":"Ladies Lunch tickets on sale. 28 June. Book your table.","campaign":"Ladies Lunch","owner":"Matt","status":"Planned","notes":""},
  {"date":"2026-06-11","channel":"Instagram","content_type":"Carousel","topic":"Meet the team — 3-slide carousel intro of a coach or staff member","campaign":"Staff intros","owner":"Matt","status":"Planned","notes":""},
  {"date":"2026-06-12","channel":"Facebook","content_type":"Post","topic":"All Stars tonight. Bring your child for a taster, no commitment needed","campaign":"All Stars promo","owner":"Matt","status":"Planned","notes":""},
  {"date":"2026-06-13","channel":"Instagram","content_type":"Story","topic":"Weekend sessions action shots","campaign":"Evergreen / BTS","owner":"Millie","status":"Planned","notes":""},
  {"date":"2026-06-15","channel":"Facebook","content_type":"Post","topic":"Residential — still spaces for July/August. Accessible, self-catering, Cheshire.","campaign":"Residential","owner":"Matt","status":"Planned","notes":""},
  {"date":"2026-06-15","channel":"Instagram","content_type":"Reel","topic":"A day in the life at Wingate. Morning Minis to afternoon Sparks to evening All Stars","campaign":"Storytelling","owner":"Matt/Millie","status":"Planned","notes":""},
  {"date":"2026-06-16","channel":"LinkedIn","content_type":"Post","topic":"Ladies Lunch — 2 weeks to go. Last tables available.","campaign":"Ladies Lunch","owner":"Matt","status":"Planned","notes":""},
  {"date":"2026-06-17","channel":"Website","content_type":"Latest News","topic":"Soft Play parties article. What to expect, photos, booking info","campaign":"Soft Play parties","owner":"Matt","status":"Planned","notes":"Website-first"},
  {"date":"2026-06-17","channel":"Facebook","content_type":"Post (link)","topic":"Share soft play parties article","campaign":"Soft Play parties","owner":"Matt","status":"Planned","notes":""},
  {"date":"2026-06-18","channel":"Instagram","content_type":"Story","topic":"Gardening Club progress check — what we planted vs what grew. Before and after shots. Thursdays 10:30am.","campaign":"Gardening Club","owner":"Matt","status":"Planned","notes":"Growth journey content"},
  {"date":"2026-06-18","channel":"Instagram","content_type":"Story","topic":"Countdown to Ladies Lunch. Behind the scenes prep","campaign":"Ladies Lunch","owner":"Matt","status":"Planned","notes":""},
  {"date":"2026-06-19","channel":"Facebook","content_type":"Post","topic":"All Stars tonight + Disability Gym tomorrow. Two ways to spend the weekend.","campaign":"All Stars / Gym","owner":"Matt","status":"Planned","notes":""},
  {"date":"2026-06-19","channel":"Email","content_type":"Fundraisers Update","topic":"June Fundraisers Update. Ladies Lunch final push, residential, Wingate 1000, legacy footer","campaign":"Newsletter","owner":"Matt/Fran","status":"Planned","notes":"Corporate tone"},
  {"date":"2026-06-22","channel":"Facebook","content_type":"Post","topic":"Ladies Lunch this Saturday — last chance to book. Menu teaser.","campaign":"Ladies Lunch","owner":"Matt","status":"Planned","notes":""},
  {"date":"2026-06-22","channel":"Instagram","content_type":"Story","topic":"Ladies Lunch prep — venue setup, table settings, floral arrangements","campaign":"Ladies Lunch","owner":"Matt","status":"Planned","notes":""},
  {"date":"2026-06-23","channel":"LinkedIn","content_type":"Post","topic":"Ladies Lunch Saturday — thank our sponsors and table hosts","campaign":"Ladies Lunch","owner":"Matt/Fran","status":"Planned","notes":""},
  {"date":"2026-06-24","channel":"Facebook","content_type":"Post","topic":"Sparks afternoon session — only 5 regulars, room for more. Try a taster.","campaign":"Sparks promo","owner":"Matt","status":"Planned","notes":"Build afternoon numbers"},
  {"date":"2026-06-25","channel":"Facebook","content_type":"Post","topic":"Gardening Club update — look what we have been growing! Thursdays 10:30-11:30am at Rieber Hall. Spaces available, come join us.","campaign":"Gardening Club","owner":"Matt","status":"Planned","notes":"Show results to attract new members"},
  {"date":"2026-06-25","channel":"Instagram","content_type":"Reel","topic":"Fun gym content — coaches vs clients challenge or silly relay","campaign":"Evergreen / BTS","owner":"Millie","status":"Planned","notes":""},
  {"date":"2026-06-26","channel":"Facebook","content_type":"Post","topic":"All Stars tonight. Ladies Lunch tomorrow. See you there!","campaign":"All Stars / Ladies Lunch","owner":"Matt","status":"Planned","notes":""},
  {"date":"2026-06-27","channel":"Facebook","content_type":"Post","topic":"Summer Disco coming 14 July! Save the date. More details soon.","campaign":"Summer Disco","owner":"Matt","status":"Planned","notes":"Early promo"},
  {"date":"2026-06-28","channel":"Facebook","content_type":"Post","topic":"Ladies Lunch day! Live updates, photos, atmosphere shots.","campaign":"Ladies Lunch","owner":"Matt","status":"Planned","notes":"Day-of coverage"},
  {"date":"2026-06-28","channel":"Instagram","content_type":"Stories (multi)","topic":"Ladies Lunch stories — arrivals, food, speeches, fun moments","campaign":"Ladies Lunch","owner":"Matt","status":"Planned","notes":""},
  {"date":"2026-06-28","channel":"LinkedIn","content_type":"Post","topic":"Ladies Lunch — on-the-day corporate thank-you, sponsor recognition","campaign":"Ladies Lunch","owner":"Matt/Fran","status":"Planned","notes":""},
  {"date":"2026-06-29","channel":"Facebook","content_type":"Post","topic":"Ladies Lunch thank-you. Total raised, highlights, tag attendees","campaign":"Ladies Lunch","owner":"Matt","status":"Planned","notes":""},
  {"date":"2026-06-29","channel":"Instagram","content_type":"Carousel","topic":"Ladies Lunch best moments — photo carousel for the grid","campaign":"Ladies Lunch","owner":"Matt","status":"Planned","notes":"Evergreen, no dates"},
  {"date":"2026-06-30","channel":"Website","content_type":"Latest News","topic":"Ladies Lunch recap article. Photos, total raised, thank-yous, what it funds","campaign":"Ladies Lunch","owner":"Matt","status":"Planned","notes":"Website-first"},
  {"date":"2026-06-30","channel":"LinkedIn","content_type":"Article","topic":"Ladies Lunch corporate recap — impact, sponsors, what the money funds","campaign":"Ladies Lunch","owner":"Matt/Fran","status":"Planned","notes":""},
  {"date":"2026-06-30","channel":"Facebook","content_type":"Post (link)","topic":"Share Ladies Lunch recap article from website","campaign":"Ladies Lunch","owner":"Matt","status":"Planned","notes":""},
  {"date":"2026-06-30","channel":"Facebook","content_type":"Post","topic":"Summer Disco — 14 July. Tickets available, music, fun for all. Book now!","campaign":"Summer Disco","owner":"Matt","status":"Planned","notes":"Build momentum"},
  {"date":null,"channel":"LinkedIn","content_type":"Post","topic":"Legat Owen presentation — we visited to present The Wingate Centre. What we do and why it matters.","campaign":"Legat Owen","owner":"Matt","status":"Planned","notes":"Post after the event. Date TBC."},
  {"date":null,"channel":"LinkedIn","content_type":"Post","topic":"Legat Owen follow-up — thank you for having us. Partnership/engagement CTA.","campaign":"Legat Owen","owner":"Matt","status":"Planned","notes":"Follow-up post. Date TBC."}
]

// Module-level lock — prevents StrictMode double-mount (or any concurrent call)
// from racing a count+insert into two parallel seeds.
let seedPromise = null

export function seedIfEmpty() {
  if (seedPromise) return seedPromise
  seedPromise = runSeed().catch((e) => {
    // Reset on failure so a retry is possible on next page load (not same tick)
    seedPromise = null
    throw e
  })
  return seedPromise
}

async function runSeed() {
  if (!supabase) return { seeded: false, reason: 'no-supabase' }

  const { count, error: countErr } = await supabase
    .from('content_items')
    .select('*', { count: 'exact', head: true })

  if (countErr) {
    console.error('[seed] count check failed', countErr)
    return { seeded: false, error: countErr }
  }

  if ((count ?? 0) > 0) return { seeded: false, reason: 'already-populated', count }

  console.warn(`[seed] content_items is empty — inserting ${SEED_ITEMS.length} seed rows`)

  const { error: insertErr } = await supabase.from('content_items').insert(SEED_ITEMS)

  if (insertErr) {
    console.error('[seed] insert failed', insertErr)
    return { seeded: false, error: insertErr }
  }

  console.info(`[seed] inserted ${SEED_ITEMS.length} rows`)
  return { seeded: true, count: SEED_ITEMS.length }
}
