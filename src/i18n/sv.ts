/**
 * Svenska språksträngar för VUE
 * Marknad: Sverige (första lansering)
 */

export const sv = {
  // Allmänt
  app_name: 'VUE',
  app_tagline: 'Din ekonomiska autopilot',
  loading: 'Laddar...',
  error: 'Något gick fel',
  retry: 'Försök igen',
  cancel: 'Avbryt',
  confirm: 'Bekräfta',
  save: 'Spara',
  close: 'Stäng',
  back: 'Tillbaka',
  next: 'Nästa',
  done: 'Klar',
  yes: 'Ja',
  no: 'Nej',

  // Autentisering
  auth: {
    face_id: 'Använd Face ID',
    touch_id: 'Använd fingeravtryck',
    verify_identity: 'Verifiera din identitet',
    authentication_required: 'Autentisering krävs',
    authentication_failed: 'Verifiering misslyckades',
    try_again: 'Försök igen',
  },

  // Dashboard
  dashboard: {
    greeting_morning: 'God morgon',
    greeting_afternoon: 'God eftermiddag',
    greeting_evening: 'God kväll',
    your_economy: 'Din ekonomi',
    upcoming_bills: 'Kommande fakturor',
    this_month: 'Denna månad',
    total_bills: 'Totala fakturor',
    paid: 'Betalt',
    pending: 'Väntande',
    scheduled: 'Schemalagt',
  },

  // Ekonomisk stress
  stress: {
    low: 'Låg ekonomisk belastning',
    medium: 'Medel ekonomisk belastning',
    high: 'Hög ekonomisk belastning',
    critical: 'Kritisk ekonomisk situation',
    score_label: 'Stressnivå',
  },

  // Ekonomiskt väder
  weather: {
    sunny: 'Stabilt väder',
    sunny_description: 'Din ekonomi är i utmärkt skick',
    partly_cloudy: 'Delvis molnigt',
    partly_cloudy_description: 'Vissa utgifter närmar sig',
    cloudy: 'Molnigt',
    cloudy_description: 'Var uppmärksam på ekonomin',
    stormy: 'Stormvarning',
    stormy_description: 'Ekonomisk riskperiod',
  },

  // Momentum
  momentum: {
    improving: 'Förbättras',
    stabilizing: 'Stabiliseras',
    neutral: 'Neutral',
    increasing_risk: 'Ökad risk',
  },

  // Autopilot
  autopilot: {
    title: 'Autopilot',
    observe: 'Observera',
    observe_desc: 'VUE observerar din ekonomi',
    assist: 'Assistera',
    assist_desc: 'VUE assisterar med beslut',
    optimize: 'Optimera',
    optimize_desc: 'VUE optimerar betalningar',
    full: 'Full Autopilot',
    full_desc: 'VUE hanterar allt automatiskt',
    enabled: 'Autopilot aktiverad',
    disabled: 'Autopilot avaktiverad',
  },

  // Finansiella lägen
  modes: {
    stability: 'Stabilitet',
    stability_desc: 'Fokus på att hålla ekonomin stabil',
    optimization: 'Optimering',
    optimization_desc: 'Ekonomin är stark - dags att optimera',
    recovery: 'Återhämtning',
    recovery_desc: 'Fokus på att återställa ekonomin',
    transition: 'Övergång',
    transition_desc: 'Ekonomin går igenom förändring',
    family: 'Familj',
    family_desc: 'Familjeläge aktiverat',
  },

  // Fakturor
  bills: {
    title: 'Fakturor',
    all: 'Alla',
    pending: 'Väntande',
    scheduled: 'Schemalagda',
    paid: 'Betalda',
    overdue: 'Förfallna',
    pay_now: 'Betala nu',
    approve: 'Godkänn',
    verify: 'Verifiera',
    pause: 'Pausa',
    resume: 'Återuppta',
    due_today: 'Förfaller idag',
    due_tomorrow: 'Förfaller imorgon',
    due_in_days: 'Förfaller om {days} dagar',
    no_bills: 'Inga fakturor hittade',
    no_bills_desc: 'Anslut din bank för att hitta dina fakturor',
  },

  // Betalningar
  payments: {
    title: 'Betalning',
    amount: 'Belopp',
    to: 'Till',
    from_account: 'Från konto',
    payment_method: 'Betalningsmetod',
    apple_pay: 'Apple Pay',
    bank_transfer: 'Banköverföring',
    autogiro: 'Autogiro',
    payment_successful: 'Betalning genomförd',
    payment_failed: 'Betalning misslyckades',
    payment_scheduled: 'Betalning schemalagd',
    payment_optimized: 'Betalning optimerad av VUE',
  },

  // Varningar
  warnings: {
    balance_warning: 'Saldovarning',
    risk_in_days: 'Riskperiod om {days} dagar',
    negative_balance: 'Ditt saldo riskerar bli negativt',
    high_expense: 'Stora utgifter väntar',
    deviation_detected: 'Avvikelse upptäckt',
    price_increase: 'Prisökning upptäckt',
  },

  // Prenumerationer
  subscriptions: {
    title: 'Prenumerationer',
    monthly_cost: 'Månadskostnad',
    annual_cost: 'Årskostnad',
    usage: 'Användning',
    keep: 'Behåll',
    review: 'Granska',
    cancel: 'Avsluta',
    unused: 'Denna prenumeration verkar sällan användas',
    duplicate: 'Du har liknande tjänster',
    potential_savings: 'Potentiell besparing',
  },

  // Besparingar
  savings: {
    title: 'Besparingar',
    invisible_savings: 'Osynligt sparande',
    buffer: 'Buffert',
    monthly_contribution: 'Månatligt bidrag',
    annual_projection: 'Årlig prognos',
    savings_goal: 'Sparmål',
    you_could_save: 'Du förlorar cirka {amount}/år här',
  },

  // Möjligheter
  opportunities: {
    title: 'Möjligheter',
    safe_to_spend: 'Säkert att spendera',
    available: 'Tillgängligt',
    can_afford: 'Du har utrymme för större köp denna månad',
    wait: 'VUE rekommenderar att vänta',
  },

  // Beteende
  behavior: {
    title: 'Dina mönster',
    post_salary: 'Ökade utgifter efter lön',
    weekend: 'Högre utgifter på helger',
    seasonal: 'Säsongsmässig variation',
    impulse: 'Oplanerade utgifter',
  },

  // Nödläge
  emergency: {
    title: 'Ekonomiskt nödläge',
    pause_all: 'Pausa alla betalningar',
    activate_buffer: 'Aktivera buffert',
    shock_absorber: 'VUE aktiverar skydd',
    system_unavailable: 'Systemet är tillfälligt otillgängligt',
  },

  // Insikter
  insights: {
    economy_stable: 'Din ekonomi är stabil',
    payments_optimized: 'VUE har optimerat {count} betalningar',
    risk_period: 'Riskperiod om {days} dagar',
    savings_potential: 'Du kan spara {amount}/år',
    all_good: 'Allt ser bra ut!',
  },

  // Family Connect
  family: {
    title: 'Family Connect',
    parent: 'Förälder',
    junior: 'Junior',
    member: 'Familjemedlem',
    shared_overview: 'Delad översikt',
    allowance: 'Fickpeng',
  },

  // Onboarding
  onboarding: {
    welcome: 'Välkommen till VUE',
    connect_bank: 'Anslut din bank',
    scan_bills: 'Hitta dina fakturor',
    setup_autopilot: 'Aktivera autopilot',
    ready: 'Du är redo!',
  },

  // Felmeddelanden
  errors: {
    generic: 'Något gick fel. Försök igen.',
    network: 'Kunde inte ansluta. Kontrollera din internetanslutning.',
    auth_failed: 'Autentisering misslyckades.',
    payment_failed: 'Betalningen kunde inte genomföras.',
    try_again: 'Försök igen om en stund.',
  },
};

export type TranslationKeys = typeof sv;
export default sv;
