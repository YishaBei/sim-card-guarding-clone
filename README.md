# sim-card-guarding-clone

A self-contained mobile SPA clone of https://c.cmccsim.com/sim-card-guarding/#/home.

## What was analyzed

The upstream app is a Vue single-page application. From the HTML and minified bundle, the following structure and routes were identified:

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
