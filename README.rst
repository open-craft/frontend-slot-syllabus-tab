frontend-plugin-syllabus-tab
##########################

Purpose
*******

This repo contains slots that add a Syllabus tab to the learning MFE.

Getting Started
***************

In ``frontend-app-learning`` create a file called ``env.config.jsx`` with the
following contents:

```javascript
import { slotConfig } from '@open-craft/frontend-plugin-syllabus-tab';


const config = {
  pluginSlots: {
    ...slotConfig,
  },
};

export default config;
```

Install this repo as:

```bash
npm install --no-save https://github.com/open-craft/frontend-plugin-syllabus-tab.git
```
