# Tracker+ Tools

It's a calculator for working with samples and music, built as a companion app for the Polyend Tracker+.

## Screenshots
<img src="https://github.com/user-attachments/assets/77a7745b-1b95-4bd4-81da-aa69528e1903" alt="Screenshot of Tracker+ Tools main view" width="480" />

## Features

- Calculate how long a [step/beat/bar/pattern] is at a given BPM
- Calculate the BPM of a sample by it's length
- Calculate required pitch shift to stretch a sample to a given BPM
- Calculate new BPM by pitch shifting amount

## Usage

Currently there's no public online build. In the meanwhile you can try using [the CSB-version](https://l5w27q-1234.csb.app/) or build the project by yourself:

1. Use Node.js v20.11 (recommend using [nvm](https://github.com/nvm-sh/nvm))

3. Clone this repo:
```sh
git clone git@github.com:thykka/tracker-tools.git
cd tracker-tools
```

3. Install dependencies:
```sh
npm ci
```

4. Start local development server:
```sh
npm run dev
```
4. Alternatively, build the project and throw all files from `./dist/` onto your web server, replacing `/my-calculator` with the folder you're going to place it in (e.g. https://example.com/public-path/ ):
```sh
npx parcel build --public-url /my-calculator src/index.html
```
