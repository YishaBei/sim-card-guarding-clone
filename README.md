# sim-card-guarding-clone

A mobile-first and desktop-responsive clone of https://c.cmccsim.com/sim-card-guarding/#/home.

## Implemented

- Real proxying of API requests through the local Node server to https://c.cmccsim.com
- Responsive layout for mobile and desktop browsers
- Multi-account storage and switching with localStorage
- Route coverage for the main home, position, message, mine, login, policy, and feature pages

## Analyzed frontend structure

The upstream app is a Vue single-page application. The bundle exposes these routes:

- Main routes: /home, /position, /message, /mine, /login
- Policy / agreement routes: /locationPolicy, /collectPolicy, /guardianPolicy, /privacyPolicy, /privacyPolicyZy, /childrenPolicy, /xiheFamily
- Feature pages: /warnRecord, /addFamily, /addMsg, /familyMemberAuth, /guardSet, /quickLogin, /verifyLogin, /sdkLogin, /positionLog, /positionHistory, /feedback, /positionShare, /electricityAdd

### Backend API calls observed in the bundle

- /sim/silver/hair/api/init/config
- /sim/silver/hair/api/silver_hair_auth/silverUserserInfo
- /sim/silver/hair/api/silverHair/guide/getGuideStatus
- /sim/silver/hair/api/silver_hair_auth/get_sms_captcha
- /sim/silver/hair/api/silver_hair_auth/user_login
- /sim/silver/hair/api/silver_hair_auth/check_and_login
- /sim/silver/hair/api/silver_hair_auth/getPhoneSimStatus
- /sim/silver/hair/api/silverHair/position/reauthorize
- /sim/silver/hair/api/silver_hair_msg/messageSelect
- /sim/silver/hair/api/silver_hair_msg/messageDeatilSelect
- /sim/silver/hair/api/silverHair/feedback/addFeedback

## Run locally

```bash
npm start
```

Then open http://localhost:4173
