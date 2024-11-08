import { json } from 'stream/consumers';

enum Color {
  Reset = '\x1b[0m',
  Bright = '\x1b[1m',
  Dim = '\x1b[2m',
  Underscore = '\x1b[4m',
  Blink = '\x1b[5m',
  Reverse = '\x1b[7m',
  Hidden = '\x1b[8m',

  FgBlack = '\x1b[30m',
  FgRed = '\x1b[31m',
  FgGreen = '\x1b[32m',
  FgYellow = '\x1b[33m',
  FgBlue = '\x1b[34m',
  FgMagenta = '\x1b[35m',
  FgCyan = '\x1b[36m',
  FgWhite = '\x1b[37m',
  FgGray = '\x1b[90m',

  BgBlack = '\x1b[40m',
  BgRed = '\x1b[41m',
  BgGreen = '\x1b[42m',
  BgYellow = '\x1b[43m',
  BgBlue = '\x1b[44m',
  BgMagenta = '\x1b[45m',
  BgCyan = '\x1b[46m',
  BgWhite = '\x1b[47m',
  BgGray = '\x1b[100m',
}
const typeToColorMapping: { [key: string]: Color } = {
  string: Color.FgYellow,
  number: Color.FgCyan,
  Date: Color.FgMagenta,
  booleanTrue: Color.FgGreen,
  booleanFalse: Color.FgRed,
  default: Color.FgWhite,
};
const getType = (val: any) => {
  if (typeof val === 'boolean') {
    return val ? 'booleanTrue' : 'booleanFalse';
  }
  return typeof val;
};
const colorString = (color: Color, string: string): string => {
  return `${color}${string}${Color.Reset}`;
};
const formatMessage = (obj: Record<string, unknown>, padStart: number = 0): string => {
  let result = '';
  let valueColor;
  let firstEntry = true;
  let padding = 14 + padStart;
  for (let [key, value] of Object.entries(obj)) {
    if (!value) continue;

    if (typeof value === 'object') {
      value = formatMessage(value as Record<string, unknown>, key.length + padding - 10);
    }

    valueColor = typeToColorMapping[getType(value)];

    if (firstEntry == false) {
      result += `\n${colorString(Color.FgBlue, `[${key}]`.padStart(key.length + padding))}: ${colorString(valueColor, String(value))}`;
    } else {
      result += `${colorString(Color.FgBlue, `[${key}]`)}: ${colorString(valueColor, String(value))}`;
      firstEntry = false;
    }
  }

  return result;
};

export const logger = {
  debug: (action: string, message: Record<string, unknown> | string): void => {
    let stack: string | null;
    let logOutput: string = '';
    if (message instanceof Error) {
      stack = message.stack ?? null;

      if (stack) {
        const stackSplit: string[] = stack.split('\n');
        stackSplit.forEach((element, index) => {
          if (index === 0) {
            logOutput += `${colorString(Color.FgMagenta, element)}`;
          } else {
            logOutput += ` \n${colorString(Color.FgMagenta, element.padStart(element.length + 7))}`;
          }
        });
      }
    }
    console.log(
      `${colorString(Color.FgBlue, '[LOG]')} \n` +
        `${colorString(Color.FgGreen, '[LEVEL] : ') + colorString(Color.FgGreen, 'DEBUG')}\n` +
        `${colorString(Color.FgBlue, '[ACTION] : ') + (action ? colorString(Color.FgMagenta, action) : '')}\n` +
        `${
          colorString(Color.FgBlue, '[CONTENT] : ') +
          (message != null ? (typeof message === 'string' ? message : formatMessage(message)) : '')
        }\n` +
        `${message instanceof Error ? colorString(Color.FgBlue, '[STACK]: ') + logOutput : ''}`,
    );
  },
  /*error: (action: string, message: Record<string, unknown> | string): void => {
    let stack: string | null = null;
    let logOutput: string = '';
    if (message instanceof Error) {
      stack = message.stack ?? null;

      if (stack) {
        const stackSplit: string[] = stack.split('\n');
        stackSplit.forEach((element, index) => {
          if (index === 0) {
            logOutput += `${colorString(Color.FgMagenta, element)}`;
          } else {
            logOutput += ` \n${colorString(Color.FgMagenta, element.padStart(element.length + 7))}`;
          }
        });
      }
    }
    console.log(
      `${colorString(Color.FgBlue, '[LOG]')} \n` +
        `${colorString(Color.FgRed, '[LEVEL] : ') + colorString(Color.FgRed, 'ERROR')}\n` +
        `${colorString(Color.FgBlue, '[ACTION] : ') + (action ? colorString(Color.FgMagenta, action) : '')}\n` +
        `${
          colorString(Color.FgBlue, '[CONTENT] : ') +
          (message ? (typeof message === 'string' ? message : formatMessage(message)) : '')
        }\n` +
        `${message instanceof Error ? colorString(Color.FgBlue, '[STACK]: ') + logOutput : ''}`,
    );
  }, */
};
