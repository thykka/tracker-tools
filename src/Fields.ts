import { type FieldsDefinition } from "./field-utils";

type Formatter<T extends FieldsDefinition> = {
  [K in keyof T]?: (value: T[K]["initialValue"]) => string;
};

const Units = {
  bpm: "BPM",
  seconds: "s",
  beat: "beat",
  beats: "beats",
  bar: "bar",
  bars: "bars",
  step: "step",
  steps: "steps",
  pattern: "patt.",
  semitones: "semis",
} as const;

const Formatters: Formatter<typeof fieldDefinitions> = {
  integer: (value: number | string): string =>
    Math.round(typeof value === "string" ? parseInt(value, 10) : value).toFixed(
      0
    ),
  decimal: (value: number | string): string =>
    (typeof value === "string" ? parseFloat(value) : value).toFixed(3),
  oneDecimal: (value: number | string): string =>
    (typeof value === "string" ? parseFloat(value) : value).toFixed(1),
} as const;

export const sections = [
  "Project settings",
  "BPM → duration",
  "Duration → BPM",
  "Tempo → pitch",
  "Pitch → tempo",
] as const;

export const fieldDefinitions: FieldsDefinition = {
  projectTempo: {
    section: 0,
    initialValue: 120,
    label: "Tempo",
    units: Units.bpm,
    min: 1,
    max: 999,
    update: (value) => value,
    formatter: Formatters.integer,
  },
  patternSize: {
    section: 0,
    initialValue: 16,
    label: "Pattern",
    units: Units.steps,
    min: 1,
    max: 128,
    update: (value) => value,
    formatter: Formatters.integer,
  },
  timeSignature: {
    section: 0,
    initialValue: 4,
    label: "Signature",
    units: `${Units.beats}/${Units.bar}`,
    min: 1,
    max: 16,
    largeStep: 4,
    update: (value) => value,
    formatter: Formatters.integer,
  },
  secondsPerPattern: {
    section: 1,
    initialValue: 0,
    units: `${Units.seconds}/${Units.pattern}`,
    readOnly: true,
    update: (_, fields) =>
      (60 / parseFloat(fields.projectTempo) / 4) *
      parseInt(fields.patternSize, 10),
    formatter: Formatters.decimal,
  },
  secondsPerBeat: {
    section: 1,
    initialValue: 0,
    units: `${Units.seconds}/${Units.beat}`,
    readOnly: true,
    update: (_, fields) => 60 / parseFloat(fields.projectTempo),
    formatter: Formatters.decimal,
  },
  secondsPerBar: {
    section: 1,
    initialValue: 0,
    units: `${Units.seconds}/${Units.bar}`,
    readOnly: true,
    update: (_, fields) =>
      (60 / parseFloat(fields.projectTempo)) *
      parseInt(fields.timeSignature, 10),
    formatter: Formatters.decimal,
  },
  secondsPerStep: {
    section: 1,
    initialValue: 0,
    units: `${Units.seconds}/${Units.step}`,
    readOnly: true,
    update: (_, fields) => 60 / 4 / parseFloat(fields.projectTempo),
    formatter: Formatters.decimal,
  },
  seconds: {
    section: 2,
    label: "Length",
    initialValue: 0.5,
    units: Units.seconds,
    min: 0,
    max: 60,
    step: 0.01,
    largeStep: 1,
    update: (value) => value,
    formatter: Formatters.decimal,
  },
  beats: {
    section: 2,
    label: "Length",
    initialValue: 1.0,
    units: Units.beats,
    min: 0,
    max: 128,
    step: 0.125,
    largeStep: 1,
    update: (value) => value,
    formatter: Formatters.decimal,
  },
  bars: {
    section: 2,
    label: "Length",
    initialValue: 0,
    units: Units.bars,
    readOnly: true,
    update: (_, fields) =>
      parseFloat(fields.beats) / parseInt(fields.timeSignature, 10),
    formatter: Formatters.decimal,
  },
  newBpm: {
    section: 2,
    label: "Result",
    initialValue: 0,
    units: Units.bpm,
    readOnly: true,
    update: (_, fields) =>
      (parseFloat(fields.beats) * 60) / parseFloat(fields.seconds),
    formatter: Formatters.oneDecimal,
  },
  targetTempo: {
    section: 3,
    label: "Target",
    initialValue: 180,
    units: Units.bpm,
    min: 1,
    max: 999,
    update: (value) => value,
    formatter: Formatters.integer,
  },
  changedSemitones: {
    section: 3,
    label: "Change",
    initialValue: 0,
    units: Units.semitones,
    readOnly: true,
    update: (_, fields) =>
      12 *
      Math.log2(
        parseInt(fields.targetTempo, 10) / parseFloat(fields.projectTempo)
      ),
    formatter: Formatters.decimal,
  },
  changedNote: {
    section: 3,
    label: "Note",
    initialValue: "G5 / M -2",
    readOnly: true,
    update: (value) => String(value),
  },
  targetSemitones: {
    section: 4,
    label: "Change",
    initialValue: -1,
    units: Units.semitones,
    min: -24,
    max: 24,
    update: (value) => value,
    formatter: Formatters.integer,
  },
  changedBpm: {
    section: 4,
    label: "Result",
    initialValue: 0,
    units: Units.bpm,
    readOnly: true,
    update: (_, fields) =>
      parseFloat(fields.projectTempo) *
      2 ** (parseInt(fields.targetSemitones, 10) / 12),
    formatter: Formatters.oneDecimal,
  },
} as const;
