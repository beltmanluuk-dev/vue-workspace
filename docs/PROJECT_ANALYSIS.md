# VUE – Projektanalys (DEL 1)

## Sammanfattning

Projektet **VUE** är en mobil React Native-applikation byggd med **Expo SDK 54.0.33**, **React 19.1.0** och **React Native 0.81.5**. Applikationen är en AI-driven privatekonomiassistent med fokus på fakturhantering, betalningsoptimering, notifikationer, familjedelning och en modulär intelligensmotor (Clarity Engine).

> **Notering:** Den uppdragsbeskrivning som användaren skickade refererar till "Flutter" och "Dart", men det faktiska projektet är React Native/Expo. Denna analys behandlar därför den React Native-baserade kodbasmappen `c:\Users\sfpri\Documents\VUE\VUE`.

---

## 1. Teknisk stack

| Lager | Teknik | Version (från package.json) |
|---|---|---|
| Runtime | Expo | ~54.0.33 |
| Framework | React Native | 0.81.5 |
| React | React | 19.1.0 |
| Språk | TypeScript | ~5.9.2 |
| State management | Zustand | ^5.0.11 |
| Navigation | React Navigation (native-stack + bottom-tabs) | ^7.x |
| Styling | NativeWind / TailwindCSS | ^3.3.2 / ^4.2.1 |
| Ikoner | lucide-react-native | ^0.563.0 |
| Biometri | expo-local-authentication | ^17.0.8 |
| Animationer | react-native-reanimated | ~4.1.1 |
| Gestures | react-native-gesture-handler | ~2.28.0 |

---

## 2. Projektstruktur

```
c:\Users\sfpri\Documents\VUE\VUE
├── App.tsx                 # App-entry, splash, biometri, theme-provider
├── app.json                # Expo-konfiguration
├── package.json            # Dependencies
├── tailwind.config.js      # Tailwind-konfiguration
├── babel.config.js         # Babel-preset-expo
├── src/
│   ├── ai/                 # AI-provider-adapter (Groq, Claude, factory)
│   ├── components/         # Återanvändbara UI-komponenter
│   ├── context/            # ThemeContext (idag underanvänd)
│   ├── data/               # Mockdata-laddare
│   ├── engine/             # ClarityEngineV2 + analysmoduler
│   ├── features/           # (nytt) kommer att innehålla open_banking
│   ├── hooks/              # Custom hooks (useAI, useNotifications, m.fl.)
│   ├── navigation/         # RootNavigator, TabNavigator
│   ├── payments/           # PaymentScheduler med metodsimulering
│   ├── screens/            # 25+ skärmar
│   ├── services/           # NotificationService
│   ├── store/              # Zustand-store (appStore.ts)
│   ├── theme/              # Legacy färg/tema-konstanter
│   ├── types/              # Delade TypeScript-typer
│   └── utils/              # Helpers (formatCurrency, m.fl.)
```

---

## 3. State management

- **Zustand** används för global state.
- Store: `src/store/appStore.ts`.
- Hanterar användare, fakturor, budgetar, familj, notifikationer, AI-kontext, betalningsinställningar, autopilot, m.m.
- Inga middleware för persistence är synlig i den version vi läst.

---

## 4. Navigation

- **React Navigation v7**.
- `RootNavigator`: native stack med 25+ skärmar (Welcome, Onboarding, Dashboard, Bills, AIAssistant, m.fl.).
- `TabNavigator`: bottom tabs för huvudflöden (Dashboard, Bills, Analytics, Settings, etc.).
- Typning via `RootStackParamList`.

---

## 5. Datamodeller

- Centrala typer finns i `src/types/`.
- Viktiga entiteter: `Bill`, `User`, `Budget`, `FamilyMember`, `Insight`, `Notification`.
- Mockdata laddas via `src/data/mockDataLoader.ts`.

---

## 6. Services & API

- **NotificationService** (`src/services/NotificationService.ts`): genererar in-app-notifikationer för förfallna fakturor, budgetvarningar, prisökningar, m.m.
- **PaymentScheduler** (`src/payments/PaymentScheduler.ts`): simulerar betalningsmetoder (Apple Pay, banköverföring, autogiro, Swish).
- **AI-modul** (`src/ai/`): leverantörsagnostisk adapter för Groq (nu) och Claude (senare). Läser API-nyckel från miljövariabel.
- **Inga externa bank/Open Banking-anslutningar** ännu.

---

## 7. Säkerhet & secrets

- **Risk:** `.gitignore` ignorerar endast `.env*.local`, inte generella `.env`. Åtgärdas.
- **Risk:** Ingen `.env` finns just nu, men `.env.example` har skapats som mall.
- **Risk:** API-nyckel (Groq) har tidigare exponerats i chatten och ska rotteras.
- Inga hårdkodade secrets hittades i den aktuella källkoden.
- Biometri hanteras via `expo-local-authentication`.

---

## 8. Build-konfiguration

- Expo-managed workflow.
- `app.json` med iOS/Android/web-konfiguration.
- `newArchEnabled: true` (React Native new architecture).
- Ingen CI/CD-pipeline synlig.
- Ingen ESLint/Prettier-konfiguration synlig (enbart TypeScript).

---

## 9. Identifierade tekniska skulder & risker

| # | Problem | Risknivå | Åtgärd |
|---|---|---|---|
| 1 | Legacy theme (`src/theme`) och ThemeContext lever parallellt. 46 filer importerar statiska `colors` från `../theme`. | Medel | Migrera till ThemeContext eller centralisera tema-valet. |
| 2 | Ingen `.env` i `.gitignore`. | Hög | Lägg till `.env` i `.gitignore`. |
| 3 | Ingen backend/validering av Open Banking-anrop. | Medel | Bygg modulär arkitektur (pågår). |
| 4 | Ingen testsvit. | Medel | Lägg till unit/integration-tester i nästa fas. |
| 5 | Ingen lint/formatter-konfiguration. | Låg | Lägg till ESLint/Prettier. |
| 6 | Potentiell duplicerad kod mellan skärmar och komponenter (t.ex. QuickActions, header-stilar). | Låg | Refaktorera vid behov. |
| 7 | AI-nycklar hanteras klient-sidigt. | Medel | I produktion: proxy eller secure storage. |

---

## 10. Rekommendationer inför nästa fas

1. **Tema:** Slå ihop legacy `src/theme` och `ThemeContext` så att temavalet är globalt och dynamiskt.
2. **Open Banking:** Implementera interfaces och repositories i `src/features/open_banking/` innan externa API-nycklar används.
3. **Tester:** Lägg till Jest/Expo-testsetup.
4. **CI/CD:** GitHub Actions för type-check, lint och build.
5. **Säkerhet:** Flytta AI/Open Banking-nycklar till backend-proxy eller secure storage.

---

*Rapport genererad: 2026-08-05*
