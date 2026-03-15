import { Task } from '../types';

// Using a seed type allows us to define the core data without the boilerplate that will be added dynamically.
type DemoTaskSeed = Omit<Task, 'id' | 'created_at' | 'scheduled_at' | 'completed_at' | 'xp_awarded' | 'isSpoofed' | 'order'> & { personaId: string };

export const DEMO_TASKS_SEED: DemoTaskSeed[] = [
  // --- Gamer Gremlin ---
  { personaId: 'gamer-gremlin', title: "Recalibrate aim sensitivity", description: "Spend 15 minutes in the practice range to fine-tune mouse settings for peak performance.", category: "Personal Growth", duration_min: 15, xp_estimate: 20, },
  { personaId: 'gamer-gremlin', title: "Optimize OBS settings for stream", description: "Research new encoder settings to reduce dropped frames and improve stream quality.", category: "Productivity", duration_min: 45, xp_estimate: 50, },
  { personaId: 'gamer-gremlin', title: "Research new meta builds", description: "Watch a high-rank streamer or read patch notes to understand the latest competitive meta.", category: "Fun", duration_min: 30, xp_estimate: 35, },
  { personaId: 'gamer-gremlin', title: "Clean Cheeto dust from keyboard", description: "Use compressed air and a brush to de-gunk your primary input device.", category: "Home", duration_min: 10, xp_estimate: 15, },
  { personaId: 'gamer-gremlin', title: "Re-organize Discord server channels", description: "Archive old channels and create new ones to keep the community organized.", category: "Social", duration_min: 25, xp_estimate: 30, },
  { personaId: 'gamer-gremlin', title: "Watch a VOD review of my own gameplay", description: "Analyze one ranked match to identify and correct mistakes.", category: "Personal Growth", duration_min: 40, xp_estimate: 60, },
  { personaId: 'gamer-gremlin', title: "Update graphics card drivers", description: "Ensure peak performance and compatibility with the latest game patches.", category: "Productivity", duration_min: 15, xp_estimate: 20, },
  { personaId: 'gamer-gremlin', title: "Complain on Twitter about game balance", description: "Craft a detailed thread on why the latest patch has ruined competitive integrity.", category: "Social", duration_min: 20, xp_estimate: 10, },
  { personaId: 'gamer-gremlin', title: "Stock up on instant noodles and energy drinks", description: "Make a quick grocery run to fuel the next all-night gaming session.", category: "Health", duration_min: 60, xp_estimate: 40, },

  // --- Weeb Supreme ---
  { personaId: 'weeb-supreme', title: "Watch latest episode of [Current Isekai Anime]", description: "Stay up-to-date with the seasonal anime lineup. No spoilers!", category: "Relaxation", duration_min: 25, xp_estimate: 20, },
  { personaId: 'weeb-supreme', title: "Panel line new High Grade Gundam kit", description: "Use a fine-tip marker to bring out the details on the new Gunpla model.", category: "Fun", duration_min: 60, xp_estimate: 70, },
  { personaId: 'weeb-supreme', title: "Do daily gacha pulls & quests", description: "Log in to FGO and/or Genshin to complete daily missions and use up daily energy.", category: "Fun", duration_min: 30, xp_estimate: 30, },
  { personaId: 'weeb-supreme', title: "Organize manga collection by author", description: "Alphabetize and dust off the bookshelves.", category: "Home", duration_min: 45, xp_estimate: 50, },
  { personaId: 'weeb-supreme', title: "Practice writing 10 new kanji", description: "Use a flashcard app or notebook to improve Japanese literacy.", category: "Personal Growth", duration_min: 20, xp_estimate: 35, },
  { personaId: 'weeb-supreme', title: "Pre-order the new scale figure of Best Girl", description: "Check AmiAmi and other import sites for the new figure release.", category: "Fun", duration_min: 15, xp_estimate: 10, },
  { personaId: 'weeb-supreme', title: "Clear the final chapter of the current JRPG", description: "Finish the main story quest of the game I'm currently playing.", category: "Fun", duration_min: 120, xp_estimate: 150, },
  { personaId: 'weeb-supreme', title: "Update MyAnimeList with recently finished series", description: "Rate and review the last 3 anime I completed.", category: "Productivity", duration_min: 10, xp_estimate: 15, },
  { personaId: 'weeb-supreme', title: "Cook a meal I saw in an anime (omurice, katsudon)", description: "Find a recipe and attempt to recreate an iconic anime dish.", category: "Home", duration_min: 75, xp_estimate: 80, },

  // --- Mahjong Addict ---
   { personaId: 'mahjong-addict', title: "Review last night's game logs on Tenhou", description: "Analyze three losing hands to identify mistakes in tile discarding or defense.", category: "Personal Growth", duration_min: 45, xp_estimate: 60, },
   { personaId: 'mahjong-addict', title: "Practice Riichi tile efficiency puzzles", description: "Complete a 15-minute session on a tile efficiency trainer to improve speed.", category: "Personal Growth", duration_min: 15, xp_estimate: 25, },
   { personaId: 'mahjong-addict', title: "Watch M-League pro match analysis", description: "Watch a breakdown of a professional match to learn advanced strategies.", category: "Relaxation", duration_min: 50, xp_estimate: 40, },
   { personaId: 'mahjong-addict', title: "Play 3 hanchan in the Gold Room", description: "Get in some ranked games on Mahjong Soul.", category: "Fun", duration_min: 90, xp_estimate: 100, },
   { personaId: 'mahjong-addict', title: "Read a chapter of a Riichi strategy book", description: "Focus on push/fold judgment or defensive techniques.", category: "Personal Growth", duration_min: 30, xp_estimate: 45, },
   { personaId: 'mahjong-addict', title: "Organize local club's weekly tournament", description: "Confirm attendees and set up the bracket for the weekend.", category: "Social", duration_min: 40, xp_estimate: 40, },
   { personaId: 'mahjong-addict', title: "Clean and polish mahjong tile set", description: "Wipe down each tile to keep the set in pristine condition.", category: "Home", duration_min: 25, xp_estimate: 30, },
   { personaId: 'mahjong-addict', title: "Watch a Saki episode for 'inspiration'", description: "Witness some totally realistic and not-at-all-supernatural mahjong gameplay.", category: "Relaxation", duration_min: 24, xp_estimate: 20, },
   { personaId: 'mahjong-addict', title: "Practice calculating hand points without a calculator", description: "Drill fu and han calculations for faster scoring.", category: "Personal Growth", duration_min: 20, xp_estimate: 30, },

  // --- The Socialite (Party Animal) ---
  { personaId: 'party-animal', title: "Curate the ultimate pre-game Spotify playlist", description: "Build a new playlist with fresh tracks to set the vibe for the next night out.", category: "Fun", duration_min: 60, xp_estimate: 50, },
  { personaId: 'party-animal', title: "Scout new rooftop bar for Friday night", description: "Research and make a reservation at a new, trendy spot.", category: "Social", duration_min: 20, xp_estimate: 30, },
  { personaId: 'party-animal', title: "Perfect my Espresso Martini recipe", description: "Experiment with different coffee beans and ratios to create the perfect cocktail.", category: "Home", duration_min: 30, xp_estimate: 40, },
  { personaId: 'party-animal', title: "Dry clean my 'going out' shirt", description: "Make sure my best outfit is ready for the weekend.", category: "Home", duration_min: 5, xp_estimate: 10, },
  { personaId: 'party-animal', title: "Create a new group chat for this weekend's plans", description: "Assemble the squad and start hyping up the night.", category: "Social", duration_min: 10, xp_estimate: 15, },
  { personaId: 'party-animal', title: "Research happy hour deals nearby", description: "Find the best drink and food specials for a weekday outing.", category: "Social", duration_min: 20, xp_estimate: 25, },
  { personaId: 'party-animal', title: "Take a power nap to prepare for a long night", description: "Rest up to have maximum energy for the party.", category: "Health", duration_min: 90, xp_estimate: 60, },
  { personaId: 'party-animal', title: "Call an Uber for the group", description: "Coordinate transportation to make sure everyone gets there safely.", category: "Social", duration_min: 5, xp_estimate: 10, },
  { personaId: 'party-animal', title: "Post last night's highlights to my Instagram story", description: "Edit and upload the best photos and videos from the event.", category: "Social", duration_min: 25, xp_estimate: 20, },

  // --- The Truth Seeker (Conspiracy Theorist) ---
  { personaId: 'conspiracy-theorist', title: "Cross-reference declassified documents with forum posts", description: "Connect the dots between official narratives and what 'they' aren't telling us.", category: "Personal Growth", duration_min: 90, xp_estimate: 100, },
  { personaId: 'conspiracy-theorist', title: "Reinforce Faraday cage in the basement", description: "Add another layer of aluminum foil to block out all incoming signals.", category: "Home", duration_min: 45, xp_estimate: 60, },
  { personaId: 'conspiracy-theorist', title: "Stock up on canned goods for the bunker", description: "Ensure a minimum of 6 months' worth of non-perishable food is available.", category: "Health", duration_min: 75, xp_estimate: 80, },
  { personaId: 'conspiracy-theorist', title: "Check for unusual patterns in flight tracker data", description: "Monitor for any non-standard flight paths or unidentified craft.", category: "Personal Growth", duration_min: 60, xp_estimate: 70, },
  { personaId: 'conspiracy-theorist', title: "Write a 2000-word post connecting two unrelated events", description: "Publish my findings on an obscure forum.", category: "Social", duration_min: 120, xp_estimate: 110, },
  { personaId: 'conspiracy-theorist', title: "Organize my collection of blurry photos", description: "Digitize and categorize all evidence of unexplained phenomena.", category: "Productivity", duration_min: 50, xp_estimate: 60, },
  { personaId: 'conspiracy-theorist', title: "Test my water filter for 'impurities'", description: "Ensure the municipal water supply hasn't been compromised.", category: "Health", duration_min: 30, xp_estimate: 40, },
  { personaId: 'conspiracy-theorist', title: "Watch a documentary about cryptids", description: "Gather more information on creatures the mainstream denies exist.", category: "Relaxation", duration_min: 90, xp_estimate: 50, },
  { personaId: 'conspiracy-theorist', title: "Practice my bug-out route", description: "Time the route from my home to the pre-designated safe zone.", category: "Personal Growth", duration_min: 75, xp_estimate: 90, },

  // --- The Ascetic (Minimalist Monk) ---
  { personaId: 'minimalist-monk', title: "Meditate on the concept of non-attachment", description: "Sit in silence for 30 minutes, focusing on the transient nature of all things.", category: "Relaxation", duration_min: 30, xp_estimate: 40, },
  { personaId: 'minimalist-monk', title: "Identify one non-essential item to discard", description: "Analyze all possessions and select one to donate or discard, moving closer to pure minimalism.", category: "Home", duration_min: 15, xp_estimate: 25, },
  { personaId: 'minimalist-monk', title: "Contemplate a single grain of rice", description: "Observe a single grain of rice, considering its origin, journey, and purpose.", category: "Personal Growth", duration_min: 60, xp_estimate: 100, },
  { personaId: 'minimalist-monk', title: "Polish my single spoon", description: "Maintain the condition of my one eating utensil.", category: "Home", duration_min: 5, xp_estimate: 10, },
  { personaId: 'minimalist-monk', title: "Water my one succulent", description: "Provide the necessary sustenance for my only plant.", category: "Home", duration_min: 2, xp_estimate: 5, },
  { personaId: 'minimalist-monk', title: "Read one page of Meditations by Marcus Aurelius", description: "Absorb a single, potent piece of Stoic wisdom.", category: "Personal Growth", duration_min: 10, xp_estimate: 20, },
  { personaId: 'minimalist-monk', title: "Fold my one shirt", description: "Carefully and deliberately fold my single garment.", category: "Home", duration_min: 3, xp_estimate: 5, },
  { personaId: 'minimalist-monk', title: "Re-evaluate if I really need my bed frame", description: "Consider the benefits of sleeping on a simple floor mat.", category: "Personal Growth", duration_min: 20, xp_estimate: 30, },
  { personaId: 'minimalist-monk', title: "Write a journal entry using only 10 words", description: "Distill the entire day's experience into its purest essence.", category: "Productivity", duration_min: 15, xp_estimate: 25, },

  // --- Corporate Drone ---
   { personaId: 'corporate-drone', title: "Circle back on the Q3 synergy report", description: "Ping all stakeholders to ensure alignment before the next touchpoint.", category: "Productivity", duration_min: 25, xp_estimate: 30, },
   { personaId: 'corporate-drone', title: "Touch base with stakeholders to align on deliverables", description: "Schedule a pre-meeting to prepare for the actual meeting.", category: "Productivity", duration_min: 30, xp_estimate: 40, },
   { personaId: 'corporate-drone', title: "Prepare talking points for my 1-on-1", description: "Frame my work in a way that sounds impactful and leverages corporate buzzwords.", category: "Personal Growth", duration_min: 20, xp_estimate: 35, },
   { personaId: 'corporate-drone', title: "Expense my 'business lunch' from yesterday", description: "Navigate the arcane expense reporting software.", category: "Productivity", duration_min: 15, xp_estimate: 20, },
   { personaId: 'corporate-drone', title: "Reply-all to a company-wide email to show I'm engaged", description: "A simple 'Great point, John!' should suffice.", category: "Social", duration_min: 1, xp_estimate: 5, },
   { personaId: 'corporate-drone', title: "Clear out my 5,000 unread emails", description: "Select all, mark as read, and declare email bankruptcy.", category: "Productivity", duration_min: 5, xp_estimate: 50, },
   { personaId: 'corporate-drone', title: "Update my timesheet", description: "Try to remember what I did on Monday.", category: "Productivity", duration_min: 10, xp_estimate: 15, },
   { personaId: 'corporate-drone', title: "Daydream about quitting during a mandatory meeting", description: "Stare blankly at the PowerPoint while planning my escape.", category: "Relaxation", duration_min: 60, xp_estimate: 10, },
   { personaId: 'corporate-drone', title: "Update my LinkedIn with a new 'skill'", description: "Add 'synergistic ideation' to my profile.", category: "Personal Growth", duration_min: 5, xp_estimate: 10, },

  // --- College Dropout ---
   { personaId: 'college-dropout', title: "Whiteboard the disruptive architecture for my world-changing app", description: "It's like Uber, but for cats. The VCs will love it.", category: "Productivity", duration_min: 120, xp_estimate: 100, },
   { personaId: 'college-dropout', title: "Find an obscure indie band to become my new personality", description: "Scour Bandcamp for a band with fewer than 100 listeners to gatekeep.", category: "Fun", duration_min: 45, xp_estimate: 40, },
   { personaId: 'college-dropout', title: "Post a philosophical rant on X (formerly Twitter)", description: "Craft a thread that vaguely criticizes capitalism while using big words incorrectly.", category: "Social", duration_min: 30, xp_estimate: 30, },
   { personaId: 'college-dropout', title: "'Network' by DMing a tech CEO on Twitter", description: "Tell them their latest product is 'interesting' and that I have some ideas.", category: "Social", duration_min: 20, xp_estimate: 25, },
   { personaId: 'college-dropout', title: "Explain blockchain to a family member who didn't ask", description: "Use confusing analogies about digital ledgers and decentralization.", category: "Social", duration_min: 25, xp_estimate: 20, },
   { personaId: 'college-dropout', title: "Buy another domain name for a 'future project'", description: "This one is definitely the one that will take off.", category: "Productivity", duration_min: 10, xp_estimate: 15, },
   { personaId: 'college-dropout', title: "Rewrite my app's mission statement for the 5th time", description: "This time, with more jargon about 'shifting paradigms'.", category: "Productivity", duration_min: 40, xp_estimate: 40, },
   { personaId: 'college-dropout', title: "Listen to a podcast about venture capital", description: "Take notes on how to sound smart in a pitch meeting.", category: "Personal Growth", duration_min: 60, xp_estimate: 50, },
   { personaId: 'college-dropout', title: "Post an inspirational quote on LinkedIn", description: "Something about 'hustle' and 'the grind' should do it.", category: "Social", duration_min: 5, xp_estimate: 10, },

  // --- Gym Bro ---
  { personaId: 'gym-bro', title: "Hit a new PR on bench press", description: "It's chest day, obviously. Load up the bar and get a spotter.", category: "Health", duration_min: 75, xp_estimate: 80, },
  { personaId: 'gym-bro', title: "Meal prep 12 chicken breasts and broccoli", description: "Gains are made in the kitchen. Cook a week's worth of bland, effective meals.", category: "Health", duration_min: 90, xp_estimate: 90, },
  { personaId: 'gym-bro', title: "Find optimal lighting for post-workout progress pics", description: "Scout the gym for the most flattering downlighting to maximize shadow definition.", category: "Social", duration_min: 10, xp_estimate: 15, },
  { personaId: 'gym-bro', title: "Take progress pics from 3 different angles", description: "Gotta document the gains for Instagram.", category: "Social", duration_min: 15, xp_estimate: 20, },
  { personaId: 'gym-bro', title: "Update my workout playlist with new hardstyle tracks", description: "More BPM equals more gains. It's science.", category: "Fun", duration_min: 20, xp_estimate: 15, },
  { personaId: 'gym-bro', title: "Research a new brand of pre-workout", description: "Find the one with the coolest name and the most caffeine.", category: "Personal Growth", duration_min: 30, xp_estimate: 25, },
  { personaId: 'gym-bro', title: "Practice posing in front of the mirror", description: "Master the front double bicep and most muscular poses.", category: "Personal Growth", duration_min: 15, xp_estimate: 20, },
  { personaId: 'gym-bro', title: "Wash my 7 identical gym tank tops", description: "Gotta have a fresh one for every day of the week.", category: "Home", duration_min: 60, xp_estimate: 40, },
  { personaId: 'gym-bro', title: "Film a set for my TikTok", description: "Record my bicep curls with perfect form for my followers.", category: "Social", duration_min: 10, xp_estimate: 15, },
];