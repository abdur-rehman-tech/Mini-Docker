var node_os = require('node:os');

// List of realtime signals with information about them
const getRealtimeSignals = () => {
  const length = SIGRTMAX - SIGRTMIN + 1;
  return Array.from({ length }, getRealtimeSignal)
};

const getRealtimeSignal = (value, index) => ({
  name: `SIGRT${index + 1}`,
  number: SIGRTMIN + index,
  action: 'terminate',
  description: 'Application-specific signal (realtime)',
  standard: 'posix',
});

const SIGRTMIN = 34;
const SIGRTMAX = 64;

/* eslint-disable max-lines */
// List of known process signals with information about them
const SIGNALS = [
  {
    name: 'SIGHUP',
    number: 1,
    action: 'terminate',
    description: 'Terminal closed',
    standard: 'posix',
  },
  {
    name: 'SIGINT',
    number: 2,
    action: 'terminate',
    description: 'User interruption with CTRL-C',
    standard: 'ansi',
  },
  {
    name: 'SIGQUIT',
    number: 3,
    action: 'core',
    description: 'User interruption with CTRL-\\',
    standard: 'posix',
  },
  {
    name: 'SIGILL',
    number: 4,
    action: 'core',
    description: 'Invalid machine instruction',
    standard: 'ansi',
  },
  {
    name: 'SIGTRAP',
    number: 5,
    action: 'core',
    description: 'Debugger breakpoint',
    standard: 'posix',
  },
  {
    name: 'SIGABRT',
    number: 6,
    action: 'core',
    description: 'Aborted',
    standard: 'ansi',
  },
  {
    name: 'SIGIOT',
    number: 6,
    action: 'core',
    description: 'Aborted',
    standard: 'bsd',
  },
  {
    name: 'SIGBUS',
    number: 7,
    action: 'core',
    description:
      'Bus error due to misaligned, non-existing address or paging error',
    standard: 'bsd',
  },
  {
    name: 'SIGEMT',
    number: 7,
    action: 'terminate',
    description: 'Command should be emulated but is not implemented',
    standard: 'other',
  },
  {
    name: 'SIGFPE',
    number: 8,
    action: 'core',
    description: 'Floating point arithmetic error',
    standard: 'ansi',
  },
  {
    name: 'SIGKILL',
    number: 9,
    action: 'terminate',
    description: 'Forced termination',
    standard: 'posix',
    forced: true,
  },
  {
    name: 'SIGUSR1',
    number: 10,
    action: 'terminate',
    description: 'Application-specific signal',
    standard: 'posix',
  },
  {
    name: 'SIGSEGV',
    number: 11,
    action: 'core',
    description: 'Segmentation fault',
    standard: 'ansi',
  },
  {
    name: 'SIGUSR2',
    number: 12,
    action: 'terminate',
    description: 'Application-specific signal',
    standard: 'posix',
  },
  {
    name: 'SIGPIPE',
    number: 13,
    action: 'terminate',
    description: 'Broken pipe or socket',
    standard: 'posix',
  },
  {
    name: 'SIGALRM',
    number: 14,
    action: 'terminate',
    description: 'Timeout or timer',
    standard: 'posix',
  },
  {
    name: 'SIGTERM',
    number: 15,
    action: 'terminate',
    description: 'Termination',
    standard: 'ansi',
  },
  {
    name: 'SIGSTKFLT',
    number: 16,
    action: 'terminate',
    description: 'Stack is empty or overflowed',
    standard: 'other',
  },
  {
    name: 'SIGCHLD',
    number: 17,
    action: 'ignore',
    description: 'Child process terminated, paused or unpaused',
    standard: 'posix',
  },
  {
    name: 'SIGCLD',
    number: 17,
    action: 'ignore',
    description: 'Child process terminated, paused or unpaused',
    standard: 'other',
  },
  {
    name: 'SIGCONT',
    number: 18,
    action: 'unpause',
    description: 'Unpaused',
    standard: 'posix',
    forced: true,
  },
  {
    name: 'SIGSTOP',
    number: 19,
    action: 'pause',
    description: 'Paused',
    standard: 'posix',
    forced: true,
  },
  {
    name: 'SIGTSTP',
    number: 20,
    action: 'pause',
    description: 'Paused using CTRL-Z or "suspend"',
    standard: 'posix',
  },
  {
    name: 'SIGTTIN',
    number: 21,
    action: 'pause',
    description: 'Background process cannot read terminal input',
    standard: 'posix',
  },
  {
    name: 'SIGBREAK',
    number: 21,
    action: 'terminate',
    description: 'User interruption with CTRL-BREAK',
    standard: 'other',
  },
  {
    name: 'SIGTTOU',
    number: 22,
    action: 'pause',
    description: 'Background process cannot write to terminal output',
    standard: 'posix',
  },
  {
    name: 'SIGURG',
    number: 23,
    action: 'ignore',
    description: 'Socket received out-of-band data',
    standard: 'bsd',
  },
  {
    name: 'SIGXCPU',
    number: 24,
    action: 'core',
    description: 'Process timed out',
    standard: 'bsd',
  },
  {
    name: 'SIGXFSZ',
    number: 25,
    action: 'core',
    description: 'File too big',
    standard: 'bsd',
  },
  {
    name: 'SIGVTALRM',
    number: 26,
    action: 'terminate',
    description: 'Timeout or timer',
    standard: 'bsd',
  },
  {
    name: 'SIGPROF',
    number: 27,
    action: 'terminate',
    description: 'Timeout or timer',
    standard: 'bsd',
  },
  {
    name: 'SIGWINCH',
    number: 28,
    action: 'ignore',
    description: 'Terminal window size changed',
    standard: 'bsd',
  },
  {
    name: 'SIGIO',
    number: 29,
    action: 'terminate',
    description: 'I/O is available',
    standard: 'other',
  },
  {
    name: 'SIGPOLL',
    number: 29,
    action: 'terminate',
    description: 'Watched event',
    standard: 'other',
  },
  {
    name: 'SIGINFO',
    number: 29,
    action: 'ignore',
    description: 'Request for process information',
    standard: 'other',
  },
  {
    name: 'SIGPWR',
    number: 30,
    action: 'terminate',
    description: 'Device running out of power',
    standard: 'systemv',
  },
  {
    name: 'SIGSYS',
    number: 31,
    action: 'core',
    description: 'Invalid system call',
    standard: 'other',
  },
  {
    name: 'SIGUNUSED',
    number: 31,
    action: 'terminate',
    description: 'Invalid system call',
    standard: 'other',
  },
];
/* eslint-enable max-lines */

// Retrieve list of know signals (including realtime) with information about
// them
const getSignals = () => {
  const realtimeSignals = getRealtimeSignals();
  const signals = [...SIGNALS, ...realtimeSignals].map(normalizeSignal);
  return signals
};

// Normalize signal:
//  - `number`: signal numbers are OS-specific. This is taken into account by
//    `os.constants.signals`. However we provide a default `number` since some
//     signals are not defined for some OS.
//  - `forced`: set default to `false`
//  - `supported`: set value
const normalizeSignal = ({
  name,
  number: defaultNumber,
  description,
  action,
  forced = false,
  standard,
}) => {
  const {
    signals: { [name]: constantSignal },
  } = node_os.constants;
  const supported = constantSignal !== undefined;
  const number = supported ? constantSignal : defaultNumber;
  return { name, number, description, supported, action, forced, standard }
};

// Retrieve `signalsByName`, an object mapping signal name to signal properties.
// We make sure the object is sorted by `number`.
const getSignalsByName = () => {
  const signals = getSignals();
  return Object.fromEntries(signals.map(getSignalByName))
};

const getSignalByName = ({
  name,
  number,
  description,
  supported,
  action,
  forced,
  standard,
}) => [name, { name, number, description, supported, action, forced, standard }];

const signalsByName = getSignalsByName();

// Retrieve `signalsByNumber`, an object mapping signal number to signal
// properties.
// We make sure the object is sorted by `number`.
const getSignalsByNumber = () => {
  const signals = getSignals();
  const length = SIGRTMAX + 1;
  const signalsA = Array.from({ length }, (value, number) =>
    getSignalByNumber(number, signals),
  );
  return Object.assign({}, ...signalsA)
};

const getSignalByNumber = (number, signals) => {
  const signal = findSignalByNumber(number, signals);

  if (signal === undefined) {
    return {}
  }

  const { name, description, supported, action, forced, standard } = signal;
  return {
    [number]: {
      name,
      number,
      description,
      supported,
      action,
      forced,
      standard,
    },
  }
};

// Several signals might end up sharing the same number because of OS-specific
// numbers, in which case those prevail.
const findSignalByNumber = (number, signals) => {
  const signal = signals.find(({ name }) => node_os.constants.signals[name] === number);

  if (signal !== undefined) {
    return signal
  }

  return signals.find((signalA) => signalA.number === number)
};

const signalsByNumber = getSignalsByNumber();

exports.signalsByName = signalsByName;
exports.signalsByNumber = signalsByNumber;
