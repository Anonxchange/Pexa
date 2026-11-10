/**
 * PII / sensitive-data filter for the auto-translation pipeline.
 *
 * isLikelyPII   — returns a reason code if the string looks like sensitive data,
 *                 or null if it looks like safe UI copy.
 * shouldTranslate — convenience wrapper; returns false for empty / PII strings.
 *
 * All tests live in pii-filter.test.ts. Do NOT duplicate patterns here —
 * extend them in this file and add fixtures to the test file.
 */

export type PIIReason =
  | "too-long"
  | "too-short"
  | "all-symbols"
  | "low-letter-density"
  | "verbatim"
  | "long-digit"
  | "email"
  | "url"
  | "phone-intl"
  | "evm-hex"
  | "long-hex"
  | "identifier-token"
  | "wif-key"
  | "bip32-key"
  | "jwt"
  | "uuid"
  | "mnemonic";

const MAX_LEN = 500;

/**
 * Case-sensitive verbatim block list.
 * "BTC" (all-caps ticker) is blocked; "btc" (common-noun usage in a sentence)
 * is allowed. Extend this list but do not remove existing entries.
 */
const VERBATIM = new Set([
  "Pexly",
  "BTC", "ETH", "USDT", "SOL", "BNB", "XRP", "DOGE", "TRX",
  "MATIC", "USDC", "DAI", "WBTC", "AVAX", "LTC", "BCH",
  "P2P", "KYC", "AML", "NFT", "DeFi", "DAO",
]);

// ── Pattern constants ────────────────────────────────────────────────────────

const EMAIL_RE = /\b[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}\b/i;

// https:// OR www. prefix URLs
const URL_RE = /\bhttps?:\/\/\S+|\bwww\.\S+/i;

// International phone numbers: must have a + country-code prefix
// (e.g. +1 (555) 123-4567, +234 803 123 4567).
// Pure digit strings with no + prefix (OTPs, account IDs) fall to long-digit.
const PHONE_RE = /\+[\d\s\-().]{10,}\d/;

// 6+ consecutive digits (OTPs, account numbers, IDs)
const LONG_DIGIT_RE = /\d{6,}/;

// EVM: 0x-prefixed hex ≥ 20 hex chars (addresses, tx hashes, raw private keys)
const EVM_HEX_RE = /\b0x[a-f0-9]{20,}\b/i;

// Raw hex without 0x prefix, ≥ 32 chars (hashes, secrets)
// Note: checked AFTER EVM_HEX_RE so 0x strings are never double-counted.
const LONG_HEX_RE = /\b[a-f0-9]{32,}\b/i;

// BIP32 extended keys: xpub / xprv / ypub / yprv / zpub / zprv / tpub / tprv
const BIP32_RE = /\b[xyzt]p(?:ub|rv)[1-9A-HJ-NP-Za-km-z]{100,}\b/;

// WIF private keys: 51-52 base58 chars starting with 5 (uncompressed)
// or K / L (compressed). Checked before the generic BASE58_RE.
const WIF_RE = /\b[5KL][1-9A-HJ-NP-Za-km-z]{50,51}\b/;

// Bitcoin bech32 mainnet addresses (bc1q… or bc1p…)
const BECH32_RE = /\bbc1[a-z0-9]{30,}\b/i;

// Generic base58 token ≥ 30 chars (BTC legacy addresses, Solana addresses, …)
const BASE58_RE = /\b[1-9A-HJ-NP-Za-km-z]{30,}\b/;

// JWT: three base64url segments separated by dots, header always starts eyJ
const JWT_RE = /\beyJ[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]*/;

// UUID (any variant / version)
const UUID_RE = /\b[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}\b/i;

/**
 * BIP39 mnemonic word list — comprehensive subset covering all 26 letters.
 * The full list has 2 048 words; this subset is large enough that any real
 * 12-word seed phrase will contain ≥ 6 matches.
 *
 * IMPORTANT: the /gi flags are required so String.match() returns ALL matches
 * (not just the first capture group). Without /g the count is always ≤ 2.
 */
const BIP39_RE =
  /\b(?:abandon|ability|able|about|above|absent|absorb|abstract|absurd|abuse|access|accident|account|accuse|achieve|acid|acoustic|acquire|across|act|action|actor|actress|actual|adapt|add|addict|address|adjust|admit|adult|advance|advice|aerobic|affair|afford|afraid|again|age|agent|agree|ahead|aim|air|airport|aisle|alarm|album|alcohol|alert|alien|all|alley|allow|almost|alone|alpha|already|also|alter|always|amateur|amazing|among|amount|amused|analyst|anchor|ancient|anger|angle|angry|animal|ankle|announce|annual|another|answer|antenna|antique|anxiety|apart|apology|appear|apple|approve|april|arch|arctic|area|arena|argue|arm|armed|armor|army|around|arrange|arrest|arrive|arrow|art|artefact|artist|artwork|ask|aspect|assault|asset|assist|assume|asthma|athlete|atom|attack|attend|attitude|attract|auction|audit|august|aunt|author|auto|autumn|average|avocado|avoid|awake|aware|away|awesome|awful|awkward|axis|baby|bacon|badge|balance|balcony|ball|bamboo|banana|banner|barely|bargain|barrel|basic|basket|battle|beach|bean|beauty|become|beef|before|begin|behave|behind|believe|below|belt|bench|benefit|betray|better|between|beyond|bicycle|bind|biology|bird|birth|bitter|black|blade|blame|blanket|blast|bleak|bless|blind|blood|blossom|blow|blue|blur|blush|board|boat|body|boil|bomb|bone|book|boost|border|boring|borrow|boss|bottom|bounce|box|bracket|brain|brand|brave|breeze|brick|bridge|brief|bright|bring|brisk|broken|bronze|broom|brother|brown|brush|bubble|buddy|budget|buffalo|build|bulb|bulk|bullet|bundle|bunker|burden|burger|burst|busy|butter|buyer|buzz|cabbage|cabin|cable|cactus|cage|calm|camera|camp|canal|cancel|candy|cannon|canvas|canyon|capable|capital|captain|carbon|card|cargo|carpet|carry|cart|cash|casino|castle|casual|catalog|catch|category|cattle|caught|cause|caution|cave|cereal|chair|chalk|champion|change|chaos|chapter|charge|chase|chat|cheap|check|cheese|chef|cherry|chest|chicken|chief|child|chimney|choice|choose|chronic|chuckle|chunk|circle|citizen|civil|claim|clap|clarify|claw|clay|clean|clerk|clever|click|client|cliff|climb|clinic|clip|clock|clog|cloth|cloud|clown|club|clue|cluster|coach|coast|coconut|code|coil|coin|collect|color|column|combine|come|comfort|comic|common|company|concert|conduct|confirm|congress|connect|consider|control|convince|cook|cool|copper|copy|coral|core|corn|correct|cost|cotton|couch|country|couple|course|cousin|cover|coyote|crack|cradle|craft|cram|crane|crash|crazy|cream|credit|creek|crew|cricket|crime|crisp|critic|cross|crouch|crowd|crucial|cruel|cruise|crumble|crunch|crush|crystal|cube|culture|cup|curious|current|curtain|curve|cushion|custom|cycle|damage|damp|dance|danger|daring|dash|daughter|deal|debate|debris|decade|decide|decline|decorate|decrease|deer|defense|define|defy|degree|delay|deliver|demand|demise|denial|dentist|deny|depart|depend|deposit|depth|derive|describe|desert|design|desk|despair|destroy|detail|detect|develop|device|devote|diagram|dial|diamond|diary|dice|diesel|diet|differ|digital|dignity|dilemma|dinner|dinosaur|direct|dirt|disagree|discover|disease|dish|dismiss|disorder|display|distance|divert|divide|divorce|dizzy|doctor|document|dolphin|domain|donate|donkey|door|dose|double|dove|draft|dragon|drama|drastic|draw|dream|dress|drift|drill|drink|drip|drive|drop|drum|duck|dumb|dune|dust|duty|dwarf|dynamic|eager|eagle|early|earn|earth|easily|east|echo|ecology|edge|edit|educate|effort|egg|either|elbow|elder|electric|elegant|element|elephant|elevator|elite|embark|embody|embrace|emerge|emotion|employ|empty|enable|enact|endless|endorse|enemy|energy|enhance|enjoy|enlist|enough|enrich|entire|entry|episode|equal|equip|erase|erode|erosion|error|erupt|escape|essay|essence|estate|eternal|ethics|evidence|evil|evoke|evolve|exact|excess|exchange|excite|exclude|exercise|exhaust|exhibit|exile|exist|exit|exotic|expand|expire|explain|expose|express|extend|extra|eye|fable|face|faculty|faint|faith|fall|false|fame|family|famous|fancy|fantasy|fashion|fatal|father|fatigue|fault|favorite|feature|federal|fee|feed|feel|fellow|fence|festival|fetch|fever|fiber|fiction|field|figure|file|film|filter|final|find|fine|finger|finish|fire|firm|fiscal|fish|fitness|flag|flame|flash|flat|flavor|flee|flight|flip|float|flock|floor|flower|fluid|flush|foam|focus|fog|foil|follow|food|force|forest|forget|fork|fortune|forum|forward|fossil|foster|found|fragile|frame|frequent|fresh|friend|fringe|front|frost|frozen|fruit|fuel|furnace|fury|future|gadget|gain|galaxy|game|gap|garage|garbage|garden|garlic|garment|gather|gauge|gaze|general|genius|genre|gentle|genuine|gesture|ghost|giant|gift|giggle|ginger|giraffe|girl|give|glad|glance|glare|glass|glide|glimpse|globe|gloom|glory|glove|glow|glue|goat|goddess|gold|good|goose|gorilla|gospel|gossip|govern|gown|grab|grace|grain|grant|grape|grasp|grass|gravity|great|green|grid|grief|grit|grocery|group|grow|grunt|guard|guide|guilt|guitar|gym|habit|hair|half|hammer|hamster|hand|happy|harsh|harvest|hawk|hazard|health|heart|heavy|hedgehog|height|hello|helmet|help|hero|hidden|high|hill|hint|hire|history|hobby|hockey|hold|hole|holiday|hollow|honey|hood|hope|horn|hospital|host|hover|hub|huge|human|humble|humor|hungry|hunt|hurdle|hurry|hurt|husband|hybrid|icon|ignore|illegal|image|imitate|immense|immune|impact|impose|improve|impulse|income|increase|indicate|indoor|industry|infant|inflict|inform|inhale|inject|inner|innocent|input|inquiry|insane|insect|inspire|install|intact|interest|invest|invite|iron|island|isolate|issue|ivory|jacket|jaguar|jar|jazz|jealous|jelly|jewel|join|joke|journey|joy|judge|juice|jump|jungle|junior|junk|kangaroo|keen|keep|ketchup|kick|kingdom|kiss|kitchen|kite|kitten|kiwi|knee|knife|knock|know|lab|lamp|language|laptop|large|later|laugh|laundry|lava|lawn|lawsuit|layer|lazy|leader|learn|leave|lecture|legal|legend|lemon|lend|length|lens|leopard|lesson|letter|level|liberty|library|license|life|lift|limit|link|lion|liquid|list|little|live|lizard|load|loan|lobster|local|lock|logic|lonely|loop|lottery|loud|lounge|loyal|lucky|luggage|lumber|lunar|luxury|machine|magic|magnet|maid|main|mammal|mango|mansion|manual|maple|marble|margin|market|mask|master|match|material|math|matter|maximum|maze|meadow|medal|media|melody|melt|member|memory|mention|mercy|mesh|message|metal|method|middle|midnight|milk|million|mimic|mind|minimum|minor|miracle|miss|mistake|model|modify|monitor|monkey|monster|moral|morning|mosquito|motion|motor|mountain|move|movie|muffin|mule|multiply|muscle|museum|mushroom|music|mutual|mystery|naive|napkin|narrow|nasty|nature|near|neck|negative|neglect|nephew|nerve|nest|network|noble|noise|nominee|noodle|normal|north|notable|notice|novel|nuclear|nurse|nut|obey|object|oblige|obscure|obtain|occur|ocean|offer|often|olympic|omit|onion|open|opinion|oppose|option|orange|orbit|orchard|order|ordinary|organ|orient|original|orphan|ostrich|outdoor|outside|oval|oyster|paddle|palace|panel|panic|panther|paper|parade|parent|park|parrot|party|patch|patrol|pause|pave|payment|peace|peanut|peasant|pelican|penalty|pencil|pepper|perfect|permit|photo|phrase|physical|piano|picnic|pigeon|pill|pilot|pioneer|pipe|pistol|pitch|pizza|planet|plastic|plate|pledge|pluck|plug|plunge|poem|poet|polar|police|pond|pool|popular|portion|position|potato|poverty|powder|power|practice|praise|predict|prefer|prepare|pretty|prevent|pride|primary|prison|private|prize|process|produce|profit|program|project|promote|proof|property|prosper|protect|proud|provide|public|pudding|pulse|pumpkin|pupil|purchase|purity|purpose|quality|quantum|quarter|question|quick|quiz|rabbit|raccoon|race|radar|radio|rage|rail|rain|raise|rally|ramp|ranch|random|range|rapid|rare|raven|reach|rebel|rebuild|recall|receive|recipe|record|recycle|reduce|reflect|reform|refuse|region|regret|regular|reject|relax|rely|remain|remember|remind|remove|render|renew|rent|repair|repeat|replace|report|require|rescue|resource|response|result|retire|retreat|return|reunion|reveal|review|reward|rhythm|ribbon|ride|rifle|rigid|ring|riot|ripple|risk|ritual|rival|river|road|roast|robot|robust|rocket|romance|rookie|rose|rotate|rough|royal|rubber|rude|rural|sad|saddle|sadness|sail|salad|salmon|salon|salt|salute|sample|sand|satisfy|sauce|sausage|save|scale|scan|scatter|scheme|scissors|scorpion|scout|scrap|screen|script|season|seat|secret|section|security|seek|segment|select|sell|sense|series|service|session|settle|shadow|shaft|shallow|share|shed|shell|shield|shift|shine|ship|shiver|shock|shoot|shrimp|shrug|shuffle|sibling|siege|sight|sign|silent|silk|silver|similar|since|sing|sister|situate|sketch|skill|skin|skirt|skull|slab|slam|slender|slice|slide|slight|slim|slogan|slot|slush|smart|smile|smoke|smooth|snack|snake|snap|sniff|snow|soap|soccer|social|sock|solar|soldier|solid|solution|solve|song|soul|sound|soup|source|south|space|spare|spatial|spawn|speak|special|speed|spend|sphere|spice|spider|spike|spin|spirit|split|spoil|sponsor|spray|spread|spring|square|squeeze|squirrel|stable|stadium|stage|stamp|start|state|stay|steak|steel|stem|step|stick|sting|stock|stomach|stone|store|storm|story|stove|strategy|street|strike|strong|struggle|stuff|stumble|style|submit|subway|success|suffer|sugar|suggest|summer|sunny|sunset|supply|supreme|surface|surge|surprise|sustain|swallow|swamp|swap|sweet|swift|swing|switch|sword|symbol|symptom|tackle|talent|tank|tape|target|task|tattoo|taxi|teach|tenant|tennis|tent|thank|theme|theory|thrive|thumb|thunder|ticket|tilt|timber|tiny|tired|title|today|token|tomato|tongue|tonight|tool|topic|topple|torch|tornado|tortoise|tourist|toward|tower|track|trade|traffic|tragic|train|transfer|trap|trash|travel|treat|tree|trend|trial|tribe|trick|trim|trophy|trouble|truck|truly|trumpet|trust|truth|tube|tumble|tuna|tunnel|turkey|turtle|twelve|twenty|twice|twin|twist|ugly|umbrella|unable|unaware|uncle|uncover|under|undo|unfair|uniform|unique|universe|unknown|unusual|unveil|update|upgrade|uphold|upon|upper|upset|urban|useful|utility|vacant|vacuum|vague|valid|valley|valve|vanish|vapor|various|vast|vault|vehicle|velvet|vendor|venture|venue|version|veteran|viable|vibrant|vicious|victory|village|vintage|violin|virtual|virus|visa|visit|visual|vital|vivid|vocal|voice|vote|voyage|wage|wagon|wait|walk|wall|walnut|warfare|warm|warrior|waste|water|wave|wealth|weapon|weasel|wedding|weekend|weird|welcome|west|whale|wheat|wheel|whip|whisper|wide|width|wife|wild|window|wine|wing|winner|winter|wisdom|wish|witness|wolf|woman|wonder|wood|wool|word|world|worry|worth|wrap|wreck|wrestle|wrist|write|yard|year|yellow|young|youth|zebra|zero|zone|zoo)\b/gi;

export function isLikelyPII(input: string): PIIReason | null {
  if (!input) return null;
  const trimmed = input.trim();
  if (!trimmed) return null;

  // ── Hard length cap ───────────────────────────────────────────────────────
  if (trimmed.length > MAX_LEN) return "too-long";

  // ── Specific PII patterns ─────────────────────────────────────────────────
  // These are checked BEFORE structural checks (letter count, density) so that
  // strings like "+1 (555) 123-4567" (no letters) still get the right code.
  // Order within this block matters: more-specific sub-types come first.

  if (EMAIL_RE.test(trimmed))      return "email";
  if (URL_RE.test(trimmed))        return "url";
  if (UUID_RE.test(trimmed))       return "uuid";
  if (JWT_RE.test(trimmed))        return "jwt";

  // EVM / raw-hex must precede PHONE and LONG_DIGIT because hex strings
  // frequently contain long runs of digits (e.g. 0x...0532925...).
  if (EVM_HEX_RE.test(trimmed))   return "evm-hex";
  if (BIP32_RE.test(trimmed))      return "bip32-key";
  if (WIF_RE.test(trimmed))        return "wif-key";
  if (LONG_HEX_RE.test(trimmed))  return "long-hex";
  if (BECH32_RE.test(trimmed))     return "identifier-token";
  if (BASE58_RE.test(trimmed))     return "identifier-token";

  // Phone before long-digit: phone is more specific (requires + prefix).
  // Pure digit strings (OTPs, IDs) fall through to long-digit.
  if (PHONE_RE.test(trimmed))      return "phone-intl";
  if (LONG_DIGIT_RE.test(trimmed)) return "long-digit";

  // ── Structural / shape checks (generic, after specific patterns) ──────────
  const letterCount = (trimmed.match(/[a-zA-Z]/g) ?? []).length;
  if (letterCount === 0) return "all-symbols";
  if (letterCount < 2)   return "too-short";

  // More non-letter non-space chars than letters → likely an identifier/code
  const nonLetterNonSpace = (trimmed.match(/[^\sa-zA-Z]/g) ?? []).length;
  if (nonLetterNonSpace > letterCount) return "low-letter-density";

  // ── Verbatim brand / ticker list (case-sensitive) ─────────────────────────
  if (VERBATIM.has(trimmed)) return "verbatim";

  // ── Mnemonic seed phrase ──────────────────────────────────────────────────
  // Needs /g flag on BIP39_RE so String.match() returns ALL matches (a count),
  // not just the first capture group. Without /g, matches.length is always ≤ 2.
  const wordCount = (trimmed.match(/\b[a-z]+\b/gi) ?? []).length;
  if (wordCount >= 11) {
    const bip39Hits = trimmed.match(BIP39_RE);
    if (bip39Hits && bip39Hits.length >= 6) return "mnemonic";
  }

  return null;
}

export function shouldTranslate(input: string): boolean {
  if (!input) return false;
  const trimmed = input.trim();
  if (!trimmed) return false;
  return isLikelyPII(trimmed) === null;
}
