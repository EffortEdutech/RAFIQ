<!--
Extracted from docs/RAFIQ_raw_info.md lines 9737-9884.
Extraction label: QUL download limitation notes.
Do not treat earlier archived drafts as canonical when this document supersedes them.
-->

# I dug deeper into QUL and found an important limitation:

QUL does not expose direct static file URLs on the public listing pages. The download links are generated inside each resource page, and the actual file URLs are not shown in the searchable HTML. QUL's own documentation indicates resources are downloaded from the resource detail pages in JSON/SQLite formats rather than through a public API.

However, I was able to identify the actual resource pages for several datasets you should use.

English
Saheeh International

Language: English

Category: Translation

Resource Page:

Saheeh International Translation

Available formats:

simple.json
simple.sqlite
translation-text-chunk.json
translation-text-chunk.sqlite
translation-with-footnote-tags.json
translation-with-footnote-tags.sqlite
translation-with-inline-footnote.json
translation-with-inline-footnote.sqlite
Malay
Abdullah Basamia

Language: Malay

Category: Translation

Resource Page:

Malay Translation (Abdullah Basamia)

QUL lists this as the primary Malay translation resource.

Indonesian
Indonesian Islamic Affairs Ministry

Language: Indonesian

Category: Translation

Resource Page:

Indonesian Ministry Translation

Available formats include:

simple.json
simple.sqlite
translation-text-chunk.json
translation-text-chunk.sqlite
footnote formats
King Fahad Quran Complex

Language: Indonesian

Category: Translation

Resource Page:

King Fahad Indonesian Translation

Available in JSON and SQLite formats.

Chinese
Ma Jian (Simplified Chinese)

Language: Chinese

Category: Translation

Resource Page:

Chinese Translation (Simplified) - Ma Jian

QUL lists this as a Chinese Quran translation resource.

Basair Chinese Translation

Language: Chinese

Category: Translation

Resource Page:

Chinese Translation - Basair

Alternative Chinese translation.

Arabic Foundation Resources
QUL Resource Portal

Language: Arabic

Category: Quran Text / Metadata / Themes / Topics

QUL Resources Home

Contains:

Quran Script
Mushaf Layouts
Surah Information
Tafsir
Topics
Concepts
Themes
Similar Ayahs
Morphology
Word-by-Word datasets
What I Recommend for RAFIQ

Create a spreadsheet with these columns:

Priority	Dataset	Lang	Category	QUL Resource Page
P1	Quran Uthmani	Arabic	Quran Text	Resources Portal
P1	Saheeh International	English	Translation	/translation/193
P1	Abdullah Basamia	Malay	Translation	Search Resource
P1	Indonesian Ministry	Indonesian	Translation	Search Resource
P1	English Tafsir	English	Tafsir	Tafsir Category
P1	Indonesian Tafsir	Indonesian	Tafsir	Tafsir Category
P1	Quran Topics	Multi	Themes	Resources Portal
P1	Ayah Themes	Multi	Themes	Resources Portal
P2	Ma Jian	Chinese	Translation	Search Resource
P2	Chinese Tafsir	Chinese	Tafsir	Tafsir Category

For the next step, I can do a 
full QUL resource audit and produce a 
RAFIQ Knowledge Acquisition Matrix V1 with:

Every selected dataset
Resource ID
Author
License status
Language
Format (JSON/SQLite)
Recommended RAFIQ table mapping
Import priority
Estimated record counts

That document would be much closer to an implementation-ready import plan.

