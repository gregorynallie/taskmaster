import { EnrichedTaskData } from './types/taskTypes';

type TemplateTaskSeed = Omit<EnrichedTaskData, 'scheduled_at'> & {
  dayOffset: number;
  hour: number;
  minute?: number;
};

const buildIso = (base: Date, dayOffset: number, hour: number, minute = 0): string => {
  const d = new Date(base);
  d.setDate(d.getDate() + dayOffset);
  d.setHours(hour, minute, 0, 0);
  return d.toISOString();
};

const seedTasksByPersona: Record<string, TemplateTaskSeed[]> = {
  'balanced-adventurer': [
    { title: 'Plan top 3 priorities for today', description: 'Pick three meaningful tasks that create momentum across work, health, and personal life.', category: 'Productivity', duration_min: 10, xp_estimate: 20, dayOffset: 0, hour: 8 },
    { title: 'Take a 20-minute walk', description: 'Move your body and reset your focus with an outdoor walk.', category: 'Health', duration_min: 20, xp_estimate: 30, dayOffset: 0, hour: 12, time_of_day: 'day' },
    { title: 'Prepare one healthy meal', description: 'Cook or prep one meal that supports your energy for the day.', category: 'Home', duration_min: 35, xp_estimate: 45, dayOffset: 0, hour: 18, time_of_day: 'night' },
    { title: 'Read 15 pages of a book', description: 'Build consistent learning momentum with a short reading block.', category: 'Personal Growth', duration_min: 25, xp_estimate: 35, dayOffset: 1, hour: 20, time_of_day: 'night' },
    { title: 'Weekly reflection and reset', description: 'Review wins, blockers, and priorities for the next 7 days.', category: 'Personal Growth', duration_min: 30, xp_estimate: 50, dayOffset: 2, hour: 19, recurring: { frequency: 'WEEKLY', interval: 1, daysOfWeek: ['SU'] } },
  ],
  'creative-night-owl': [
    { title: 'Capture 3 creative ideas', description: 'Brainstorm and save three rough ideas without judging quality.', category: 'Personal Growth', duration_min: 20, xp_estimate: 35, dayOffset: 0, hour: 21, time_of_day: 'night' },
    { title: 'Deep creative session (45m)', description: 'Work on your main creative project in one focused evening block.', category: 'Personal Growth', duration_min: 45, xp_estimate: 65, dayOffset: 0, hour: 22, time_of_day: 'night' },
    { title: 'Portfolio progress checkpoint', description: 'Pick one output to polish and move closer to publish-ready.', category: 'Productivity', duration_min: 30, xp_estimate: 45, dayOffset: 1, hour: 23, time_of_day: 'night' },
    { title: 'Morning wind-down recovery', description: 'Do a low-pressure reset routine before sleep or after a late session.', category: 'Relaxation', duration_min: 15, xp_estimate: 20, dayOffset: 1, hour: 1, time_of_day: 'night' },
    { title: 'Share one small creative update', description: 'Post or send one progress update to keep momentum and accountability.', category: 'Social', duration_min: 10, xp_estimate: 20, dayOffset: 2, hour: 20, time_of_day: 'night' },
  ],
  'productivity-pro': [
    { title: 'Morning planning block', description: 'Set outcomes, sequence tasks, and protect deep-work time.', category: 'Productivity', duration_min: 15, xp_estimate: 25, dayOffset: 0, hour: 8 },
    { title: 'Deep work sprint (60m)', description: 'Work distraction-free on the highest-impact task.', category: 'Productivity', duration_min: 60, xp_estimate: 80, dayOffset: 0, hour: 10, time_of_day: 'morning' },
    { title: 'Inbox and task zero pass', description: 'Clear quick responses and convert loose items into actionable tasks.', category: 'Productivity', duration_min: 25, xp_estimate: 35, dayOffset: 0, hour: 16, time_of_day: 'day' },
    { title: 'Read 20 pages (non-fiction)', description: 'Build consistent learning through short, daily reading.', category: 'Personal Growth', duration_min: 30, xp_estimate: 45, dayOffset: 1, hour: 20, time_of_day: 'night' },
    { title: 'Evening next-day planning', description: 'Close the day by drafting tomorrow’s top priorities.', category: 'Productivity', duration_min: 10, xp_estimate: 20, dayOffset: 0, hour: 19, recurring: { frequency: 'DAILY', interval: 1 } },
  ],
  'level-up-legend': [
    { title: 'Skill practice block (30m)', description: 'Spend 30 minutes practicing your current focus skill.', category: 'Personal Growth', duration_min: 30, xp_estimate: 45, dayOffset: 0, hour: 19, time_of_day: 'night' },
    { title: 'Complete one micro-lesson', description: 'Finish one short lesson/module in your chosen course.', category: 'Personal Growth', duration_min: 20, xp_estimate: 30, dayOffset: 0, hour: 20, time_of_day: 'night' },
    { title: 'Book notes: 3 key takeaways', description: 'Capture and apply three useful ideas from your current reading.', category: 'Personal Growth', duration_min: 15, xp_estimate: 25, dayOffset: 1, hour: 21, time_of_day: 'night' },
    { title: 'Weekly progress checkpoint', description: 'Review what improved this week and set the next milestone.', category: 'Personal Growth', duration_min: 25, xp_estimate: 40, dayOffset: 2, hour: 18, recurring: { frequency: 'WEEKLY', interval: 1, daysOfWeek: ['SA'] } },
    { title: 'Apply one concept in real life', description: 'Translate learning into one practical action today.', category: 'Productivity', duration_min: 20, xp_estimate: 35, dayOffset: 1, hour: 13, time_of_day: 'day' },
  ],
  'health-potion-hero': [
    { title: 'Morning movement (20m)', description: 'Start the day with cardio, mobility, or light strength work.', category: 'Health', duration_min: 20, xp_estimate: 35, dayOffset: 0, hour: 7, time_of_day: 'morning' },
    { title: 'Meal prep one high-protein option', description: 'Prepare one meal/snack to reduce decision fatigue later.', category: 'Health', duration_min: 30, xp_estimate: 45, dayOffset: 0, hour: 17, time_of_day: 'night' },
    { title: 'Hydration check (2L target)', description: 'Track and complete your hydration target for the day.', category: 'Health', duration_min: 5, xp_estimate: 15, dayOffset: 0, hour: 12, recurring: { frequency: 'DAILY', interval: 1 } },
    { title: 'Sleep wind-down routine', description: 'Do a low-stimulation pre-sleep routine for better recovery.', category: 'Relaxation', duration_min: 20, xp_estimate: 30, dayOffset: 0, hour: 21, time_of_day: 'night' },
    { title: 'Weekly fitness reflection', description: 'Review training consistency and pick one adjustment.', category: 'Health', duration_min: 15, xp_estimate: 25, dayOffset: 2, hour: 18, recurring: { frequency: 'WEEKLY', interval: 1, daysOfWeek: ['SU'] } },
  ],
  'silicon-sorcerer': [
    { title: 'Deep coding block (60m)', description: 'Ship one meaningful code increment with notifications off.', category: 'Productivity', duration_min: 60, xp_estimate: 85, dayOffset: 0, hour: 9, time_of_day: 'morning' },
    { title: 'Refactor one rough edge', description: 'Improve readability or reliability in one small subsystem.', category: 'Productivity', duration_min: 30, xp_estimate: 45, dayOffset: 0, hour: 15, time_of_day: 'day' },
    { title: 'Document current project status', description: 'Write a concise progress update and next actions.', category: 'Productivity', duration_min: 15, xp_estimate: 25, dayOffset: 0, hour: 18, time_of_day: 'night' },
    { title: 'Learn one new technical concept', description: 'Read/watch one focused resource and summarize it.', category: 'Personal Growth', duration_min: 25, xp_estimate: 35, dayOffset: 1, hour: 20, time_of_day: 'night' },
    { title: 'Automate one repetitive task', description: 'Build a small script/shortcut that saves future time.', category: 'Productivity', duration_min: 40, xp_estimate: 55, dayOffset: 2, hour: 14, time_of_day: 'day' },
  ],
  'dedicated-student': [
    { title: 'Study block (45m)', description: 'Focus on one class/topic without multitasking.', category: 'Personal Growth', duration_min: 45, xp_estimate: 60, dayOffset: 0, hour: 17, time_of_day: 'night' },
    { title: 'Review lecture notes', description: 'Rewrite key concepts and identify unclear areas.', category: 'Personal Growth', duration_min: 30, xp_estimate: 40, dayOffset: 0, hour: 19, time_of_day: 'night' },
    { title: 'Assignment progress sprint', description: 'Move one assignment or thesis section forward.', category: 'Productivity', duration_min: 40, xp_estimate: 50, dayOffset: 1, hour: 18, time_of_day: 'night' },
    { title: 'Plan tomorrow’s coursework', description: 'Define top 2 academic priorities for the next day.', category: 'Productivity', duration_min: 10, xp_estimate: 20, dayOffset: 0, hour: 21, recurring: { frequency: 'DAILY', interval: 1 } },
    { title: 'Social reset with a friend', description: 'Take one intentional social break to avoid burnout.', category: 'Social', duration_min: 30, xp_estimate: 25, dayOffset: 2, hour: 20, time_of_day: 'night' },
  ],
  'home-organizer': [
    { title: 'Daily 10-minute tidy reset', description: 'Quickly reset your main living area.', category: 'Home', duration_min: 10, xp_estimate: 20, dayOffset: 0, hour: 18, recurring: { frequency: 'DAILY', interval: 1 } },
    { title: 'Plan this week’s meals', description: 'Create a simple meal plan and shopping checklist.', category: 'Home', duration_min: 25, xp_estimate: 35, dayOffset: 1, hour: 17, time_of_day: 'night' },
    { title: 'Errands block', description: 'Batch 2-3 small errands into one focused run.', category: 'Productivity', duration_min: 45, xp_estimate: 55, dayOffset: 1, hour: 11, time_of_day: 'morning' },
    { title: 'Personal recharge activity', description: 'Protect one small block for your own reset.', category: 'Relaxation', duration_min: 20, xp_estimate: 30, dayOffset: 0, hour: 20, time_of_day: 'night' },
    { title: 'Family calendar sync', description: 'Review upcoming appointments and avoid schedule conflicts.', category: 'Social', duration_min: 15, xp_estimate: 25, dayOffset: 2, hour: 19, time_of_day: 'night' },
  ],
  'solo-entrepreneur': [
    { title: 'Client delivery deep work', description: 'Focus on your highest-priority client deliverable.', category: 'Productivity', duration_min: 60, xp_estimate: 80, dayOffset: 0, hour: 9, time_of_day: 'morning' },
    { title: 'Business development sprint', description: 'Do one outreach or proposal action to grow pipeline.', category: 'Productivity', duration_min: 30, xp_estimate: 45, dayOffset: 0, hour: 14, time_of_day: 'day' },
    { title: 'Admin cleanup block', description: 'Handle one admin backlog area (invoices, docs, follow-ups).', category: 'Productivity', duration_min: 25, xp_estimate: 35, dayOffset: 1, hour: 13, time_of_day: 'day' },
    { title: 'Skill upgrade session', description: 'Learn one tactic that improves marketing or delivery quality.', category: 'Personal Growth', duration_min: 30, xp_estimate: 40, dayOffset: 1, hour: 19, time_of_day: 'night' },
    { title: 'End-of-day shutdown routine', description: 'Review wins and intentionally disconnect from work.', category: 'Relaxation', duration_min: 15, xp_estimate: 25, dayOffset: 0, hour: 18, recurring: { frequency: 'DAILY', interval: 1 } },
  ],
};

export const getTemplateStarterTasks = (personaId: string, now: Date = new Date()): EnrichedTaskData[] => {
  const seeds = seedTasksByPersona[personaId] || [];
  return seeds.map((seed) => {
    const { dayOffset, hour, minute, ...task } = seed;
    return {
      ...task,
      scheduled_at: buildIso(now, dayOffset, hour, minute ?? 0),
    };
  });
};

