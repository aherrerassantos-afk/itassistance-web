---
version: "neuform-top-creators-featured"
name: "Structural Resonance - Centered Architect (itassistance Violet & White Edition)"
source_url: "https://www.aura.build/design-systems/structural-resonance-centered-architect"
description: "Structural Resonance UI Showcase & Product Interface Design System adapted for itassistance with the official Brand Violet & White palette. Designed for demonstrating application interfaces, daily operational workflows (08:00 Morning Summary, Alloggiati Web, Tourist Tax, Dynamic Pricing), and high-conversion mobile + desktop product experiences."
colors:
  primary: "#6D28D9"
  primary-hover: "#5B21B6"
  secondary: "#FFFFFF"
  accent: "#C4B5FD"
  background: "#FFFFFF"
  background-dark: "#1E1035"
  surface: "#F5F3FF"
  surface-aura-original: "#F0E6F2"
  text-primary: "#1E1035"
  text-on-dark: "#FFFFFF"
  text-secondary: "#4C3D63"
  text-secondary-on-dark: "#E9D5FF"
  border: "#DDD6FE"
  border-strong: "#7C3AED"
  status-ok-bg: "#ECFDF5"
  status-ok-text: "#065F46"
  status-error-bg: "#FEF2F2"
  status-error-text: "#991B1B"
typography:
  display-lg:
    fontFamily: "Inter"
    fontSize: "64px"
    fontWeight: 700
    lineHeight: "1.06"
    letterSpacing: "-0.03em"
  body-md:
    fontFamily: "Inter"
    fontSize: "16px"
    fontWeight: 400
    lineHeight: "1.6"
  label-md:
    fontFamily: "JetBrains Mono"
    fontSize: "12px"
    fontWeight: 600
    lineHeight: "1.2"
spacing:
  base: "8px"
  gap: "16px"
  card-padding: "24px"
  section-padding: "80px"
rounded:
  card: "15px"
  control: "15px"
  pill: "9999px"
components:
  card:
    background: "Pure White (#FFFFFF) or Soft Violet Surface (#F5F3FF / #F0E6F2) with 1.5px #DDD6FE border and subtle violet architectural shadow"
    radius: "15px"
  button:
    background: "Brand Royal Violet (#6D28D9 -> #5B21B6) with Pure White (#FFFFFF) text on light surfaces; Pure White (#FFFFFF) with Deep Violet (#4C1D95) text on dark violet surfaces"
    radius: "15px (or 9999px for pill controls)"
---
# Structural Resonance - Centered Architect (itassistance Violet & White Edition)
Source: `https://www.aura.build/design-systems/structural-resonance-centered-architect` (Author: Meng To, `@mengto`).
Tags: dashboard, charts, bento, interface-first, responsive mobile & desktop, violet-white brand system.

## Overview
`Structural Resonance - Centered Architect` is designed for demonstrating an application interface and clear operational hierarchy across both Mobile (`320px–430px`) and Desktop (`768px–1440px`). Adapted for **itassistance**, it fuses Aura's precision architectural grid, `15px` rounded geometry, and `Inter` + `JetBrains Mono` typography with the **itassistance Brand Violet & White palette** (`#6D28D9`, `#1E1035`, `#FFFFFF`, `#F5F3FF`, `#C4B5FD`).

## Colors (Brand Viola & Bianco — WCAG AAA)
- **Canvas Principale (Bianco Puro):** `#FFFFFF` (`--bg-light`)
- **Superficie Secondaria (Bianco-Lavanda Aura):** `#F5F3FF` / `#F0E6F2` (`--bg-stone`)
- **Viola Brand Primario (Azioni & Bottoni):** `#6D28D9` / `#5B21B6` (`--brand-violet`, `--gold-text-light`)
- **Viola Profondo (Testo Primario & Fondali Dark/Hero):** `#1E1035` (`--ink-navy`) — Contrasto `16.4:1` su `#FFFFFF`
- **Lavanda Luminoso (Accenti su Fondale Viola Scuro):** `#C4B5FD` (`--gold-accent`) — Contrasto `10.2:1` su `#1E1035`
- **Testo Secondario su Chiaro:** `#4C3D63` (`--ink-muted`) — Contrasto `8.2:1` su `#FFFFFF`
- **Testo Secondario su Scuro:** `#E9D5FF` (`--ink-on-dark-muted`) — Contrasto `12.4:1` su `#1E1035`
- **Bordi Controlli e Card:** `#7C3AED` (controlli interattivi) / `#DDD6FE` (card e divisori)

## Typography
- **Display & Headings:** `Inter` (`600`–`800`, `line-height: 1.06`–`1.15`, `letter-spacing: -0.025em`)
- **Body Copy & Inputs:** `Inter` (`400`–`500`, `16px` minimo su mobile e desktop, `line-height: 1.6`)
- **Technical Labels, Kickers, Dynamic Pricing & Codes:** `JetBrains Mono` (`600`, `12px`–`13px`, `line-height: 1.2`)

## Layout & Responsive (Sistema Cipolla Mobile + PC)
- **Mobile (`320px–767px`):** Singola colonna, margini `16px`, bottoni alti `56px` con `border-radius: 15px`, barra inferiore fissa `64px` bianca/viola, header `56px`.
- **PC / Desktop (`768px–1440px+`):** Container `1200px`, griglie Bento e dashboard multi-colonna con gap `16px`–`24px`, padding sezione `80px`, card con `border-radius: 15px` e padding `24px`.
