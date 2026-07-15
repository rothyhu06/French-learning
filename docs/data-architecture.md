# Le Français data architecture

The product separates immutable textbook content from user-owned learning state.

## Textbook content

`textbooks → chapters → lessons → lesson_sections` is the canonical content tree. Vocabulary, grammar and exercises always reference a lesson and may also reference a section and source page. A textbook re-import creates a new source revision; it never silently detaches learning records from their original lesson.

## Learning state

Lesson progress, vocabulary scheduling, review logs, mistakes, study sessions and daily plans are owned by a Supabase Auth user. Row Level Security restricts every state record to its owner.

## Import pipeline

`textbook_imports` records the source checksum, parser version and review state. Parsed content remains `needs_review` until manually verified, then receives a publication timestamp. This prevents extracted or AI-assisted text from becoming live course content without review.

## AI boundary

Conversation history stores a snapshot of the active lesson context. Future AI teachers should only receive vocabulary, grammar and examples from that snapshot, keeping explanations within the learner's current syllabus.
