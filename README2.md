
# Skygruppen Compare - Documentation

## Overview
Skygruppen Compare er en omfattende webapplikasjon designet for å hjelpe brukere med å sammenligne ulike tjenesteleverandører på tvers av flere kategorier inkludert forsikring, strøm, mobilabonnement og banktjenester. Applikasjonen er bygget med React, TypeScript, og bruker moderne frontend-teknologier for å skape et responsivt og brukervennlig grensesnitt.

## Tech Stack
- **React**: Frontend-bibliotek for å bygge brukergrensesnitt
- **TypeScript**: For typesikkerhet og bedre utvikleropplevelse
- **React Router**: For sidenavigasjon og routing
- **Tailwind CSS**: For styling og responsiv design
- **Shadcn UI**: For ferdigbygde UI-komponenter
- **Lucide React**: For ikoner
- **Supabase**: For database og backend-funksjonalitet
- **TanStack Query**: For databehandling og state management

## Applikasjonsstruktur

### Dataimport System
Applikasjonen har et avansert dataimport-system som automatisk henter leverandørdata fra API-er:

#### Leverandørdata Filer
```
public/sample-data/
├── mobile-providers.txt      # 20 mobiloperatører
├── electricity-providers.txt # 20 strømleverandører  
├── insurance-providers.txt   # 20 forsikringsselskap
└── loan-providers.txt       # 20 bankleverandører
```

#### API Integration
- `src/lib/providerApis.ts`: Mapping av leverandører til deres API-endepunkter
- `src/lib/services/dataImportService.ts`: Service for å hente og prosessere data fra API-er
- Automatisk fallback-data hvis API-er ikke er tilgjengelige
- Lagring av data i Supabase database

### Kjernkomponenter

#### Språksystem
- `LanguageContext.tsx`: Tilbyr context for språkbytte mellom norsk (nb) og engelsk (en)
- `LanguageToggle.tsx`: UI-komponent som lar brukere bytte mellom språk
- `i18n.ts`: Internasjonaliseringsverktøy og språkstrenger

#### Layout-komponenter
- `Header.tsx`: Navigasjonsbar med språkbytter og kategorikoblinger
- `Footer.tsx`: Sidefot med bedriftsinformasjon og koblinger

#### Sammenligningssystem
- `CategoryCard.tsx`: Viser tilgjengelige sammenligningskategorier på hjemmesiden
- `ComparisonTable.tsx`: Hovedkomponent for å vise leverandørsammenligninger med filtrering/sortering
- `ProviderCard.tsx`: Viser individuell leverandørinformasjon med vurderinger og funksjoner
- `DataImportManager.tsx`: Administrerer import av leverandørdata fra tekstfiler eller API-er

#### Data Import og Administrasjon
- `DataImport.tsx`: Dedikert side for dataimport og administrasjon
- Støtter opplasting av .txt-filer med leverandørnavn
- Automatisk API-oppdagelse og datahenging
- Validering og lagring til Supabase

### Sider
- `Index.tsx`: Landingssiden som viser alle tilgjengelige kategorier
- `Compare.tsx`: Sammenligningssiden for en spesifikk kategori
- `DataImport.tsx`: Administrasjonsside for dataimport
- `NotFound.tsx`: 404 feilside

### Datamodell
Applikasjonen bruker TypeScript-grensesnitt for å definere datastrukturer:

- `Language`: Type som definerer støttede språk ('nb' | 'en')
- `Category`: Grensesnitt for kategoridata inkludert flerspråklig navn og beskrivelse
- `Provider`: Grensesnitt for leverandørdata inkludert priser, funksjoner og vurderinger
- `ComparisonFilters`: Grensesnitt for filtrerings- og sorteringsalternativer

### Database Schema (Supabase)

#### Hovedtabeller
```sql
-- Leverandørtilbud fra API-import
provider_offers (
  id uuid PRIMARY KEY,
  provider_name text NOT NULL,
  category text NOT NULL,
  plan_name text NOT NULL,
  monthly_price numeric NOT NULL,
  offer_url text NOT NULL,
  source_url text NOT NULL,
  features jsonb DEFAULT '{}',
  logo_url text,
  is_active boolean DEFAULT true,
  scraped_at timestamp with time zone DEFAULT now()
)

-- Konfigurasjoner for leverandør-API-er
provider_configs (
  id uuid PRIMARY KEY,
  provider_name text NOT NULL,
  category text NOT NULL,
  scrape_url text NOT NULL,
  api_config jsonb DEFAULT '{}',
  selectors jsonb DEFAULT '{}',
  is_enabled boolean DEFAULT true
)

-- Datakilder og pålitelighet
data_sources (
  id uuid PRIMARY KEY,
  provider_name text NOT NULL,
  category text NOT NULL,
  source_type text NOT NULL,
  api_endpoint text,
  reliability_score integer DEFAULT 100,
  last_successful_fetch timestamp with time zone
)
```

### Design System
Applikasjonen bruker et konsistent fargeskjema:
- Primærfarger: Himmelblå varianter for generelle UI-elementer
- Kategori-spesifikke farger: Ulike farger for forskjellige kategorier (f.eks. smaragd for strøm, blå for forsikring)
- UI-elementer bruker Shadcn UI-komponenter for konsistens

## Hvordan det fungerer

### Brukerflyt
1. Bruker lander på hjemmesiden og ser tilgjengelige sammenligningskategorier
2. Bruker velger en kategori å sammenligne (f.eks. forsikring, mobilabonnement)
3. Bruker tas til en sammenligningsside som viser alle leverandører i den kategorien
4. Bruker kan filtrere og sortere leverandører basert på ulike kriterier
5. Bruker kan velge en leverandør for å besøke deres nettside

### Dataimport Prosess
1. **Filopplasting**: Administrator laster opp .txt-fil med leverandørnavn eller bruker eksempeldata
2. **API-oppdagelse**: System finner automatisk riktig API-endepunkt for hver leverandør
3. **Datahenging**: Henter sanntidsdata fra leverandør-API-er
4. **Datavalidering**: Validerer og standardiserer dataformatet
5. **Lagring**: Lagrer data i Supabase database
6. **Visning**: Data vises automatisk på frontend

### API Integration
- Hver leverandør har en konfigurasjon i `providerApis.ts`
- Automatisk retry-mekanisme ved API-feil
- Fallback til standard priser hvis API ikke er tilgjengelig
- Logging av alle API-kall for debugging

### Internasjonalisering
- Alt tekstinnhold er tilgjengelig på både norsk og engelsk
- Språk kan byttes ved å bruke språkbytteren i headeren
- Det valgte språket lagres i React context og brukes gjennom hele appen

### Responsiv Design
- Mobile-first tilnærming med skreddersydde layouter for ulike skjermstørrelser
- Mobilmeny for mindre skjermer med hamburgerikon
- Responsive grid-layouter som tilpasses basert på skjermbredde

### Leverandørdata
- Leverandørinformasjon inkluderer logoer, priser, funksjoner og vurderinger
- Leverandører kan sorteres etter pris, vurdering eller navn
- Filtrering lar brukere snevre ned leverandører basert på kriterier som minimumsvurdering

## Utvikling og Deployment

### GitHub Pages Deployment
Prosjektet er konfigurert for automatisk deployment til GitHub Pages:
- **Base URL**: `/skygruppen-smart-compare/` (for produksjon)
- **Automatisk deployment**: Via GitHub Actions når kode pushes til main branch
- **SPA støtte**: Inkluderer 404.html for riktig routing

### Lokalt miljø
```bash
npm install          # Installer avhengigheter
npm run dev          # Start development server
npm run build        # Bygg for produksjon
npm run preview      # Forhåndsvis produksjonsbygg
```

## Fremtidig Utvikling
- Backend-integrasjon for sanntidsdata fra leverandører
- Brukerkontoer for å lagre sammenligninger
- Mer detaljerte sammenligningsvisninger med funksjon-for-funksjon analyse
- Flere kategorier av leverandører
- Avanserte filtreringsalternativer
- Bedre API-integrasjoner med flere leverandører

## Filstruktur
```
src/
├── components/
│   ├── ui/                    # Shadcn UI komponenter
│   ├── DataImportManager.tsx  # Dataimport administrasjon
│   ├── CategoryCard.tsx       # Kategorivis komponent
│   ├── ComparisonTable.tsx    # Hovedsammenligningskomponent
│   ├── Header.tsx             # Navigasjonsheader
│   ├── Footer.tsx             # Sidefot
│   ├── LanguageToggle.tsx     # Språkbytter
│   ├── ProviderCard.tsx       # Leverandørvis komponent
│   └── PriceDisplay.tsx       # Prisvis med sanntidsdata
├── lib/
│   ├── services/
│   │   ├── dataImportService.ts    # API dataimport
│   │   └── buifylService.ts        # Buifyl API integration
│   ├── data/
│   │   └── providersLoader.ts      # Data-lasting utilities
│   ├── i18n.ts                     # Oversettelser
│   ├── languageContext.tsx         # Språkcontext
│   ├── types.ts                    # TypeScript grensesnitt
│   ├── utils.ts                    # Utility funksjoner
│   └── providerApis.ts             # API konfigurasjon
├── pages/
│   ├── Compare.tsx            # Sammenligningsside
│   ├── Index.tsx              # Hjemmeside
│   ├── DataImport.tsx         # Dataimport side
│   └── NotFound.tsx           # 404 side
├── integrations/
│   └── supabase/              # Supabase konfigurasjoner
└── App.tsx                    # Hovedapplikasjonskomponent

public/
└── sample-data/               # Leverandørdata filer
    ├── mobile-providers.txt
    ├── electricity-providers.txt
    ├── insurance-providers.txt
    └── loan-providers.txt
```

## Hvordan bruke nettstedet
1. Bla gjennom tilgjengelige kategorier på hjemmesiden
2. Klikk på en kategori for å se leverandørsammenligninger
3. Bruk filtre og sortering for å finne den beste leverandøren for dine behov
4. Klikk på "Velg leverandør" for å besøke leverandørens nettside
5. Bruk språkbytteren for å bytte mellom norsk og engelsk

## Administrasjon
- Gå til `/import` for å administrere leverandørdata
- Last opp .txt-filer med leverandørnavn for automatisk API-import
- Systemet henter automatisk data og lagrer i database
- All data vises umiddelbart på sammenligningssidene

## Hvordan utvide
- Legg til nye leverandører i providerApis.ts med API-konfigurasjon
- Opprett nye kategorier ved å legge til i categories array i i18n.ts
- Tilpass kategorifarger i ProviderCard-komponenten
- Legg til nye .txt-filer i public/sample-data/ for nye kategorier

## API-integrasjoner
Systemet støtter følgende API-typer:
- **REST API-er**: Standard HTTP GET/POST forespørsler
- **GraphQL**: Via spesialiserte endpoints
- **Fallback data**: Automatisk genererte data når API-er ikke er tilgjengelige
- **Rate limiting**: Innebygd respekt for API-grenser
- **Error handling**: Robust feilhåndtering med retry-mekanismer
