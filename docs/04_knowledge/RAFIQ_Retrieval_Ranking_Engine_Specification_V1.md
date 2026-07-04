<!--
Extracted from docs/RAFIQ_raw_info.md lines 16518-17214.
Extraction label: current retrieval and ranking specification.
Do not treat earlier archived drafts as canonical when this document supersedes them.
-->

# RAFIQ Retrieval & Ranking Engine Specification V1
The Guidance Selection Brain

Version: 1.0
Status: Architecture Locked

Parent Documents:

RAFIQ Knowledge Base Specification V2
RAFIQ Database Schema & ERD Specification V2
RAFIQ AI Engine Specification V2
RAFIQ Knowledge Graph Specification V1
RAFIQ Node Catalog V2
1. Vision

The Retrieval & Ranking Engine is the most important component in RAFIQ.

The Knowledge Base stores knowledge.

The Knowledge Graph stores relationships.

The AI Engine understands users.

The Retrieval & Ranking Engine decides:

Which Quran verse, which tafsir, which hadith, which reflection, and which action should be shown to this specific user at this specific moment.

2. Core Philosophy

Most AI systems work like:

Question
 ↓
Search
 ↓
Results

RAFIQ works like:

Situation
 ↓
Theme
 ↓
Knowledge Graph
 ↓
Verification
 ↓
Ranking
 ↓
Guidance Package

The goal is not to retrieve everything.

The goal is to retrieve the most beneficial guidance.

3. Engine Architecture
User Input
      ↓

Theme Detection
      ↓

Candidate Retrieval
      ↓

Authenticity Filtering
      ↓

Knowledge Graph Expansion
      ↓

Candidate Scoring
      ↓

Ranking
      ↓

Guidance Assembly
      ↓

Personalization
      ↓

Final Response
4. Retrieval Layers

RAFIQ retrieval occurs in stages.

Layer 1 — Theme Retrieval

Input:

I am worried about my future.

Detected:

Fear

Mapped:

Tawakkul
Sabr
Yaqin

Output:

{
  "primaryTheme": "tawakkul",
  "secondaryThemes": [
    "sabr",
    "yaqin"
  ]
}
Layer 2 — Quran Candidate Retrieval

Sources:

ayah_themes
QUL topics
related_ayahs

Example:

Theme
 ↓

Tawakkul

 ↓

Candidates

65:2-3
3:159
8:2
29:69
Layer 3 — Tafsir Retrieval

Retrieve tafsir only for candidate verses.

Sources:

Mukhtasar
Ibn Kathir
Saadi
Muyassar
Layer 4 — Hadith Retrieval

Sources:

hadith_topics
quran_hadith_links
semantic search

Example:

65:2-3
 ↓

Linked Hadith

Bukhari 6463

Muslim XXXX
Layer 5 — Graph Expansion

Expand beyond direct matches.

Example:

Tawakkul
 ↓

Related Theme

Yaqin

 ↓

Additional Ayahs

This improves recommendation quality.

5. Candidate Types

The engine ranks multiple candidate types.

Quran Candidate
{
  "type": "ayah",
  "id": "65:2-3"
}
Hadith Candidate
{
  "type": "hadith",
  "id": "bukhari_6463"
}
Guidance Candidate
{
  "type": "guidance",
  "theme": "tawakkul"
}
6. Authenticity Filtering

No candidate proceeds without validation.

Quran

Always valid.

Quran
 ↓
Pass
Hadith

Validation flow:

Hadith
 ↓

Grade Check
 ↓

Verification Check
 ↓

Pass

Allowed:

Sahih

Hasan

Restricted:

Daif

Only in educational contexts.

Blocked:

Mawdu

Fabricated

Removed immediately.

7. Ranking Framework

Each candidate receives a score.

Scoring Factors
Factor	Weight
Theme Match	35%
Authenticity	25%
Knowledge Graph Strength	15%
User Relevance	10%
Engagement History	10%
Freshness / Diversity	5%

Total:

100%
8. Theme Match Score

Most important factor.

Measures:

Candidate

vs

Current Theme

Example:

Candidate	Theme Score
Tawakkul Ayah	1.00
Sabr Ayah	0.85
Shukr Ayah	0.20
9. Authenticity Score

Purpose:

Reward trustworthy content.

Example

Source	Score
Quran	1.00
Sahih Hadith	0.95
Hasan Hadith	0.85
Daif Hadith	0.40
10. Knowledge Graph Strength

Measures connectedness.

Example:

65:2-3

Links to:
- Tawakkul
- Rizq
- Bukhari 6463
- Related Ayahs

High score

Weakly connected nodes receive lower scores.

11. User Relevance Score

Personalization factor.

Signals:

Language

Favorite Themes

Saved Guidance

Current Journey

Reading History

Example:

User repeatedly studies Tawakkul.

Future Tawakkul content receives a boost.

12. Engagement Score

Measures usefulness.

Signals:

Bookmarks

Shares

Reads

Completion Rate

Example:

Read Fully

receives higher score than:

Skipped
13. Diversity Score

Purpose:

Avoid repetitive guidance.

Problem:

65:2-3

every day

Solution:

Reduce score if recently shown.

Example:

Shown yesterday

Penalty
14. Ranking Formula

Core ranking formula:

Score=(0.35T)+(0.25A)+(0.15G)+(0.10U)+(0.10E)+(0.05D)

Where:

T = Theme Match

A = Authenticity

G = Graph Strength

U = User Relevance

E = Engagement

D = Diversity
15. Multi-Stage Ranking

RAFIQ does not rank everything at once.

Stage 1

Theme Ranking

Situation
 ↓
Themes
Stage 2

Quran Ranking

Theme
 ↓
Best Ayahs
Stage 3

Hadith Ranking

Ayah
 ↓
Best Hadith
Stage 4

Guidance Ranking

Ayah
+
Hadith
 ↓
Best Reflection
16. Guidance Package Assembly

Top-ranked items become:

{
  "theme": {},
  "ayah": {},
  "tafsir": {},
  "hadith": {},
  "reflection": {},
  "action": {}
}
17. Daily Guidance Ranking

Special workflow.

Input:

User Profile

No explicit question.

Signals:

Recent Themes

Mood History

Journey Progress

Time of Day

Example:

Morning:

Hope

Tawakkul

Productivity

Before Sleep:

Muhasabah

Tawbah

Gratitude
18. Search Ranking

User:

Show me verses about patience.

Workflow:

Query
 ↓
Theme
 ↓
Graph
 ↓
Ayahs
 ↓
Ranking

Not keyword matching alone.

19. Study Mode Ranking

User:

Explain Surah Al-Asr.

Workflow:

Surah
 ↓
Ayahs
 ↓
Tafsir
 ↓
Related Themes
 ↓
Related Hadith

Priority:

Completeness

instead of personalization.

20. Semantic Retrieval

Powered by embeddings.

Tables:

hadith_embeddings

future:
ayah_embeddings

Example:

User:

I feel lonely.

No explicit keyword match.

Semantic retrieval discovers:

Hope

Allah's Nearness

Patience

Companionship

and surfaces relevant guidance.

21. Learning-to-Rank (Future V2)

The engine can improve over time.

Signals:

Saved

Read

Shared

Completed Actions

Ignored

Used to refine rankings.

22. Ranking Safety Rules

Never boost content because:

❌ Popularity alone

❌ Virality

❌ Social trends

❌ User preference over authenticity

Always prioritize:

✅ Authenticity

✅ Relevance

✅ Benefit

23. Failure Recovery Strategy

If retrieval confidence is low:

Theme Confidence < 0.60

Fallback:

General Guidance

Examples:

Tawakkul
Sabr
Dua
Hope
24. Node Integration

Primary ranking nodes:

NODE-T201
Theme Detection

NODE-Q301
Ayah Search

NODE-H401
Hadith Search

NODE-S902
Ranking Engine

NODE-S903
Embedding Search

NODE-S904
Graph Traversal

NODE-G601
Guidance Builder
25. Success Metrics

The engine succeeds when users:

Understand the message
Reflect on it
Complete actions
Return consistently
Grow in their Islamic journey

Not when the system produces the longest response.

26. Final Architecture
User
 ↓

Understanding
 ↓

Theme Detection
 ↓

Knowledge Graph
 ↓

Quran Retrieval
 ↓

Tafsir Retrieval
 ↓

Hadith Retrieval
 ↓

Verification
 ↓

Ranking
 ↓

Guidance Package
 ↓

Reflection
 ↓

Action
 ↓

Growth
Architecture Decision

The RAFIQ Retrieval & Ranking Engine is the decision-making brain of the platform.

It transforms a massive Quran + Hadith knowledge graph into:

The right guidance
For the right person
At the right time
With verified sources
In the most beneficial order

This engine is the key differentiator between RAFIQ and a traditional Islamic content library or chatbot. Bismillah.


