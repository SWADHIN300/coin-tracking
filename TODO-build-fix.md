# Next.js Vercel Build Fix - Progress Tracker

Status: 🔄 In Progress

## Implementation Steps

### Phase 1: Critical SSR/Hydration Fixes
- [ ] 1. Create this TODO-build-fix.md ✅ **(Current step)**
- [✅] 2. Fix LiveDataWrapper.tsx (move window.setInterval to SSR-safe) **Done**
- [ ] 3. Fix hooks/useCoingeckoWebSocket.ts (guard process.env & WebSocket)
- [✅] 4. Fix components/ThemeToggle.tsx (client-only useEffect) **Done**
- [✅] 5. Fix hooks/useKeyboardShortcuts.ts (guard document.querySelector) **Done**
- [✅] 6. Fix TradingViewChart.tsx & TradingViewTicker.tsx (SSR guards) **Done**

### Phase 2: Cleanup Console Logs & Minor Fixes
- [ ] 7. Remove console.log/error from lib/coingecko.actions.ts & others
- [ ] 8. Fix Header.tsx per TODO2.md
- [ ] 9. Update next.config.ts (remove ignoreBuildErrors)

### Phase 3: Test & Verify
- [ ] 10. Run `npm run build` → verify clean
- [ ] 11. Run `npm run lint -- --fix`
- [ ] 12. Test prod server: `npm run start`
- [ ] 13. Deploy to Vercel & monitor

## Commands to Run:
```
npm run build
npm run lint -- --fix
npm run start
```

## Success Criteria:
- ✅ `npm run build` completes without hydration warnings
- ✅ No console errors in browser devtools  
- ✅ Vercel deployment succeeds

**Next Step: Edit LiveDataWrapper.tsx**
