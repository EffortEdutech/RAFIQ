<!--
Extracted from docs/RAFIQ_raw_info.md lines 2-1345.
Extraction label: early ideation and product positioning.
Do not treat earlier archived drafts as canonical when this document supersedes them.
-->

# I think you're describing something different from a typical Islamic app.

Most Islamic apps are content libraries:

Quran
Hadith
Prayer times
Tafsir
Du'a

Users open the app and decide what to consume.

Your idea is closer to a:

"Personal Daily Dakwah Companion"

The app understands:

Current mood
Spiritual condition
Available time
Current life challenge

Then recommends the most relevant guidance for that moment.

Vision

Imagine opening the app and seeing only one question:

"How are you feeling today?"

Options:

😔 Sad
😟 Worried
😡 Angry
😴 Tired
😊 Grateful
😌 Peaceful
🤲 Need Guidance

Then the AI prepares a daily package.

Example 1 : Feeling Sad

The AI generates:

Today's Quran

Surah Ad-Duha

Translation

Selected verses only.

Simple Tafsir

3-5 bullet explanation.

Related Hadith

A hadith about patience and Allah's mercy.

Today's Ibadah
Pray 2 rakaat duha
Read Surah Ad-Duha once
Make dua for 5 minutes
Reflection

Allah did not abandon you.

Total reading time:
5 minutes.

Example 2 : Feeling Anxious About Money

AI identifies theme:

"Rizq"

Then presents:

Quran

Verses about sustenance.

Tafsir

Short explanation.

Hadith

Trust in Allah.

Action
Istighfar x100
Read Surah Al-Waqiah tonight
Reflection

Focus on effort, not fear.

Example 3 : Feeling Grateful

Theme:

"Shukr"

Quran

Verses on gratitude.

Hadith

The Prophet's gratitude.

Ibadah
Write 3 blessings
Pray 2 rakaat syukur
Core Modules
1. Daily Check-In

Every morning:

Mood
Energy level
Stress level

Very lightweight.

No long questionnaires.

2. Quran Companion

Not full Quran.

Just today's selection.

For example:

5 verses
Translation
Audio
Reflection

This keeps engagement high.

3. Tafsir Companion

Instead of showing a whole book:

Simple

1 paragraph.

Medium

3 paragraphs.

Deep

Detailed tafsir.

User chooses.

4. Hadith Companion

One hadith daily.

With:

Arabic
Translation
Explanation
Practical action
5. Daily Ibadah Companion

Suggested activities based on available time.

3 Minutes
Istighfar
Salawat
10 Minutes
Quran
Reflection
30 Minutes
Quran
Tafsir
Sunnah prayer
AI Personalization

The AI does not issue fatwas.

The AI acts as:

"Recommendation Engine"

Inputs:

Mood
Previous readings
Favorite topics
Current struggles

Outputs:

Relevant Quran verses
Relevant hadith
Relevant ibadah suggestions

This is safer and easier to build.

Minimal MVP

Screen 1:

"How are you today?"

Screen 2:

Today's Guidance

Contains:

Quran (5 verses)
Translation
Short Tafsir
One Hadith
One Action

That's all.

Very light.

Could be built in:

Flutter
React Native
Expo

and backed by:

Supabase
OpenAI
Long-Term Vision

What becomes interesting is when the app evolves into a Spiritual Operating System.

Instead of opening social media first thing in the morning:

User opens the companion.

The companion asks:

"What does your soul need today?"

Then prepares a personalized path:

Quran → Understanding → Reflection → Action → Ibadah

in under 10 minutes.

That is a much stronger positioning than "another Quran app," because it focuses on daily guidance and habit formation rather than simply providing content.

# For this type of app, I would strongly recommend not building an "Islamic AI Scholar".

That is the biggest mistake many founders make.

Instead, build an:

AI Spiritual Guidance Orchestrator

The AI does not generate Islamic knowledge from scratch.

The AI's job is to:

Understand the user
Identify the current spiritual need
Select relevant trusted content
Present it in a personalized way
The Architecture
User Check-In
      ↓
Mood Analyzer
      ↓
Theme Selector
      ↓
Content Retriever
      ↓
Guidance Composer
      ↓
Daily Action Planner

The AI mostly orchestrates.

Not teaches.

Not gives fatwas.

Layer 1: Mood Analyzer

User input:

I feel stressed.

AI extracts:

{
  "emotion": "anxiety",
  "intensity": 0.7
}

Or:

I feel lonely.
{
  "emotion": "loneliness",
  "intensity": 0.8
}

You can start with 10 themes only:

Anxiety
Sadness
Gratitude
Anger
Fear
Confusion
Motivation
Patience
Hope
Repentance

Very manageable.

Layer 2: Theme Engine

Convert emotions into Islamic themes.

Example:

Anxiety

becomes:

Tawakkul
Rizq
Patience
Sadness

becomes:

Hope
Mercy
Sabr
Anger

becomes:

Self-control
Forgiveness
Patience

Think of this as:

Mood → Spiritual Theme
Layer 3: Knowledge Library

This is the most important part.

Create curated databases.

Quran Library

Each ayah tagged:

{
  "surah": "Ad-Duha",
  "verse": "1-11",
  "themes": [
    "hope",
    "sadness",
    "mercy"
  ]
}
Hadith Library
{
  "hadith_id": 123,
  "themes": [
    "patience",
    "trust"
  ]
}
Ibadah Library
{
  "action": "Read Surah Al-Mulk",
  "themes": [
    "reflection"
  ]
}

This is where your Islamic experts curate the content.

The AI only retrieves.

Layer 4: Guidance Composer

Now AI combines the pieces.

Input:

{
  "emotion": "anxiety"
}

Selected:

{
  "ayah": "...",
  "hadith": "...",
  "action": "Istighfar x100"
}

AI generates:

Today's focus is Tawakkul.

Allah reminds us...

Reflection:
What worries are you carrying today?

Action:
Spend 5 minutes making dua.

The AI is explaining and connecting.

Not inventing religious rulings.

Layer 5: Daily Action Planner

User selects:

I have 5 minutes.

AI prepares:

1 minute Quran
2 minute reflection
2 minute dua

User selects:

I have 30 minutes.

AI prepares:

Quran
Tafsir
Hadith
Dhikr
Journal
Memory System

A simple memory profile:

{
  "favorite_topics": [
    "tawakkul",
    "sabr"
  ],
  "recent_moods": [
    "anxiety",
    "anxiety",
    "gratitude"
  ]
}

The AI notices patterns.

Example:

User frequently struggles with anxiety.

Then gradually introduces:

Tawakkul
Rizq
Patience
Qiyam
Dua

over several weeks.

This creates a personalized spiritual journey.

AI Safety Layer

This is critical.

The AI should NEVER:

Issue fatwas
Declare halal/haram
Interpret dreams
Resolve marriage disputes
Give legal rulings
Give medical advice

Instead:

For religious rulings,
please consult a qualified scholar.

The AI remains:

Guide
Companion
Reminder
Reflection coach
AI Design for V1

For an MVP, you only need:

Database
300–500 selected Quran passages
200–300 hadith
100 ibadah suggestions

Tagged by themes.

AI Skills
Mood Classification
Theme Selection
Personalized Reflection Writing
Daily Plan Generation

That's enough.

If I were designing this product

I would structure it as:

DAILY COMPANION AI
│
├─ Mood Detection Skill
├─ Spiritual Theme Skill
├─ Quran Retrieval Skill
├─ Tafsir Retrieval Skill
├─ Hadith Retrieval Skill
├─ Ibadah Planner Skill
├─ Reflection Writer Skill
└─ Progress Companion Skill

This mirrors the same modular "skill-based" architecture we've discussed for QS-OS: each skill has a single responsibility, and the AI orchestrates them into a daily personalized dakwah experience. That makes the system easier to audit, safer from a religious perspective, and much easier to improve over time.

# Before features, let's define the positioning.

You are not building:

A Quran app
A Hadith app
A Prayer app
An Islamic social network

You are building:

A Personal Islamic Companion

Something that feels like a quiet friend that guides you back to Allah every day.

Direction 1: Gentle Companion
Qalb

Arabic: Heart

Simple.
Premium.
Easy to remember.

Tagline:

Feed your heart daily.

Nur

Arabic: Light

Tagline:

A little light, every day.

Siraj

Arabic: Lamp

Tagline:

Guidance for everyday life.

Rafiq

Arabic: Companion

Tagline:

Your daily companion towards Allah.

This is one of my favorites because it perfectly describes the product.

Mizan

Arabic: Balance

Tagline:

Bringing balance to your deen and dunya.

Direction 2: Daily Guidance
Huda

Guidance

Tagline:

Daily guidance, one step at a time.

Hidayah

Guidance from Allah

Tagline:

Guidance for every season of life.

Yawm

Day

Tagline:

A better day begins with remembrance.

Daily Huda

Very clear positioning.

Tagline:

Personalized Islamic guidance every day.

Direction 3: AI-Centric
Huda AI

Simple.

Easy marketing.

Qalb AI

Feels modern.

Nur AI

Short.
Memorable.

Rafiq AI

Personally my favorite AI version.

It sounds like:

"Your AI companion."

without sounding overly technical.

Direction 4: Premium Modern Startup

These are names I think could become a global product.

Tazkiyah

Purification of the soul.

Tagline:

Grow closer to Allah every day.

Ihsan

Excellence in worship.

Tagline:

Worship with presence.

Fitrah

Natural state of the soul.

Tagline:

Return to what you were created for.

This has very strong branding potential.

Sakinah

Tranquility.

Tagline:

Find peace in remembrance.

Very emotionally powerful.

Direction 5: The "Duolingo for Deen"
OneAyah

Tagline:

One ayah. Every day.

OneDeen

Tagline:

Small steps. Lasting faith.

DeenFlow

Tagline:

Personalized guidance for daily life.

DeenPath

Tagline:

Your daily path to Allah.

My Top 10
Rafiq
Sakinah
Fitrah
Ihsan
Huda
Qalb
Tazkiyah
Nur
DeenPath
OneAyah
If I were building this product today

I would shortlist:

Rafiq

The companion.

Sakinah

The feeling users want.

Fitrah

The transformation users seek.

Ihsan

The destination users aspire to.

Of these four, Rafiq is the closest match to the product vision:

An AI companion that understands your day, identifies your spiritual needs, and prepares a personalized journey of Quran, tafsir, hadith, reflection, and ibadah.

It feels less like an app and more like a relationship, which is often what drives daily engagement.

# That's actually a surprisingly strong branding angle.

Most people will see:

Rafiq

Companion

Muslims immediately understand the meaning:

Friend, companion, trusted guide.

But for the tech crowd, founders, engineers, and professionals, you can create a secondary interpretation:

R.A.F.I.Q

Request Assistance From Intelligent Quranic-guidance

or

Request Advice From Intelligent Quran

or

Request For Insight & Quran

Brand Story

When life becomes confusing, people send:

RFQ

Request For Quote

to suppliers.

With Rafiq, you send:

Request For Quran.

RFQ → Request For Quote
RAFIQ → Request For Quran
Product Positioning

Most Islamic apps say:

Read Quran

Read Hadith

Read Tafsir

Rafiq says:

Tell me what you're going through.

And Rafiq prepares:

Relevant Quran
Relevant Tafsir
Relevant Hadith
Relevant Ibadah
Relevant Reflection

for today.

This is much more personal.

Tagline Ideas
Option 1

Rafiq

Your Daily Companion in Deen.

Option 2

Rafiq

Guidance for Every Day.

Option 3

Rafiq

Ask. Reflect. Grow.

Option 4

Rafiq

Personalized Islamic Guidance.

Option 5

Rafiq

Request For Quran.

Simple.
Memorable.
Unique.

Product Philosophy

Most AI assistants answer questions.

Rafiq answers conditions.

Not:

"What is Surah Al-Kahf?"

But:

"I'm feeling overwhelmed."

Rafiq understands the state and responds with:

Quran
Hadith
Reflection
Action
The Product Pyramid
                 Allah
                   ▲
                   │
              Guidance
                   ▲
                   │
                Rafiq
                   ▲
                   │
              Daily Life

Rafiq is not the source.

Rafiq is the bridge.

This distinction is important both spiritually and product-wise.

Product Manifesto

Imagine opening Rafiq every morning.

Not to scroll.

Not to consume content.

Not to argue online.

But to ask:

"What does Allah want me to focus on today?"

Rafiq then prepares a personalized daily journey:

Quran
Understanding
Reflection
Action
Ibadah

all in 5–10 minutes.

If we continue designing this as a startup product, I would define Rafiq as:

Rafiq — The AI-Powered Personal Islamic Companion

and organize the entire app around one core screen:

"Today's Guidance"

Everything else (Quran, Tafsir, Hadith, Dhikr, Journal, Progress, Challenges, Streaks) becomes supporting features around that single daily experience. That keeps the product extremely focused and lightweight instead of becoming another feature-heavy Islamic super app.

# We have a brand and we can proceed with full design now 

Bismillah.

Now that we have Rafiq, we should design it as a complete product, not as a collection of features.

RAFIQ V1
Product Definition

Rafiq

Your AI-Powered Personal Islamic Companion

Mission:

Help Muslims strengthen their relationship with Allah through personalized daily guidance.

Not a scholar.
Not a fatwa engine.
Not social media.

A companion.

The Core User Journey

Every day follows the same journey.

Check-In
    ↓
Understand Me
    ↓
Guide Me
    ↓
Reflect
    ↓
Act
    ↓
Grow

Simple.

Repeatable.

Habit-forming.

The Home Screen

Not a dashboard.

Not 50 menu items.

Only one focus.

Assalamualaikum Jessmin

How are you today?

Mood cards:

😊 Grateful

😔 Sad

😟 Worried

😡 Frustrated

🤲 Seeking Guidance

😌 Peaceful

😴 Tired

Or:

Tell Rafiq what's on your mind...
RAFIQ AI ENGINE

Instead of one AI, we design multiple skills.

Rafiq AI
│
├── Mood Skill
├── Theme Skill
├── Quran Skill
├── Tafsir Skill
├── Hadith Skill
├── Reflection Skill
├── Ibadah Skill
├── Dhikr Skill
├── Journal Skill
└── Progress Skill

Very similar to the skill architecture you like for QS-OS.

Skill 1: Mood Analyzer

Input:

I'm worried about my future.

Output:

{
  "emotion": "anxiety",
  "confidence": 0.91
}
Skill 2: Theme Selector

Emotion:

Anxiety

Themes:

Tawakkul
Rizq
Patience
Hope
Skill 3: Quran Skill

Search curated database.

Example:

Surah At-Talaq
65:2-3

Reason:

Trust in Allah's provision
Skill 4: Tafsir Skill

Generate:

Quick

1 paragraph

Standard

3 paragraphs

Deep

Detailed study

Skill 5: Hadith Skill

Select matching hadith.

Example:

Patience

Trust

Mercy

Gratitude

Repentance

Skill 6: Reflection Skill

Produces:

What worries are consuming your thoughts today?

How would your day change if you trusted Allah with what you cannot control?
Skill 7: Ibadah Planner

Available time:

3 mins
5 mins
10 mins
30 mins

Example:

5 minutes:

Read 5 verses
Make dua
Istighfar x33
Today's Guidance Card

The heart of the product.

Every day:

Today's Theme

Tawakkul

Then:

Quran

Selected verses.

Then:

Reflection

Then:

Today's Action

Then:

Dua

Everything on one screen.

Daily Journal

Night session.

How was your day?

Options:

Better than expected
Challenging
Productive
Spiritually uplifting
Difficult

AI records growth.

Growth System

Not gamification.

Not points.

Not coins.

Not badges.

Instead:

Spiritual Journey

Example:

This Month

You reflected:

Tawakkul 7 times
Gratitude 5 times
Patience 4 times
Most Frequent Theme

Trust in Allah

Suggested Next Theme

Contentment

Content Library

Curated.

Not AI-generated.

Quran

Theme tagged.

Hope
Mercy
Patience
Fear
Repentance
Gratitude
Hadith

Theme tagged.

Duas

Theme tagged.

Dhikr

Theme tagged.

Ibadah

Theme tagged.

Companion Mode

This becomes the killer feature.

User says:

I'm feeling lost.

Rafiq responds conversationally.

Not like ChatGPT.

Not like a search engine.

More like:

I hear that you're feeling uncertain. Today let's focus on trust and patience.

Then provides:

Verse
Reflection
Action
Future Premium Features
Voice Companion

User speaks.

Rafiq, I'm struggling today.

Voice response.

Family Mode

Parents.

Children.

Shared spiritual goals.

Couples Mode

Daily reminders.

Joint reflections.

Shared duas.

Ramadan Mode

Special engine.

Quran goals
Taraweeh tracker
Daily reflections
Zakat reminders
Hajj & Umrah Mode

Guided journey.

Technical Architecture

Since you're comfortable with modern stacks:

React Native
     ↓
Supabase
     ↓
Rafiq AI Gateway
     ↓
OpenAI
     ↓
Islamic Knowledge Base

Knowledge Base:

Quran
Tafsir
Hadith
Dua
Dhikr
Ibadah
Themes

Stored as structured data.

AI orchestrates.

Never invents sources.

The One-Sentence Product Vision

Rafiq is a personal Islamic companion that understands your current state and prepares a daily path of Quran, understanding, reflection, and action to help you grow closer to Allah.

That sentence should guide every feature decision. If a feature doesn't help deliver personalized daily guidance, it probably doesn't belong in Rafiq V1.

