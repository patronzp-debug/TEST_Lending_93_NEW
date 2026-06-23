# todo.md

Deploy preparation checklist only.

## Required Before Deploy

- [ ] Run `npm run lint` and fix all reported issues.
- [ ] Run `npm run build` and confirm production build succeeds.
- [ ] Smoke-test the production build with `npm run start`.
- [ ] Verify there are no hydration warnings in browser console.
- [ ] Test desktop, tablet and mobile viewport layouts.
- [ ] Test Lenis scrolling on iOS/Android touch devices.
- [ ] Verify GSAP ScrollTrigger animations after route load and after resize.
- [ ] Submit the recruiting form with valid data and confirm a row is appended to Google Sheets.
- [ ] Submit invalid form states and confirm validation messages are readable.
- [ ] Confirm `GOOGLE_SHEET_ID`, `GOOGLE_CLIENT_EMAIL`, and `GOOGLE_PRIVATE_KEY` are configured in deploy environment.
- [ ] Add production canonical URL metadata.
- [ ] Add OpenGraph image and Twitter card metadata.
- [ ] Replace footer social placeholder `href="#"` values with real URLs or hide inactive links.
- [ ] Confirm all public images/videos load from the production deployment.
- [ ] Check Lighthouse basics: performance, accessibility, best practices, SEO.
- [ ] Verify Ukrainian copy, phone numbers and email with stakeholder.
- [ ] Confirm favicon and app preview assets are final.
