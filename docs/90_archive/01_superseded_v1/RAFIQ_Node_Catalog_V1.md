<!--
Extracted from docs/RAFIQ_raw_info.md lines 8418-9349.
Extraction label: superseded node catalog v1.
Do not treat earlier archived drafts as canonical when this document supersedes them.
-->

# RAFIQ Node Catalog V1
Visual AI Orchestration Architecture

Version: 1.0

Status: Core AI Architecture Approved

Parent Documents

RAFIQ Product Specification V1
RAFIQ PRD V1
RAFIQ UX Specification V1
RAFIQ AI Engine Specification V1
RAFIQ Knowledge Base Specification V1
RAFIQ Backend Blueprint V1
RAFIQ Development Blueprint V1
1. Purpose

The RAFIQ Node Catalog defines every AI node used by the platform.

Inspired by the QS-OS Core Engine philosophy:

Every capability is a node.

Nodes can be:

Reused
Reconfigured
Replaced
Improved independently

Without affecting the entire system.

2. Node Categories
INPUT NODES

ANALYSIS NODES

RETRIEVAL NODES

GUIDANCE NODES

MEMORY NODES

OUTPUT NODES

SAFETY NODES
3. Master Guidance Workflow
User Check-In
      │
      ▼

Mood Analysis Node
      │
      ▼

Intent Analysis Node
      │
      ▼

Theme Selection Node
      │
      ▼

Knowledge Retrieval Node
      │
      ▼

Guidance Composer Node
      │
      ▼

Reflection Generator Node
      │
      ▼

Action Generator Node
      │
      ▼

Safety Review Node
      │
      ▼

Final Guidance Package

This is the primary RAFIQ workflow.

4. Input Nodes
NODE-001

Check-In Input Node

Purpose

Capture daily user state.

Inputs

{
  "mood": "worried",
  "notes": "I'm stressed about work."
}

Outputs

{
  "rawInput": "...",
  "timestamp": "..."
}
NODE-002

Companion Message Node

Purpose

Capture chat message.

Inputs

{
  "message": "I feel lost."
}

Outputs

Normalized message.

5. Analysis Nodes
NODE-101

Mood Analysis Node

Purpose

Identify emotional state.

Inputs

Check-In

Outputs

{
  "emotion": "anxiety",
  "confidence": 0.91
}

Supported Emotions

Anxiety
Sadness
Gratitude
Hope
Joy
Anger
Fear
Regret
Loneliness
Confusion
Exhaustion
NODE-102

Intent Analysis Node

Purpose

Determine user need.

Inputs

User Message

Outputs

{
  "intent": "guidance"
}

Supported Intents

Guidance
Learning
Reflection
Practice
Motivation
NODE-103

Theme Selection Node

Purpose

Convert emotions into Islamic themes.

Inputs

Emotion

Intent

History

Outputs

{
  "primaryTheme": "tawakkul",
  "secondaryThemes": [
    "sabr",
    "rizq"
  ]
}
6. Retrieval Nodes
NODE-201

Quran Retrieval Node

Purpose

Find matching Quran passages.

Inputs

Theme

Outputs

{
  "passageId": "QRN001"
}

Ranking

Theme Match
+
Priority
+
Diversity
NODE-202

Tafsir Retrieval Node

Purpose

Retrieve tafsir.

Inputs

Quran Passage

Outputs

Tafsir Record

NODE-203

Hadith Retrieval Node

Purpose

Retrieve supporting hadith.

Inputs

Theme

Outputs

Hadith Record

NODE-204

Dua Retrieval Node

Purpose

Retrieve relevant dua.

Inputs

Theme

Outputs

Dua Record

NODE-205

Ibadah Retrieval Node

Purpose

Retrieve practical action.

Inputs

Theme

Time Available

Outputs

Action Record

NODE-206

Reflection Prompt Retrieval Node

Purpose

Retrieve reflection questions.

Inputs

Theme

Outputs

Reflection Prompts

7. Memory Nodes
NODE-301

User Profile Memory Node

Purpose

Load user preferences.

Inputs

User ID

Outputs

{
  "language": "en",
  "knowledgeLevel": "beginner"
}
NODE-302

Guidance History Node

Purpose

Avoid repetitive content.

Inputs

User ID

Outputs

Recent Content History

NODE-303

Theme Preference Node

Purpose

Learn preferred themes.

Inputs

User Activity

Outputs

Theme Scores

NODE-304

Journal Pattern Node

Purpose

Analyze recurring themes.

Inputs

Journal History

Outputs

{
  "dominantTheme": "anxiety"
}
8. Guidance Nodes
NODE-401

Guidance Composer Node

Purpose

Assemble guidance package.

Inputs

Quran
Tafsir
Hadith
Dua
Reflection
Action

Outputs

Unified Guidance Object

NODE-402

Theme Explanation Node

Purpose

Explain today's theme.

Inputs

Theme

Outputs

Brief explanation.

Example

Tawakkul means trusting Allah while taking responsible action.
NODE-403

Reflection Generator Node

Purpose

Generate personalized reflection.

Inputs

Theme

Mood

Outputs

2–3 Questions

NODE-404

Action Generator Node

Purpose

Select today's practice.

Inputs

Theme

Time Available

Outputs

Action Plan

NODE-405

Daily Summary Node

Purpose

Generate short encouragement.

Inputs

Guidance Package

Outputs

1 concise summary paragraph.

9. Companion Chat Nodes
NODE-501

Conversation Context Node

Purpose

Load conversation context.

Inputs

Conversation ID

Outputs

Recent messages.

NODE-502

Companion Response Node

Purpose

Generate response.

Inputs

User Message

Theme

Context

Outputs

Guidance Response

Response Template

Acknowledge

Guide

Reflect

Encourage
NODE-503

Conversation Memory Node

Purpose

Maintain continuity.

Inputs

Conversation

Outputs

Context Summary

10. Journal Nodes
NODE-601

Journal Analysis Node

Purpose

Analyze entry.

Inputs

Journal Text

Outputs

Themes

Emotions

Insights

NODE-602

Growth Insight Node

Purpose

Identify growth opportunities.

Inputs

Journal History

Outputs

Personalized Insights

11. Progress Nodes
NODE-701

Streak Calculator Node

Purpose

Calculate consistency.

Inputs

Guidance History

Outputs

Current Streak

NODE-702

Growth Tracker Node

Purpose

Measure development.

Inputs

User Activity

Outputs

Progress Metrics

NODE-703

Journey Summary Node

Purpose

Create monthly summary.

Inputs

Activity Data

Outputs

Growth Narrative

12. Safety Nodes
NODE-801

Religious Safety Node

Purpose

Prevent invalid religious responses.

Checks

Fatwas
Halal/Haram Judgments
Legal Rulings
Inheritance
Marriage Rulings

Outputs

Approved / Rejected

NODE-802

Content Verification Node

Purpose

Verify content source.

Checks

Quran Exists
Hadith Exists
Tafsir Exists

Outputs

Validated Content

NODE-803

Response Moderation Node

Purpose

Final response review.

Checks

Accuracy
Tone
Safety

Outputs

Approved Response

13. Output Nodes
NODE-901

Guidance Delivery Node

Purpose

Prepare UI response.

Outputs

{
  "theme": {},
  "quran": {},
  "tafsir": {},
  "hadith": {},
  "reflection": [],
  "action": {},
  "dua": {}
}
NODE-902

Chat Delivery Node

Purpose

Prepare chat response.

Outputs

Formatted conversation.

NODE-903

Notification Builder Node

Purpose

Create reminders.

Outputs

Notification payload.

14. Workflow Catalog
Workflow-001

Daily Guidance

Check-In

↓

Mood Analysis

↓

Theme Selection

↓

Retrieval

↓

Guidance Composer

↓

Safety Review

↓

Deliver Guidance
Workflow-002

Companion Chat

Message

↓

Intent Analysis

↓

Context Load

↓

Theme Detection

↓

Response Generation

↓

Safety Review

↓

Deliver Response
Workflow-003

Journal Analysis

Journal Entry

↓

Theme Extraction

↓

Pattern Analysis

↓

Growth Insight

↓

Store Results
Workflow-004

Progress Update

Completed Activity

↓

Progress Calculation

↓

Streak Update

↓

Growth Summary
15. Node Configuration Philosophy

Every node should support:

{
  "enabled": true,
  "priority": 10,
  "version": "1.0"
}

This allows future upgrades without breaking workflows.

16. Future Nodes (V2+)

Additional capabilities may be added as separate nodes:

Ramadan Planner Node
Hajj Companion Node
Quran Memorization Node
Family Guidance Node
Marriage Reflection Node
Kids Companion Node
Voice Companion Node
Scholar Escalation Node

No existing nodes should require redesign.

17. Recommended Physical Implementation

NestJS Structure

src/ai/

nodes/

input/
analysis/
retrieval/
guidance/
memory/
safety/
output/

workflows/

Example

nodes/

analysis/

mood-analysis.node.ts

intent-analysis.node.ts

theme-selection.node.ts

Each node exposes:

interface Node<TInput, TOutput> {
  execute(input: TInput): Promise<TOutput>;
}
18. RAFIQ Core Principle

A workflow is not intelligence.

A workflow is a sequence.

Intelligence emerges when:

Nodes are specialized
Knowledge is authentic
Memory provides context
Safety provides trust
Guidance remains relevant

Final RAFIQ AI Flow

Understand My Situation
           ↓
Understand My Need
           ↓
Connect Me To Authentic Knowledge
           ↓
Help Me Reflect
           ↓
Help Me Act
           ↓
Help Me Grow

Bismillah.

At this stage, RAFIQ now has:

Product Architecture
UX Architecture
AI Architecture
Knowledge Architecture
Backend Architecture
Database Architecture
Figma Architecture
Development Architecture
Node Architecture

This is effectively a complete V1 platform blueprint that can be handed to a designer, engineer, or AI-assisted development workflow for implementation.

