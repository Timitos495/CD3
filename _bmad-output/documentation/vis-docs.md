Page 1
3/30/26, 10:38 AM Visualizer API

≡ Update roaster

v1.8.2 OAS 3.1.0

Visualizer API
<img>OpenAPI Document Icon</img>

Download OpenAPI Document

REST API for Visualizer.

Supports:

Shot retrieval and upload
Shot updates/deletes
Roaster CRUD (premium)
Coffee bag CRUD (premium)
Authentication

The Visualizer API supports the following authentication methods:

HTTP Basic Authentication (email + password) Acceptable for personal use cases, such as private scripts, local tooling, or internal automations.
OAuth 2.0 Authorization Code Flow Recommended for public applications, distributed integrations, and any workflow exposed to other users.
OAuth scopes

read — read-only access
upload — permission to upload shots only
write — full write access
Scope behavior

upload is a constrained, lower-risk write scope intended for ingestion-only clients.
write is required for broader mutating operations (for example, update/delete and other write endpoints).
Security recommendation

For public or user-facing integrations, OAuth should be used instead of Basic Auth.
https://apidocs.visualizer.coffee/#tag/roasters/PATCH/roasters/{id} <page_number>1/28</page_number>

Page 2
3/30/26, 10:38 AM Visualizer API

This avoids collecting user passwords outside Visualizer and reduces credential exposure risk.
Rate limits
All API requests are limited to 50 requests per minute per client IP.
All API requests are also limited to 200 requests per 10 minutes per client IP.
Authenticated API requests are additionally limited to 200 requests per 10 minutes per user.
When a limit is exceeded, the API returns [429 Too Many Requests] with a JSON error payload.
Notes:
Some read endpoints are public ([/shots], [/shots/{id}], [/shots/shared])
Write endpoints require authenticated users and write scope (OAuth)
Roaster/Coffee Bag writes also require premium access
Credentials
Operations
https://apidocs.visualizer.coffee/#tag/roasters/PATCH/roasters/{id} <page_number>2/28</page_number>

Page 3
3/30/26, 10:38 AM Visualizer API

GET /me

Get current account
Responses
200 Authenticated account details.
401
Server
https://visualizer.coffee/api
Production
Authentication
Auth Type ▼

No authentication selected

Client Libraries
_ Shell
Ruby
Node.js
PHP
Python
More
Node.js Fetch
200 401 429 Show Schema ▼

{ "id": "123e4567-e89b-12d3-a456-426614174000", "name": "string", "public": true, "avatar_url": "https://example.com" }

Authenticated account details.

Shots
Operations
https://apidocs.visualizer.coffee/#tag/roasters/PATCH/roasters/{id} <page_number>3/28</page_number>

Page 4
3/30/26, 10:38 AM Visualizer API

GET /shots POST /shots/upload GET /shots/shared GET /shots/{id} PATCH /shots/{id} DELETE /shots/{id} GET /shots/{id}/download GET /shots/{id}/profile

List shots
Returns shots sorted by start time (default) or updated_at.

Behavior differs by auth state:

Unauthenticated: only public shots
Authenticated: own shots
Query Parameters
page integer · min: 1 1-based page number (default 1).

items integer · min: 1 · max: 100 Items per page (default 10, max 100).

sort enum const: updated_at Set to updated_at for updated-time sorting. Omit for start-time sorting.

values updated_at

Responses
200 Paginated shot summaries.
422 Invalid pagination/sort.
429 Too many requests. The API rate limit has been exceeded.
https://apidocs.visualizer.coffee/#tag/roasters/PATCH/roasters/{id} <page_number>4/28</page_number>

Page 5
3/30/26, 10:38 AM Visualizer API

GET /shots
Node.js Fetch ▾

fetch('https://visualizer.coffee/api/shots')
▶ Test Request

200 422 429 Show Schema ☐

{
    "data": [
        {
            "id": "123e4567-e89b-12d3-a456-426614174000",
            "clock": 1,
            "updated_at": 1
        }
    ],
    "paging": {
        "count": 1,
        "page": 1,
        "limit": 1,
        "pages": 1
    }
}
Paginated shot summaries

Upload shot export
Upload a shot file via one of:

multipart/form-data with file
application/json raw payload
Body (required) multipart/form-data ▾

file string · binary required binary data, used to describe files

Responses

200 Shot created.

401 Authentication required.

403

https://apidocs.visualizer.coffee/#tag/roasters/PATCH/roasters/{id} <page_number>5/28</page_number>

Page 6
3/30/26, 10:38 AM Visualizer API

Missing OAuth scope.

422 Could not parse or persist shot.
429 Too many requests. The API rate limit has been exceeded.
POST /shots/upload Node.js Fetch ▾

const formData = new FormData()
formData.append('file', '@filename')

fetch('https://visualizer.coffee/api/shots/upload', {
    method: 'POST',
    headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: 'Bearer YOUR_SECRET_TOKEN'
    },
    body: formData
})
▶ Test Request

200 401 403 422 429

{
  "id": "123e4567-e89b-12d3-a456-426614174000"
}
Shot created.

Resolve shared shot(s)
With code: resolve a specific shared shot.
Without code and authenticated: return authenticated user's shared shots.
Without code and unauthenticated: returns 404.
Query Parameters
code string Shared shot code (case-insensitive).

format string · enum

https://apidocs.visualizer.coffee/#tag/roasters/PATCH/roasters/{id} <page_number>6/28</page_number>

Page 7
3/30/26, 10:38 AM Visualizer API

Optional output format used by shot serializers. Defaults to default when omitted. Legacy decent remains accepted as an alias for backward compatibility.

values

default beanconqueror

with_data

When present on shared shot responses, includes detailed shot information.

One of string string

Responses

200 Shared shot or list of shared shots.
404 Shared shot not found.
429 Too many requests. The API rate limit has been exceeded.
Get shot
Returns a shot by id.

When the authenticated user owns the shot, the response also includes [private_notes].

Path Parameters
GET /shots/shared

| id | string | uuid | required | |---|---|---|---|

fetch('https://visualizer.coffee/api/shots/shared')
https://apidocs.visualizer.coffee/#tag/roasters/PATCH/roasters/{id} <page_number>7/28</page_number>

Page 8
3/30/26, 10:38 AM Visualizer API ▶ Test Request

Query Parameters
format string 200 404 429num Show Schema ☐ Optional output format used by shot serializers. Defaults to default when omitted. Legacy decent remains accepted as an alias for backward compatibility.

values string default beanconqueror

essentials
When present, omits full shot information payload. One of string string

Responses
200 Shot detail.
404 Shot not found.
429 Too many requests. The API rate limit has been exceeded.
GET /shots/{id} Node.js Fetch ▼ 1 fetch('https://visualizer.coffee/api/shots/123e4567-e89b-12d3-a456-42661417424a')

▶ Test Request

200 404 429 Show Schema ☐ { "id": "15d4ec9f-7f86-4f63-b2ac-cfce8277f33f", "user_id": "0c2f8248-7d67-44c1-a89a-3a6c0d468875", "profile_title": "Rao Allonge", "drink_weight": "42.1", "bean_weight": "20.0", "start_time": "2026-03-09T08:12:00Z", "end_time": "2026-03-09T08:12:00Z", "roaster_id": "0c2f8248-7d67-44c1-a89a-3a6c0d468875", "roaster_name": "Rao Allonge", "roaster_location": "Rao Allonge", "roaster_contact": "roastmaster@roa...", "roaster_phone": "+1 (555) 555-5555", "roaster_email": "roastmaster@roa...", "roaster_website": "http://www.roa...", "roaster_description": "Rao Allonge is a coffee roastery located in the heart of the city. We specialize in single-origin coffees from around the world.", "roaster_logo": "https://roa...", "roaster_logo_small": "https://roa...", "roaster_logo_large": "https://roa...", "roaster_logo_square": "https://roa...", "roaster_logo_thumbnail": "https://roa...", "roaster_logo_thumbnail_square": "https://roa...", "roaster_logo_thumbnail_small": "https://roa...", "roaster_logo_thumbnail_medium": "https://roa...", "roaster_logo_thumbnail_large": "https://roa...", "roaster_logo_thumbnail_xlarge": "https://roa...", "roaster_logo_thumbnail_2x": "https://roa...", "roaster_logo_thumbnail_3x": "https://roa...", "roaster_logo_thumbnail_4x": "https://roa...", "roaster_logo_thumbnail_5x": "https://roa...", "roaster_logo_thumbnail_6x": "https://roa...", "roaster_logo_thumbnail_7x": "https://roa...", "roaster_logo_thumbnail_8x": "https://roa...", "roaster_logo_thumbnail_9x": "https://roa...", "roaster_logo_thumbnail_10x": "https://roa...", "roaster_logo_thumbnail_11x": "https://roa...", "roaster_logo_thumbnail_12x": "https://roa...", "roaster_logo_thumbnail_13x": "https://roa...", "roaster_logo_thumbnail_14x": "https://roa...", "roaster_logo_thumbnail_15x": "https://roa...", "roaster_logo_thumbnail_16x": "https://roa...", "roaster_logo_thumbnail_17x": "https://roa...", "roaster_logo_thumbnail_18x": "https://roa...", "roaster_logo_thumbnail_19x": "https://roa...", "roaster_logo_thumbnail_20x": "https://roa...", "roaster_logo_thumbnail_21x": "https://roa...", "roaster_logo_thumbnail_22x": "https://roa...", "roaster_logo_thumbnail_23x": "https://roa...", "roaster_logo_thumbnail_24x": "https://roa...", "roaster_logo_thumbnail_25x": "https://roa...", "roaster_logo_thumbnail_26x": "https://roa...", "roaster_logo_thumbnail_27x": "https://roa...", "roaster_logo_thumbnail_28x": "https://roa...", "roaster_logo_thumbnail_29x": "https://roa...", "roaster_logo_thumbnail_30x": "https://roa...", "roaster_logo_thumbnail_31x": "https://roa...", "roaster_logo_thumbnail_32x": "https://roa...", "roaster_logo_thumbnail_33x": "https://roa...", "roaster_logo_thumbnail_34x": "https://roa...", "roaster_logo_thumbnail_35x": "https://roa...", "roaster_logo_thumbnail_36x": "https://roa...", "roaster_logo_thumbnail_37x": "https://roa...", "roaster_logo_thumbnail_38x": "https://roa...", "roaster_logo_thumbnail_39x": "https://roa...", "roaster_logo_thumbnail_40x": "https://roa...", "roaster_logo_thumbnail_41x": "https://roa...", "roaster_logo_thumbnail_42x": "https://roa...", "roaster_logo_thumbnail_43x": "https://roa...", "roaster_logo_thumbnail_44x": "https://roa...", "roaster_logo_thumbnail_45x": "https://roa...", "roaster_logo_thumbnail_46x": "https://roa...", "roaster_logo_thumbnail_47x": "https://roa...", "roaster_logo_thumbnail_48x": "https://roa...", "roaster_logo_thumbnail_49x": "https://roa...", "roaster_logo_thumbnail_50x": "https://roa...", "roaster_logo_thumbnail_51x": "https://roa...", "roaster_logo_thumbnail_52x": "https://roa...", "roaster_logo_thumbnail_53x": "https://roa...", "roaster_logo_thumbnail_54x": "https://roa...", "roaster_logo_thumbnail_55x": "https://roa...", "roaster_logo_thumbnail_56x": "https://roa...", "roaster_logo_thumbnail_57x": "https://roa...", "roaster_logo_thumbnail_58x": "https://roa...", "roaster_logo_thumbnail_59x": "https://roa...", "roaster_logo_thumbnail_60x": "https://roa...", "roaster_logo_thumbnail_61x": "https://roa...", "roaster_logo_thumbnail_62x": "https://roa...", "roaster_logo_thumbnail_63x": "https://roa...", "roaster_logo_thumbnail_64x": "https://roa...", "roaster_logo_thumbnail_65x": "https://roa...", "roaster_logo_thumbnail_66x": "https://roa...", "roaster_logo_thumbnail_67x": "https://roa...", "roaster_logo_thumbnail_68x": "https://roa...", "roaster_logo_thumbnail_69x": "https://roa...", "roaster_logo_thumbnail_70x": "https://roa...", "roaster_logo_thumbnail_71x": "https://roa...", "roaster_logo_thumbnail_72x": "https://roa...", "roaster_logo_thumbnail_73x": "https://roa...", "roaster_logo_thumbnail_74x": "https://roa...", "roaster_logo_thumbnail_75x": "https://roa...", "roaster_logo_thumbnail_76x": "https://roa...", "roaster_logo_thumbnail_77x": "https://roa...", "roaster_logo_thumbnail_78x": "https://roa...", "roaster_logo_thumbnail_79x": "https://roa...", "roaster_logo_thumbnail_80x": "https://roa...", "roaster_logo_thumbnail_81x": "https://roa...", "roaster_logo_thumbnail_82x": "https://roa...", "roaster_logo_thumbnail_83x": "https://roa...", "roaster_logo_thumbnail_84x": "https://roa...", "roaster_logo_thumbnail_85x": "https://roa...", "roaster_logo_thumbnail_86x": "https://roa...", "roaster_logo_thumbnail_87x": "https://roa...", "roaster_logo_thumbnail_88x": "https://roa...", "roaster_logo_thumbnail_89x": "https://roa...", "roaster_logo_thumbnail_90x": "https://roa...", "roaster_logo_thumbnail_91x": "https://roa...", "roaster_logo_thumbnail_92x": "https://roa...", "roaster_logo_thumbnail_93x": "https://roa...", "roaster_logo_thumbnail_94x": "https://roa...", "roaster_logo_thumbnail_95x": "https://roa...", "roaster_logo_thumbnail_96x": "https://roa...", "roaster_logo_thumbnail_97x": "https://roa...", "roaster_logo_thumbnail_98x": "https://roa...", "roaster_logo_thumbnail_99x": "https://roa...", "roaster_logo_thumbnail_100x": "https://roa...", "roaster_logo_thumbnail_101x": "https://roa...", "roaster_logo_thumbnail_102x": "https://roa...", "roaster_logo_thumbnail_103x": "https://roa...", "roaster_logo_thumbnail_104x": "https://roa...", "roaster_logo_thumbnail_105x": "https://roa...", "roaster_logo_thumbnail_106x": "https://roa...", "roaster_logo_thumbnail_107x": "https://roa...", "roaster_logo_thumbnail_108x": "https://roa...", "roaster_logo_thumbnail_109x": "https://roa...", "roaster_logo_thumbnail_110x": "https://roa...", "roaster_logo_thumbnail_111x": "https://roa...", "roaster_logo_thumbnail_112x": "https://roa...", "roaster_logo_thumbnail_113x": "https://roa...", "roaster_logo_thumbnail_114x": "https://roa...", "roaster_logo_thumbnail_115x": "https://roa...", "roaster_logo_thumbnail_116x": "https://roa...", "roaster_logo_thumbnail_117x": "https://roa...", "roaster_logo_thumbnail_118x": "https://roa...", "roaster_logo_thumbnail_119x": "https://roa...", "roaster_logo_thumbnail_120x": "https://roa...", "roaster_logo_thumbnail_121x": "https://roa...", "roaster_logo_thumbnail_122x": "https://roa...", "roaster_logo_thumbnail_123x": "https://roa...", "roaster_logo_thumbnail_124x": "https://roa...", "roaster_logo_thumbnail_125x": "https://roa...", "roaster_logo_thumbnail_126x": "https://roa...", "roaster_logo_thumbnail_127x": "https://roa...", "roaster_logo_thumbnail_128x": "https://roa...", "roaster_logo_thumbnail_129x": "https://roa...", "roaster_logo_thumbnail_130x": "https://roa...", "roaster_logo_thumbnail_131x": "https://roa...", "roaster_logo_thumbnail_132x": "https://roa...", "roaster_logo_thumbnail_133x": "https://roa...", "roaster_logo_thumbnail_134x": "https://roa...", "roaster_logo_thumbnail_135x": "https://roa...", "roaster_logo_thumbnail_136x": "https://roa...", "roaster_logo_thumbnail_137x": "https://roa...", "roaster_logo_thumbnail_138x": "https://roa...", "roaster_logo_thumbnail_139x": "https://roa...", "roaster_logo_thumbnail_140x": "https://roa...", "roaster_logo_thumbnail_141x": "https://roa...", "roaster_logo_thumbnail_142x": "https://roa...", "roaster_logo_thumbnail_143x": "https://roa...", "roaster_logo_thumbnail_144x": "https://roa...", "roaster_logo_thumbnail_145x": "https://roa...", "roaster_logo_thumbnail_146x": "https://roa...", "roaster_logo_thumbnail_147x": "https://roa...", "roaster_logo_thumbnail_148x": "https://roa...", "roaster_logo_thumbnail_149x": "https://roa...", "roaster_logo_thumbnail_150x": "https://roa...", "roaster_logo_thumbnail_151x": "https://roa...", "roaster_logo_thumbnail_152x": "https://roa...", "roaster_logo_thumbnail_153x": "https://roa...", "roaster_logo_thumbnail_154x": "https://roa...", "roaster_logo_thumbnail_155x": "https://roa...", "roaster_logo_thumbnail_156x": "https://roa...", "roaster_logo_thumbnail_157x": "https://roa...", "roaster_logo_thumbnail_158x": "https://roa...", "roaster_logo_thumbnail_159x": "https://roa...", "roaster_logo_thumbnail_160x": "https://roa...", "roaster_logo_thumbnail_161x": "https://roa...", "roaster_logo_thumbnail_162x": "https://roa...", "roaster_logo_thumbnail_163x": "https://roa...", "roaster_logo_thumbnail_164x": "https://roa...", "roaster_logo_thumbnail_165x": "https://roa...", "roaster_logo_thumbnail_166x": "https://roa...", "roaster_logo_thumbnail_167x": "https://roa...", "roaster_logo_thumbnail_168x": "https://roa...", "roaster_logo_thumbnail_169x": "https://roa...", "roaster_logo_thumbnail_170x": "https://roa...", "roaster_logo_thumbnail_171x": "https://roa...", "roaster_logo_thumbnail_172x": "https://roa...", "roaster_logo_thumbnail_173x": "https://roa...", "roaster_logo_thumbnail_174x": "https://roa...", "roaster_logo_thumbnail_175x": "https://roa...", "roaster_logo_thumbnail_176x": "https://roa...", "roaster_logo_thumbnail_177x": "https://roa...", "roaster_logo_thumbnail_178x": "https://roa...", "roaster_logo_thumbnail_179x": "https://roa...", "roaster_logo_thumbnail_180x": "https://roa...", "roaster_logo_thumbnail_181x": "https://roa...", "roaster_logo_thumbnail_182x": "https://roa...", "roaster_logo_thumbnail_183x": "https://roa...", "roaster_logo_thumbnail_184x": "https://roa...", "roaster_logo_thumbnail_185x": "https://roa...", "roaster_logo_thumbnail_186x": "https://roa...", "roaster_logo_thumbnail_187x": "https://roa...", "roaster_logo_thumbnail_188x": "https://roa...", "roaster_logo_thumbnail_189x": "https://roa...", "roaster_logo_thumbnail_190x": "https://roa...", "roaster_logo_thumbnail_191x": "https://roa...", "roaster_logo_thumbnail_192x": "https://roa...", "roaster_logo_thumbnail_193x": "https://roa...", "roaster_logo_thumbnail_194x": "https://roa...", "roaster_logo_thumbnail_195x": "https://roa...", "roaster_logo_thumbnail_196x": "https://roa...", "roaster_logo_thumbnail_197x": "https://roa...", "roaster_logo_thumbnail_198x": "https://roa...", "roaster_logo_thumbnail_199x": "https://roa...", "roaster_logo_thumbnail_200x": "https://roa...", "roaster_logo_thumbnail_201x": "https://roa...", "roaster_logo_thumbnail_202x": "https://roa...", "roaster_logo_thumbnail_203x": "https://roa...", "roaster_logo_thumbnail_204x": "https://roa...", "roaster_logo_thumbnail_205x": "https://roa...", "roaster_logo_thumbnail_206x": "https://roa...", "roaster_logo_thumbnail_207x": "https://roa...", "roaster_logo_thumbnail_208x": "https://roa...", "roaster_logo_thumbnail_209x": "https://roa...", "roaster_logo_thumbnail_210x": "https://roa...", "roaster_logo_thumbnail_211x": "https://roa...", "roaster_logo_thumbnail_212x": "https://roa...", "roaster_logo_thumbnail_213x": "https://roa...", "roaster_logo_thumbnail_214x": "https://roa...", "roaster_logo_thumbnail_215x": "https://roa...", "roaster_logo_thumbnail_216x": "https://roa...", "roaster_logo_thumbnail_217x": "https://roa...", "roaster_logo_thumbnail_218x": "https://roa...", "roaster_logo_thumbnail_219x": "https://roa...", "roaster_logo_thumbnail_220x": "https://roa...", "roaster_logo_thumbnail_221x": "https://roa...", "roaster_logo_thumbnail_222x": "https://roa...", "roaster_logo_thumbnail_223x": "https://roa...", "roaster_logo_thumbnail_224x": "https://roa...", "roaster_logo_thumbnail_225x": "https://roa...", "roaster_logo_thumbnail_226x": "https://roa...", "roaster_logo_thumbnail_227x": "https://roa...", "roaster_logo_thumbnail_228x": "https://roa...", "roaster_logo_thumbnail_229x": "https://roa...", "roaster_logo_thumbnail_230x": "https://roa...", "roaster_logo_thumbnail_231x": "https://roa...", "roaster_logo_thumbnail_232x": "https://roa...", "roaster_logo_thumbnail_233x": "https://roa...", "roaster_logo_thumbnail_234x": "https://roa...", "roaster_logo_thumbnail_235x": "https://roa...", "roaster_logo_thumbnail_236x": "https://roa...", "roaster_logo_thumbnail_237x": "https://roa...", "roaster_logo_thumbnail_238x": "https://roa...", "roaster_logo_thumbnail_239x": "https://roa...", "roaster_logo_thumbnail_240x": "https://roa...", "roaster_logo_thumbnail_241x": "https://roa...", "roaster_logo_thumbnail_242x": "https://roa...", "roaster_logo_thumbnail_243x": "https://roa...", "roaster_logo_thumbnail_244x": "https://roa...", "roaster_logo_thumbnail_245x": "https://roa...", "roaster_logo_thumbnail_246x": "https://roa...", "roaster_logo_thumbnail_247x": "https://roa...", "roaster_logo_thumbnail_248x": "https://roa...", "roaster_logo_thumbnail_249x": "https://roa...", "roaster_logo_thumbnail_250x": "https://roa...", "roaster_logo_thumbnail_251x": "https://roa...", "roaster_logo_thumbnail_252x": "https://roa...", "roaster_logo_thumbnail_253x": "https://roa...", "roaster_logo_thumbnail_254x": "https://roa...", "roaster_logo_thumbnail_255x": "https://roa...", "roaster_logo_thumbnail_256x": "https://roa...", "roaster_logo_thumbnail_257x": "https://roa...", "roaster_logo_thumbnail_258x": "https://roa...", "roaster_logo_thumbnail_259x": "https://roa...", "roaster_logo_thumbnail_260x": "https://roa...", "roaster_logo_thumbnail_261x": "https://roa...", "roaster_logo_thumbnail_262x": "https://roa...", "roaster_logo_thumbnail_263x": "https://roa...", "roaster_logo_thumbnail_264x": "https://roa...", "roaster_logo_thumbnail_265x": "https://roa...", "roaster_logo_thumbnail_266x": "https://roa...", "roaster_logo_thumbnail_267x": "https://roa...", "roaster_logo_thumbnail_268x": "https://roa...", "roaster_logo_thumbnail_269x": "https://roa...", "roaster_logo_thumbnail_270x": "https://roa...", "roaster_logo_thumbnail_271x": "https://roa...", "roaster_logo_thumbnail_272x": "https://roa...", "roaster_logo_thumbnail_273x": "https://roa...", "roaster_logo_thumbnail_274x": "https://roa...", "roaster_logo_thumbnail_275x": "https://roa...", "roaster_logo_thumbnail_276x": "https://roa...", "roaster_logo_thumbnail_277x": "https://roa...", "roaster_logo_thumbnail_278x": "https://roa...", "roaster_logo_thumbnail_279x": "https://roa...", "roaster_logo_thumbnail_280x": "https://roa...", "roaster_logo_thumbnail_281x": "https://roa...", "roaster_logo_thumbnail_282x": "https://roa...", "roaster_logo_thumbnail_283x": "https://roa...", "roaster_logo_thumbnail_284x": "https://roa...", "roaster_logo_thumbnail_285x": "https://roa...", "roaster_logo_thumbnail_286x": "https://roa...", "roaster_logo_thumbnail_287x": "https://roa...", "roaster_logo_thumbnail_288x": "https://roa...", "roaster_logo_thumbnail_289x": "https://roa...", "roaster_logo_thumbnail_290x": "https://roa...", "roaster_logo_thumbnail_291x": "https://roa...", "roaster_logo_thumbnail_292x": "https://roa...", "roaster_logo_thumbnail_293x": "https://roa...", "roaster_logo_thumbnail_294x": "https://roa...", "roaster_logo_thumbnail_295x": "https://roa...", "roaster_logo_thumbnail_296x": "https://roa...", "roaster_logo_thumbnail_297x": "https://roa...", "roaster_logo_thumbnail_298x": "https://roa...", "roaster_logo_thumbnail_299x": "https://roa...", "roaster_logo_thumbnail_300x": "https://roa...", "roaster_logo_thumbnail_301x": "https://roa...", "roaster_logo_thumbnail_302x": "https://roa...", "roaster_logo_thumbnail_303x": "https://roa...", "roaster_logo_thumbnail_304x": "https://roa...", "roaster_logo_thumbnail_305x": "https://roa...", "roaster_logo_thumbnail_306x": "https://roa...", "roaster_logo_thumbnail_307x": "https://roa...", "roaster_logo_thumbnail_308x": "https://roa...", "roaster_logo_thumbnail_309x": "https://roa...", "roaster_logo_thumbnail_310x": "https://roa...", "roaster_logo_thumbnail_311x": "https://roa...", "roaster_logo_thumbnail_312x": "https://roa...", "roaster_logo_thumbnail_313x": "https://roa...", "roaster_logo_thumbnail_314x": "https://roa...", "roaster_logo_thumbnail_315x": "https://roa...", "roaster_logo_thumbnail_316x": "https://roa...", "roaster_logo_thumbnail_317x": "https://roa...", "roaster_logo_thumbnail_318x": "https://roa...", "roaster_logo_thumbnail_319x": "https://roa...", "roaster_logo_thumbnail_320x": "https://roa...", "roaster_logo_thumbnail_321x": "https://roa...", "roaster_logo_thumbnail_322x": "https://roa...", "roaster_logo_thumbnail_323x": "https://roa...", "roaster_logo_thumbnail_324x": "https://roa...", "roaster_logo_thumbnail_325x": "https://roa...", "roaster_logo_thumbnail_326x": "https://roa...", "roaster_logo_thumbnail_327x": "https://roa...", "roaster_logo_thumbnail_328x": "https://roa...", "roaster_logo_thumbnail_329x": "https://roa...", "roaster_logo_thumbnail_330x": "https://roa...", "roaster_logo_thumbnail_331x": "https://roa...", "roaster_logo_thumbnail_332x": "https://roa...", "roaster_logo_thumbnail_333x": "https://roa...", "roaster_logo_thumbnail_334x": "https://roa...", "roaster_logo_thumbnail_335x": "https://roa...", "roaster_logo_thumbnail_336x": "https://roa...", "roaster_logo_thumbnail_337x": "https://roa...", "roaster_logo_thumbnail_338x": "https://roa...", "roaster_logo_thumbnail_339x": "https://roa...", "roaster_logo_thumbnail_340x": "https://roa...", "roaster_logo_thumbnail_341x": "https://roa...", "roaster_logo_thumbnail_342x": "https://roa...", "roaster_logo_thumbnail_343x": "https://roa...", "roaster_logo_thumbnail_344x": "https://roa...", "roaster_logo_thumbnail_345x": "https://roa...", "roaster_logo_thumbnail_346x": "https://roa...", "roaster_logo_thumbnail_347x": "https://roa...", "roaster_logo_thumbnail_348x": "https://roa...", "roaster_logo_thumbnail_349x": "https://roa...", "roaster_logo_thumbnail_350x": "https://roa...", "roaster_logo_thumbnail_351x": "https://roa...", "roaster_logo_thumbnail_352x": "https://roa...", "roaster_logo_thumbnail_353x": "https://roa...", "roaster_logo_thumbnail_354x": "https://roa...", "roaster_logo_thumbnail_355x": "https://roa...", "roaster_logo_thumbnail_356x": "https://roa...", "roaster_logo_thumbnail_357x": "https://roa...", "roaster_logo_thumbnail_358x": "https://roa...", "roaster_logo_thumbnail_359x": "https://roa...", "roaster_logo_thumbnail_360x": "https://roa...", "roaster_logo_thumbnail_361x": "https://roa...", "roaster_logo_thumbnail_362x": "https://roa...", "roaster_logo_thumbnail_363x": "https://roa...", "roaster_logo_thumbnail_364x": "https://roa...", "roaster_logo_thumbnail_365x": "https://roa...", "roaster_logo_thumbnail_366x": "https://roa...", "roaster_logo_thumbnail_367x": "https://roa...", "roaster_logo_thumbnail_368x": "https://roa...", "roaster_logo_thumbnail_369x": "https://roa...", "roaster_logo_thumbnail_370x": "https://roa...", "roaster_logo_thumbnail_371x": "https://roa...", "roaster_logo_thumbnail_372x": "https://roa...", "roaster_logo_thumbnail_373x": "https://roa...", "roaster_logo_thumbnail_374x": "https://roa...", "roaster_logo_thumbnail_375x": "https://roa...", "roaster_logo_thumbnail_376x": "https://roa...", "roaster_logo_thumbnail_377x": "https://roa...", "roaster_logo_thumbnail_378x": "https://roa...", "roaster_logo_thumbnail_379x": "https://roa...", "roaster_logo_thumbnail_380x": "https://roa...", "roaster_logo_thumbnail_381x": "https://roa...", "roaster_logo_thumbnail_382x": "https://roa...", "roaster_logo_thumbnail_383x": "https://roa...", "roaster_logo_thumbnail_384x": "https://roa...", "roaster_logo_thumbnail_385x": "https://roa...", "roaster_logo_thumbnail_386x": "https://roa...", "roaster_logo_thumbnail_387x": "https://roa...", "roaster_logo_thumbnail_388x": "https://roa...", "roaster_logo_thumbnail_389x": "https://roa...", "roaster_logo_thumbnail_390x": "https://roa...", "roaster_logo_thumbnail_391x": "https://roa...", "roaster_logo_thumbnail_392x": "https://roa...", "roaster_logo_thumbnail_393x": "https://roa...", "roaster_logo_thumbnail_394x": "https://roa...", "roaster_logo_thumbnail_395x": "https://roa...", "roaster_logo_thumbnail_396x": "https://roa...", "roaster_logo_thumbnail_397x": "https://roa...", "roaster_logo_thumbnail_398x": "https://roa...", "roaster_logo_thumbnail_399x": "https://roa...", "roaster_logo_thumbnail_400x": "https://roa...", "roaster_logo_thumbnail_401x": "https://roa...", "roaster_logo_thumbnail_402x": "https://roa...", "roaster_logo_thumbnail_403x": "https://roa...", "roaster_logo_thumbnail_404x": "https://roa...", "roaster_logo_thumbnail_405x": "https://roa...", "roaster_logo_thumbnail_406x": "https://roa...", "roaster_logo_thumbnail_407x": "https://roa...", "roaster_logo_thumbnail_408x": "https://roa...", "roaster_logo_thumbnail_409x": "https://roa...", "roaster_logo_thumbnail_410x": "https://roa...", "roaster_logo_thumbnail_411x": "https://roa...", "roaster_logo_thumbnail_412x": "https://roa...", "roaster_logo_thumbnail_413x": "https://roa...", "roaster_logo_thumbnail_414x": "https://roa...", "roaster_logo_thumbnail_415x": "https://roa...", "roaster_logo_thumbnail_416x": "https://roa...", "roaster_logo_thumbnail_417x": "https://roa...", "roaster_logo_thumbnail_418x": "https://roa...", "roaster_logo_thumbnail_419x": "https://roa...", "roaster_logo_thumbnail_420x": "https://roa...", "roaster_logo_thumbnail_421x": "https://roa...", "roaster_logo_thumbnail_422x": "https://roa...", "roaster_logo_thumbnail_423x": "https://roa...", "roaster_logo_thumbnail_424x": "https://roa...", "roaster_logo_thumbnail_425x": "https://roa...", "roaster_logo_thumbnail_426x": "https://roa...", "roaster_logo_thumbnail_427x": "https://roa...", "roaster_logo_thumbnail_428x": "https://roa...", "roaster_logo_thumbnail_429x": "https://roa...", "roaster_logo_thumbnail_430x": "https://roa...", "roaster_logo_thumbnail_431x": "https://roa...", "roaster_logo_thumbnail_432x": "https://roa...", "roaster_logo_thumbnail_433x": "https://roa...", "roaster_logo_thumbnail_434x": "https://roa...", "roaster_logo_thumbnail_435x": "https://roa...", "roaster_logo_thumbnail_436x": "https://roa...", "roaster_logo_thumbnail_437x": "https://roa...", "roaster_logo_thumbnail_438x": "https://roa...", "roaster_logo_thumbnail_439x": "https://roa...", "roaster_logo_thumbnail_440x": "https://roa...", "roaster_logo_thumbnail_441x": "https://roa...", "roaster_logo_thumbnail_442x": "https://roa...", "roaster_logo_thumbnail_443x": "https://roa...", "roaster_logo_thumbnail_444x": "https://roa...", "roaster_logo_thumbnail_445x": "https://roa...", "roaster_logo_thumbnail_446x": "https://roa...", "roaster_logo_thumbnail_447x": "https://roa...", "roaster_logo_thumbnail_448x": "https://roa...", "roaster_logo_thumbnail_449x": "https://roa...", "roaster_logo_thumbnail_450x": "https://roa...", "roaster_logo_thumbnail_451x": "https://roa...", "roaster_logo_thumbnail_452x": "https://roa...", "roaster_logo_thumbnail_453x": "https://roa...", "roaster_logo_thumbnail_454x": "https://roa...", "roaster_logo_thumbnail_456x": "https://roa...", "roaster_logo_thumbnail_457x": "https://roa...", "roaster_logo_thumbnail_458x": "https://roa...", "roaster_logo_thumbnail_459x": "https://roa...", "roaster_logo_thumbnail_460x": "https://roa...", "roaster_logo_thumbnail_461x": "https://roa...", "roaster_logo_thumbnail_462x": "https://roa...", "roaster_logo_thumbnail_463x": "https://roa...", "roaster_logo_thumbnail_464x": "https://roa...", "roaster_logo_thumbnail_465x": "https://roa...", "roaster_logo_thumbnail_466x": "https://roa...", "roaster_logo_thumbnail_467x": "https://roa...", "roaster_logo_thumbnail_468x": "https://roa...", "roaster_logo_thumbnail_469x": "https://roa...", "roaster_logo_thumbnail_470x": "https://roa...", "roaster_logo_thumbnail_471x": "https://roa...", "roaster_logo_thumbnail_472x": "https://roa...", "roaster_logo_thumbnail_473x": "https://roa...", "roaster_logo_thumbnail_474x": "https://roa...", "roaster_logo_thumbnail_475x": "https://roa...", "roaster_logo_thumbnail_476x": "https://roa...", "roaster_logo_thumbnail_477x": "https://roa...", "roaster_logo_thumbnail_478x": "https://roa...", "roaster_logo_thumbnail_479x": "https://roa...", "roaster_logo_thumbnail_480x": "https://roa...", "roaster_logo_thumbnail_481x": "https://roa...", "roaster_logo_thumbnail_482x": "https://roa...", "roaster_logo_thumbnail_483x": "https://roa...", "roaster_logo_thumbnail_484x": "https://roa...", "roaster_logo_thumbnail_485x": "https://roa...", "roaster_logo_thumbnail_486x": "https://roa...", "roaster_logo_thumbnail_487x": "https://roa...", "roaster_logo_thumbnail_488x": "https://roa...", "roaster_logo_thumbnail_489x": "https://roa...", "roaster_logo_thumbnail_490x": "https://roa...", "roaster_logo_thumbnail_491x": "https://roa...", "roaster_logo_thumbnail_492x": "https://roa...", "roaster_logo_thumbnail_493x": "https://roa...", "roaster_logo_thumbnail_494x": "https://roa...", "roaster_logo_thumbnail_495x": "https://roa...", "roaster_logo_thumbnail_496x": "https://roa...", "roaster_logo_thumbnail_497x": "https://roa...", "roaster_logo_thumbnail_498x": "https://roa...", "roaster_logo_thumbnail_499x": "https://roa...", "roaster_logo_thumbnail_500x": "https://roa...", "roaster_logo_thumbnail_501x": "https://roa...", "roaster_logo_thumbnail_502x": "https://roa...", "roaster_logo_thumbnail_503x": "https://roa...", "roaster_logo_thumbnail_504x": "https://roa...", "roaster_logo_thumbnail_505x": "https://roa...", "roaster_logo_thumbnail_506x": "https://roa...", "roaster_logo_thumbnail_507x": "https://roa...", "roaster_logo_thumbnail_508x": "https://roa...", "roaster_logo_thumbnail_509x": "https://roa...", "roaster_logo_thumbnail_510x": "https://roa...", "roaster_logo_thumbnail_511x": "https://roa...", "roaster_logo_thumbnail_512x": "https://roa...", "roaster_logo_thumbnail_513x": "https://roa...", "roaster_logo_thumbnail_514x": "https://roa...", "roaster_logo_thumbnail_515x": "https://roa...", "roaster_logo_thumbnail_516x": "https://roa...", "roaster_logo_thumbnail_517x": "https://roa...", "roaster_logo_thumbnail_518x": "https://roa...", "roaster_logo_thumbnail_519x": "https://roa...", "roaster_logo_thumbnail_520x": "https://roa...", "roaster_logo_thumbnail_521x": "https://roa...", "roaster_logo_thumbnail_522x": "https://roa...", "roaster_logo_thumbnail_523x": "https://roa...", "roaster_logo_thumbnail_524x": "https://roa...", "roaster_logo_thumbnail_525x": "https://roa...", "roaster_logo_thumbnail_526x": "https://roa...", "roaster_logo_thumbnail_527x": "https://roa...", "roaster_logo_thumbnail_528x": "https://roa...", "roaster_logo_thumbnail_529x": "https://roa...", "roaster_logo_thumbnail_530x": "https://roa...", "roaster_logo_thumbnail_531x": "https://roa...", "roaster_logo_thumbnail_532x": "https://roa...", "roaster_logo_thumbnail_533x": "https://roa...", "roaster_logo_thumbnail_534x": "https://roa...", "roaster_logo_thumbnail_535x": "https://roa...", "roaster_logo_thumbnail_536x": "https://roa...", "roaster_logo_thumbnail_537x": "https://roa...", "roaster_logo_thumbnail_538x": "https://roa...", "roaster_logo_thumbnail_539x": "https://roa...", "roaster_logo_thumbnail_540x": "https://roa...", "roaster_logo_thumbnail_541x": "https://roa...", "roaster_logo_thumbnail_542x": "https://roa...", "roaster_logo_thumbnail_543x": "https://roa...", "roaster_logo_thumbnail_544x": "https://roa...", "roaster_logo_thumbnail_545x": "https://roa...", "roaster_logo_thumbnail_546x": "https://roa...", "roaster_logo_thumbnail_547x": "https://roa...", "roaster_logo_thumbnail_548x": "https://roa...", "roaster_logo_thumbnail_549x": "https://roa...", "roaster_logo_thumbnail_550x": "https://roa...", "roaster_logo_thumbnail_551x": "https://roa...", "roaster_logo_thumbnail_552x": "https://roa...", "roaster_logo_thumbnail_553x": "https://roa...", "roaster_logo_thumbnail_554x": "https://roa...", "roaster_logo_thumbnail_555x": "https://roa...", "roaster_logo_thumbnail_556x": "https://roa...", "roaster_logo_thumbnail_557x": "https://roa...", "roaster_logo_thumbnail_558x": "https://roa...", "roaster_logo_thumbnail_559x": "https://roa...", "roaster_logo_thumbnail_560x": "https://roa...", "roaster_logo_thumbnail_561x": "https://roa...", "roaster_logo_thumbnail_562x": "https://roa...", "roaster_logo_thumbnail_563x": "https://roa...", "roaster_logo_thumbnail_564x": "https://roa...", "roaster_logo_thumbnail_565x": "https://roa...", "roaster_logo_thumbnail_566x": "https://roa...", "roaster_logo_thumbnail_567x": "https://roa...", "roaster_logo_thumbnail_568x": "https://roa...", "roaster_logo_thumbnail_569x": "https://roa...", "roaster_logo_thumbnail_570x": "https://roa...", "roaster_logo_thumbnail_571x": "https://roa...", "roaster_logo_thumbnail_572x": "https://roa...", "roaster_logo_thumbnail_573x": "https://roa...", "roaster_logo_thumbnail_574x": "https://roa...", "roaster_logo_thumbnail_575x": "https://roa...", "roaster_logo_thumbnail_576x": "https://roa...", "roaster_logo_thumbnail_577x": "https://roa...", "roaster_logo_thumbnail_578x": "https://roa...", "roaster_logo_thumbnail_579x": "https://roa...", "roaster_logo_thumbnail_580x": "https://roa...", "roaster_logo_thumbnail_581x": "https://roa...", "roaster_logo_thumbnail_582x": "https://roa...", "roaster_logo_thumbnail_583x": "https://roa...", "roaster_logo_thumbnail_584x": "https://roa...", "roaster_logo_thumbnail_585x": "https://roa...", "roaster_logo_thumbnail_586x": "https://roa...", "roaster_logo_thumbnail_587x": "https://roa...", "roaster_logo_thumbnail_588x": "https://roa...", "roaster_logo_thumbnail_589x": "https://roa...", "roaster_logo_thumbnail_590x": "https://roa...", "roaster_logo_thumbnail_591x": "https://roa...", "roaster_logo_thumbnail_592x": "https://roa...", "roaster_logo_thumbnail_593x": "https://roa...", "roaster_logo_thumbnail_594x": "https://roa...", "roaster_logo_thumbnail_595x": "https://roa...", "roaster_logo_thumbnail_596x": "https://roa...", "roaster_logo_thumbnail_597x": "https://roa...", "roaster_logo_thumbnail_598x": "https://roa...", "roaster_logo_thumbnail_599x": "https://roa...", "roaster_logo_thumbnail_600x": "https://roa...", "roaster_logo_thumbnail_601x": "https://roa...", "roaster_logo_thumbnail_602x": "https://roa...", "roaster_logo_thumbnail_603x": "https://roa...", "roaster_logo_thumbnail_604x": "https://roa...", "roaster_logo_thumbnail_605x": "https://roa...", "roaster_logo_thumbnail_606x": "https://roa...", "roaster_logo_thumbnail_607x": "https://roa...", "roaster_logo_thumbnail_608x": "https://roa...", "roaster_logo_thumbnail_609x": "https://roa...", "roaster_logo_thumbnail_610x": "https://roa...", "roaster_logo_thumbnail_611x": "https://roa...", "roaster_logo_thumbnail_612x": "https://roa...", "roaster_logo_thumbnail_613x": "https://roa...", "roaster_logo_thumbnail_614x": "https://roa...", "roaster_logo_thumbnail_615x": "https://roa...", "roaster_logo_thumbnail_616x": "https://roa...", "roaster_logo_thumbnail_617x": "https://roa...", "roaster_logo_thumbnail_618x": "https://roa...", "roaster_logo_thumbnail_619x": "https://roa...", "roaster_logo_thumbnail_620x": "https://roa...", "roaster_logo_thumbnail_621x": "https://roa...", "roaster_logo_thumbnail_622x": "https://roa...", "roaster_logo_thumbnail_623x": "https://roa...", "roaster_logo_thumbnail_624x": "https://roa...", "roaster_logo_thumbnail_625x": "https://roa...", "roaster_logo_thumbnail_626x": "https://roa...", "roaster_logo_thumbnail_627x": "https://roa...", "roaster_logo_thumbnail_628x": "https://roa...", "roaster_logo_thumbnail_629x": "https://roa...", "roaster_logo_thumbnail_630x": "https://roa...", "roaster_logo_thumbnail_631x": "https://roa...", "roaster_logo_thumbnail_632x": "https://roa...", "roaster_logo_thumbnail_633x": "https://roa...", "roaster_logo_thumbnail_634x": "https://roa...", "roaster_logo_thumbnail_635x": "https://roa...", "roaster_logo_thumbnail_636x": "https://roa...", "roaster_logo_thumbnail_637x": "https://roa...", "roaster_logo_thumbnail_638x": "https://roa...", "roaster_logo_thumbnail_639x": "https://roa...", "roaster_logo_thumbnail_640x": "https://roa...", "roaster_logo_thumbnail_641x": "https://roa...", "roaster_logo_thumbnail_642x": "https://roa...", "roaster_logo_thumbnail_643x": "https://roa...", "roaster_logo_thumbnail_644x": "https://roa...", "roaster_logo_thumbnail_645x": "https://roa...", "roaster_logo_thumbnail_646x": "https://roa...", "roaster_logo_thumbnail_647x": "https://roa...", "roaster_logo_thumbnail_648x": "https://roa...", "roaster_logo_thumbnail_649x": "https://roa...", "roaster_logo_thumbnail_650x": "https://roa...", "roaster_logo_thumbnail_651x": "https://roa...", "roaster_logo_thumbnail_652x": "https://roa...", "roaster_logo_thumbnail_653x": "https://roa...", "roaster_logo_thumbnail_

Page 9
3/30/26, 10:38 AM Visualizer API

{
  "updated_at": 1741517580,
  "timeframe": [
    0,
    1.2,
    2.4
  ],
  "data": {
    "espresso_pressure": [
      0.5,
      2.7,
      8.4
    ],
    "espresso_flow": [
      0,
      1.4,
      2.3
    ]
  },
  "tags": [
    "daily",
    "washed"
  ]
}
Update shot
Path Parameters
id string · uuid required

Body
Body "daily", "washed" shot object required

Show Child Attributes Shot detail.
Responses
200 Updated shot detail.
401 Authentication required.
403 Not authorized.
404 Shot not found.
422 Invalid request payload.
429 Too many requests. The API rate limit has been exceeded.
PATCH /shots/{id}
Node.js Fetch ▾

fetch('https://visualizer.coffee/api/shots/123e4567-e89b-12d3-a456-4266141',
  method: 'PATCH',
  headers: {
    'Content-Type': 'application/json',
    Authorization: 'Bearer YOUR_SECRET_TOKEN'
  },
  body: JSON.stringify({
    shot: {
      // Your update data here
    }
  })
)
https://apidocs.visualizer.coffee/#tag/roasters/PATCH/roasters/{id} <page_number>9/28</page_number>

Page 10
3/30/26, 10:38 AM Visualizer API

{
    "id": "15d4ec9f-7f86-4f63-b2ac-cfce8277f33f",
    "user_id": "0c2f8248-7d67-44c1-a89a-3a6c0d468875",
    "profile_title": "Rao Allonge",
    "drink_weight": "42.1",
    "bean_weight": "20.0",
    "start_time": "2026-03-09T08:12:00Z",
    "updated_at": 1741517580,
    "timeframe": [
        0,
        1.2,
        2.4
    ],
    "data": {
        "espresso_pressure": [
            0.5,
            2.7,
            8.4
        ],
        "espresso_flow": [
            0,
            1.1,
            2.3
        ]
    },
    "tags": [
        "daily",
        "Washed"
    ]
}
▶ Test Request

Path Parameters
id string · uuid required

Responses
https://apidocs.visualizer.coffee/#tag/roasters/PATCH/roasters/{id} <page_number>10/28</page_number>

Page 11
3/30/26, 10:38 AM Visualizer API

200 Shot deleted.

401 Authentication required.

403 Not authorized.

404 Shot not found.

429 Too many requests. The API rate limit has been exceeded.

DELETE /shots/{id} Node.js Fetch ▾

fetch('https://visualizer.coffee/api/shots/123e4567-e89b-12d3-a456-426614174', {
  method: 'DELETE',
  headers: {
    Authorization: 'Bearer YOUR_SECRET_TOKEN'
  }
})
▶ Test Request

200 401 403 404 429

{
  "success": true
}
Shot deleted.

Download shot (alias of get shot)
Path Parameters
id string · uuid required

Query Parameters
format string · enum Optional output format used by shot serializers. Defaults to default when omitted. Legacy decent remains accepted as an alias for backward compatibility. values

https://apidocs.visualizer.coffee/#tag/roasters/PATCH/roasters/{id} <page_number>11/28</page_number>

Page 12
3/30/26, 10:38 AM Visualizer API

default beanconqueror

essentials When present, omits full shot information payload.

One of string string

Responses

200 Shot detail.
404 Shot not found.
429 Too many requests. The API rate limit has been exceeded.
GET /shots/{id}/download Node.js Fetch ▾

1 fetch('https://visualizer.coffee/api/shots/123e4567-e89b-12d3-a456-426614174244/download')

▶ Test Request

200 404 429 Show Schema ☐

{ "id": "15d4ec9f-7f86-4f63-b2ac-cfce8277f33f", "user_id": "0c2f8248-7d67-44c1-a89a-3a6c0d468875", "profile_title": "Rao Allonge", "drink_weight": "42.1", "bean_weight": "20.0", "start_time": "2026-03-09T08:12:00Z", "updated_at": 1741517580, "timeframe": [ 0, 1.2, 2.4 ], "data": { "espresso_pressure": [ 0.5, 2.7, 8.4 ] } }

https://apidocs.visualizer.coffee/#tag/roasters/PATCH/roasters/{id} <page_number>12/28</page_number>

Page 13
3/30/26, 10:38 AM Visualizer API

{
    "espresso_flow": [
        0,
        1.1,
        2.3
    ],
    "tags": [
        "daily",
        "personal"
    ]
}
Download shot profile file
Path Parameters
id string · uuid required Shot detail.

Query Parameters
format string · enum Profile output format. tcl is used when available and format is not json.

values csv json tcl

Responses
200 Profile file stream.
404 Shot not found.
422 Shot has no profile.
429 Too many requests. The API rate limit has been exceeded.
GET /shots/{id}/profile https://apidocs.visualizer.coffee/#tag/roasters/PATCH/roasters/{id}

Node.js Fetch ▾ <page_number>13/28</page_number>

Page 14
3/30/26, 10:38 AM Visualizer API

fetch('https://visualizer.coffee/api/shots/123e4567-e89b-12d3-a456-426614174')
Roasters ▶ Test Request
Operations
GET /roasters
POST /roasters
GET /roasters/{id}
PATCH /roasters/{id}
DELETE /roasters/{id}
List roasters
Query Parameters
page integer · min: 1 1-based page number (default 1).

items integer · min: 1 · max: 100 Items per page (default 10, max 100).

Responses
200 Paginated roaster summaries.
401 Authentication required.
429 Too many requests. The API rate limit has been exceeded.
GET /roasters
fetch('https://visualizer.coffee/api/roasters', {
  headers: {
    Authorization: 'Bearer YOUR_SECRET_TOKEN'
  }
})
▶ Test Request

https://apidocs.visualizer.coffee/#tag/roasters/PATCH/roasters/{id} <page_number>14/28</page_number>

Page 15
3/30/26, 10:38 AM Visualizer API

200 401 429 Show Schema ☐

{ "data": [ { "id": "123e4567-e89b-12d3-a456-426614174000", "name": "string" } ], "paging": { "count": 1, "page": 1, "limit": 1, "pages": 1 } }

Paginated roaster summaries.

Create roaster
Body required application/json

roaster object required

Show Child Attributes
Responses

201 Roaster created.

401 Authentication required.

403 Premium access or missing OAuth scope.

422 Validation failed.

429 Too many requests. The API rate limit has been exceeded.

POST /roasters Node.js Fetch ▾

fetch('https://visualizer.coffee/api/roasters', {
  method: 'POST',
https://apidocs.visualizer.coffee/#tag/roasters/PATCH/roasters/{id} <page_number>15/28</page_number>

Page 16
3/30/26, 10:38 AM Visualizer API

headers: {
    'Content-Type': 'application/json',
    Authorization: 'Bearer YOUR_SECRET_TOKEN'
},
body: JSON.stringify({
    roaster: {
        name: '',
        website: '',
        canonical_roaster_id: ''
    }
})
▶ Test Request

201 401 403 422 429 Show Schema ☐

{ "id": "123e4567-e89b-12d3-a456-426614174000", "name": "string", "website": "https://example.com", "image_url": "https://example.com" }

Roaster created.

Get roaster
Path Parameters
roaster_id string · uuid required

id

Responses
200 Roaster detail.

401 Authentication required.

404 Roaster not found.

429 Too many requests. The API rate limit has been exceeded.

https://apidocs.visualizer.coffee/#tag/roasters/PATCH/roasters/{id} <page_number>16/28</page_number>

Page 17
3/30/26, 10:38 AM Visualizer API

GET /roasters/{id}
Node.js Fetch ▾

fetch('https://visualizer.coffee/api/roasters/{id}', {
  headers: {
    Authorization: 'Bearer YOUR_SECRET_TOKEN'
  }
})
▶ Test Request

200 401 404 429

Show Schema ☐

{ "id": "123e4567-e89b-12d3-a456-426614174000", "name": "string", "website": "https://example.com", "image_url": "https://example.com" }

Roaster detail.

Update roaster
Path Parameters
roaster_id string · uuid required id

Body
required application/json

roaster object required

Show Child Attributes
Responses
200 Roaster updated.

401 Authentication required.

403 Premium access or missing OAuth scope.

https://apidocs.visualizer.coffee/#tag/roasters/PATCH/roasters/{id} <page_number>17/28</page_number>

Page 18
3/30/26, 10:38 AM Visualizer API

404 Roaster not found.

422 Validation failed.

429 Too many requests. The API rate limit has been exceeded.

PATCH /roasters/{id} Node.js Fetch ▾

fetch('https://visualizer.coffee/api/roasters/{id}', {
  method: 'PATCH',
  headers: {
    'Content-Type': 'application/json',
    Authorization: 'Bearer YOUR_SECRET_TOKEN'
  },
  body: JSON.stringify({
    roaster: {
      name: '',
      website: '',
      canonical_roaster_id: ''
    }
  })
})
▶ Test Request

200 401 403 404 422 429 Show Schema ☐

{ "id": "123e4567-e89b-12d3-a456-426614174000", "name": "string", "website": "https://example.com", "image_url": "https://example.com" }

Roaster updated.

Delete roaster

Path Parameters

roaster_id string · uuid required id

https://apidocs.visualizer.coffee/#tag/roasters/PATCH/roasters/{id} <page_number>18/28</page_number>

Page 19
3/30/26, 10:38 AM Visualizer API

Responses
200 Roaster deleted.
401
Authentication required.

403 Premium access or missing OAuth scope.
404 Roaster not found.
429 Too many requests. The API rate limit has been exceeded.
DELETE /roasters/{id} Node.js Fetch ▾

fetch('https://visualizer.coffee/api/roasters/{id}', {
    method: 'DELETE',
    headers: {
        Authorization: 'Bearer YOUR_SECRET_TOKEN'
    }
})
▶ Test Request

200 401 403 404 429 Show Schema ☐

{
    "success": true
}
Roaster deleted.

Coffee Bags
Operations
https://apidocs.visualizer.coffee/#tag/roasters/PATCH/roasters/{id} <page_number>19/28</page_number>

Page 20
3/30/26, 10:38 AM Visualizer API

GET /coffee_bags POST /coffee_bags GET /coffee_bags/{id} PATCH /coffee_bags/{id} DELETE /coffee_bags/{id} GET /roasters/{roaster_id}/coffee_bags GET /roasters/{roaster_id}/coffee_bags/{id}

List coffee bags
Query Parameters
page integer · min: 1 1-based page number (default 1).

items integer · min: 1 · max: 100 Items per page (default 10, max 100).

roaster_id string · uuid Filter coffee bags by roaster ID.

Responses
200 Paginated coffee bag summaries.
401 Authentication required.
429 Too many requests. The API rate limit has been exceeded.
GET /coffee_bags Node.js Fetch ▾

fetch('https://visualizer.coffee/api/coffee_bags', {
  headers: {
    Authorization: 'Bearer YOUR_SECRET_TOKEN'
  }
})
▶ Test Request

200 401 429 Show Schema ☐

https://apidocs.visualizer.coffee/#tag/roasters/PATCH/roasters/{id} <page_number>20/28</page_number>

Page 21
3/30/26, 10:38 AM Visualizer API

{
  "data": [
    {
      "id": "123e4567-e89b-12d3-a456-426614174000",
      "name": "string"
    }
  ],
  "paging": {
    "count": 1,
    "page": 1,
    "limit": 1,
    "pages": 1
  }
}
Paginated coffee bag summaries.

Create coffee bag
Body required application/json

coffee_bag object required

Show Child Attributes
Responses

201 Coffee bag created.

401 Authentication required.

403 Premium access or missing OAuth scope.

422 Validation failed.

429 Too many requests. The API rate limit has been exceeded.

POST /coffee_bags Node.js Fetch ▾

fetch('https://visualizer.coffee/api/coffee_bags', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
https://apidocs.visualizer.coffee/#tag/roasters/PATCH/roasters/{id} <page_number>21/28</page_number>

Page 22
3/30/26, 10:38 AM Visualizer API

5 Authorization: 'Bearer YOUR_SECRET_TOKEN'
6 },
7 body: JSON.stringify({
8 coffee_bag: {
9 name: '',
10 roaster_id: '',
11 canonical_coffee_bag_id: '',
12 roast_date: '',
13 frozen_date: '',
14 defrosted_date: '',
15 roast_level: '',
16 country: '',
17 region: '',
18 farm: '',
19 farmer: '',
20 variety: '',
21 elevation: '',
22 processing: ''
201 401 403 422 429 Show Schema ☐

{ "id": "123e4567-e89b-12d3-a456-426614174000", "name": "string", "roast_date": "2026-03-30", "frozen_date": "2026-03-30", "defrosted_date": "2026-03-30", "roast_level": "string", "country": "string", "region": "string", "farm": "string", "farmer": "string", "variety": "string", "elevation": "string", "processing": "string", "harvest_time": "string", "quality_score": "string", "tasting_notes": "string", "place_of_purchase": "string", "url": "https://example.com", "notes": "string", "archived_at": "2026-03-30T08:38:15.994Z", "image_url": "https://example.com", "metadata": { "additionalProperty": "anything" } }

▶ Test Request

https://apidocs.visualizer.coffee/#tag/roasters/PATCH/roasters/{id} <page_number>22/28</page_number>

Page 23
3/30/26, 10:38 AM Visualizer API

https://apidocs.visualizer.coffee/#tag/roasters/PATCH/roasters/{id} <page_number>23/28</page_number>

Page 24
3/30/26, 10:38 AM Visualizer API

https://apidocs.visualizer.coffee/#tag/roasters/PATCH/roasters/{id} <page_number>24/28</page_number>

Page 25
3/30/26, 10:38 AM Visualizer API

https://apidocs.visualizer.coffee/#tag/roasters/PATCH/roasters/{id} <page_number>25/28</page_number>

Page 26
3/30/26, 10:38 AM Visualizer API

Models
Error
DeleteResult
Paging
MeResponse
ShotSummary
ShotListResponse
ShotDetail
DefaultShotDetail
BeanconquerorShotDetail
SharedShotsResponse
ShotUploadPayload
BeanconquerorUploadPayload
https://apidocs.visualizer.coffee/#tag/roasters/PATCH/roasters/{id} <page_number>26/28</page_number>

Page 27
3/30/26, 10:38 AM Visualizer API

DecentUploadPayload
GaggiuinoUploadPayload
GaggiMateUploadPayload
MeticulousUploadPayload
ShotUploadResult
ShotBrewdata
ShotMetadata
ShotSeriesData
ShotSeries
BeanconquerorBean
BeanconquerorMill
BeanconquerorBrew
BeanconquerorPreparation
BeanconquerorMeta
DecentSeriesPayload
DecentTemperaturePayload
DecentTotalsPayload
GaggiuinoDatapoint
GaggiMateProfile
GaggiMateSample
MeticulousDatapoint
ShotUpdateRequest
RoasterSummary
RoasterListResponse
RoasterDetail
RoasterWriteRequest
CoffeeBagSummary
CoffeeBagListResponse
https://apidocs.visualizer.coffee/#tag/roasters/PATCH/roasters/{id} <page_number>27/28</page_number>

Page 28
3/30/26, 10:38 AM Visualizer API

CoffeeBagDetail

CoffeeBagWriteRequest

https://apidocs.visualizer.coffee/#tag/roasters/PATCH/roasters/{id} <page_number>28/28</page_number>