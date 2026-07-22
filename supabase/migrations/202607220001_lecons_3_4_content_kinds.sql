-- Minimal reusable extension for content forms first encountered in Leçon 3–4.
-- Existing rows and enum values remain unchanged.
alter type public.content_kind add value if not exists 'text';
alter type public.content_kind add value if not exists 'image_based_exercise';
alter type public.content_kind add value if not exists 'answerable_question';
alter type public.content_kind add value if not exists 'page_instruction';
alter type public.content_kind add value if not exists 'audio_reference';
alter type public.content_kind add value if not exists 'writing';
