import { type FieldsDefinition } from './field-utils.js';

type Formatter<T extends FieldsDefinition> = {
  [K in keyof T]?: (value: T[K]['initialValue']) => string;
};

const Units = {
  bpm: 'BPM',
  seconds: 's',
  beat: 'beat',
  beats: 'beats',
  bar: 'bar',
  bars: 'bars',
  step: 'step',
  steps: 'steps',
  pattern: 'patt.',
  semitones: 'semis',
  hertz: 'Hz'
} as const;

const Formatters: Formatter<typeof fieldDefinitions> = {
  integer: (value: number | string): string =>
    Math.round(typeof value === 'string' ? parseInt(value, 10) : value).toFixed(
      0
    ),
  decimal: (value: number | string): string =>
    (typeof value === 'string' ? parseFloat(value) : value).toFixed(
      4 - (value !== 0 ? Math.log10(Number(value) + 1) : 0)
    ),
  oneDecimal: (value: number | string): string =>
    (typeof value === 'string' ? parseFloat(value) : value).toFixed(1)
} as const;

export const sections = [
  'Project settings',
  'BPM → Frequency',
  'BPM → duration',
  'Duration → BPM',
  'Tempo → pitch',
  'Pitch → tempo'
] as const;

const notes = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

const formatInterval = (intervalHalftones: number): string => {
  const intervalRounded = Math.floor(intervalHalftones);
  let noteIndex = (intervalRounded + notes.length) % notes.length;
  while (noteIndex < 0) {
    noteIndex += 12;
  }
  const note = notes[noteIndex] ?? '-';
  const microTune = intervalHalftones - intervalRounded;
  const octave = 5 + Math.floor(intervalRounded / 12);
  return `${note}${octave} / ${microTune == 0 ? '--' : `M ${Math.round(microTune * 100)}`}`;
};

export const fieldDefinitions: FieldsDefinition = {
  projectTempo: {
    section: 0,
    initialValue: 130,
    label: 'Tempo',
    units: Units.bpm,
    min: 1,
    max: 999,
    update: (value) => value,
    formatter: Formatters.integer
  },
  patternSize: {
    section: 0,
    initialValue: 16,
    label: 'Pattern',
    units: Units.steps,
    min: 1,
    max: 128,
    largeStep: 8,
    update: (value) => value,
    formatter: Formatters.integer
  },
  timeSignature: {
    section: 0,
    initialValue: 4,
    label: 'Signature',
    units: `${Units.beats}/${Units.bar}`,
    min: 1,
    max: 16,
    largeStep: 4,
    update: (value) => value,
    formatter: Formatters.integer
  },
  lfoBeats: {
    section: 1,
    label: 'Length',
    initialValue: 4,
    largeStep: 8,
    units: Units.beats,
    min: 1,
    max: 256,
    update: (value) => value,
    formatter: Formatters.integer
  },
  lfoFrequency: {
    section: 1,
    initialValue: 120,
    units: Units.hertz,
    readOnly: true,
    update: (_, fields) => 1 / ((fields.lfoBeats * 60) / fields.projectTempo),
    formatter: Formatters.decimal
  },
  secondsPerPattern: {
    section: 2,
    initialValue: 0,
    units: `${Units.seconds}/${Units.pattern}`,
    readOnly: true,
    update: (_, fields) =>
      (60 / parseFloat(fields.projectTempo) / 4) *
      parseInt(fields.patternSize, 10),
    formatter: Formatters.decimal
  },
  secondsPerBar: {
    section: 2,
    initialValue: 0,
    units: `${Units.seconds}/${Units.bar}`,
    readOnly: true,
    update: (_, fields) =>
      (60 / parseFloat(fields.projectTempo)) *
      parseInt(fields.timeSignature, 10),
    formatter: Formatters.decimal
  },
  secondsPerBeat: {
    section: 2,
    initialValue: 0,
    units: `${Units.seconds}/${Units.beat}`,
    readOnly: true,
    update: (_, fields) => 60 / parseFloat(fields.projectTempo),
    formatter: Formatters.decimal
  },
  secondsPerStep: {
    section: 2,
    initialValue: 0,
    units: `${Units.seconds}/${Units.step}`,
    readOnly: true,
    update: (_, fields) => 60 / 4 / parseFloat(fields.projectTempo),
    formatter: Formatters.decimal
  },
  seconds: {
    section: 3,
    label: 'Length',
    initialValue: 0.5,
    units: Units.seconds,
    min: 0.05,
    max: 60,
    step: 0.05,
    largeStep: 1,
    update: (value) => value,
    formatter: Formatters.decimal
  },
  beats: {
    section: 3,
    label: 'Length',
    initialValue: 1.0,
    units: Units.beats,
    min: 0,
    max: 128,
    step: 1,
    largeStep: 4,
    update: (value) => value,
    formatter: Formatters.decimal
  },
  bars: {
    section: 3,
    label: 'Length',
    initialValue: 0,
    units: Units.bars,
    readOnly: true,
    update: (_, fields) =>
      parseFloat(fields.beats) / parseInt(fields.timeSignature, 10),
    formatter: Formatters.decimal
  },
  newBpm: {
    section: 3,
    label: 'Result',
    initialValue: 0,
    units: Units.bpm,
    readOnly: true,
    update: (_, fields) =>
      (parseFloat(fields.beats) * 60) / parseFloat(fields.seconds),
    formatter: Formatters.oneDecimal
  },
  sampleTempo: {
    section: 4,
    label: 'Sample',
    initialValue: 120,
    units: Units.bpm,
    min: 1,
    max: 999,
    update: (value) => value,
    formatter: Formatters.integer
  },
  changedSemitones: {
    section: 4,
    label: 'Change',
    initialValue: 0,
    units: Units.semitones,
    readOnly: true,
    update: (_, fields) =>
      bpmChangeAsSemitones(
        parseFloat(fields.sampleTempo),
        parseFloat(fields.projectTempo)
      ),
    formatter: Formatters.decimal
  },
  changedNote: {
    section: 4,
    label: 'Note',
    initialValue: formatInterval(0),
    readOnly: true,
    update: (_, fields) =>
      formatInterval(
        bpmChangeAsSemitones(
          parseFloat(fields.sampleTempo),
          parseFloat(fields.projectTempo)
        )
      )
  },
  targetSemitones: {
    section: 5,
    label: 'Change',
    initialValue: -1,
    units: Units.semitones,
    min: -24,
    max: 24,
    update: (value) => value,
    formatter: Formatters.integer
  },
  changedBpm: {
    section: 5,
    label: 'Result',
    initialValue: 0,
    units: Units.bpm,
    readOnly: true,
    update: (_, fields) =>
      parseFloat(fields.projectTempo) *
      2 ** (parseInt(fields.targetSemitones, 10) / 12),
    formatter: Formatters.oneDecimal
  }
} as const;

const bpmChangeAsSemitones = (sourceTempo: number, sampleTempo: number) =>
  12 * Math.log2(sampleTempo / sourceTempo);
