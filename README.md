# <p align="center"><img src="public/icons/banner.png" width="50%"></p>

BetterUN is a [browser extension](https://en.wikipedia.org/wiki/Browser_extension) that enhances the [Nantes Université](https://www.univ-nantes.fr/) websites available to students. It modifies their appearance and adds new features to make the user experience more pleasant, unified and ergonomic.  
  
BetterUN includes mods which are independent functionalities that each make a specific change to the interface. These mods can be easily enabled or disabled from the extension's popup, providing a high level of customisation.  
  
BetterUN is based on the [ItsBetter project](https://github.com/devmlb/itsbetter).

## Compatibility

<table>
<tr><td>

| Browser | Windows | Linux | Mac
|--|--|--|--|
| Chrome | ✅ | ☑️ | ☑️ |
| Chromium-based (Opera, Edge...) | ☑️ | ☑️ | ☑️ |
| Firefox | ✅ | ✅ | ☑️ |

</td><td>

✅ Works correctly (tested)  
☑️ Works in theory (but not tested)  

</td></tr>
</table>

BetterUN is currently being developed and tested for [the student intranet](https://intraetu.univ-nantes.fr/) only.

## Development

The project is built with [WXT](https://wxt.dev/) and [TypeScript](https://www.typescriptlang.org/).

### Prerequisites

- [Node.js](https://nodejs.org/) (v18+)
- [npm](https://www.npmjs.com/)

### Setup

```bash
# Install dependencies
npm install
```

### Commands

```bash
# Start development server with hot-reload (Chrome)
npm run dev

# Start development server with hot-reload (Firefox)
npm run dev:firefox

# Type check
npm run compile

# Build for Chrome (MV3)
npm run build

# Build for Firefox (MV2/MV3)
npm run build:firefox

# Package zip files for distribution
npm run zip
npm run zip:firefox
```

## Installing, uninstalling and updating

Before BetterUN is available in the official browser stores, you can [test the beta versions](https://github.com/devmlb/betterun/releases).

## Documentation

[Go to the wiki](https://github.com/devmlb/betterun/wiki)
