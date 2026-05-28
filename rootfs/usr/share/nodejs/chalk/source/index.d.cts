// chalk.d.cts

import type {
    ModifierName,
    ForegroundColorName,
    BackgroundColorName,
    ColorName,
    modifierNames,
    foregroundColorNames,
    backgroundColorNames,
    colorNames,
} from 'ansi-styles';

import type {
    ColorInfo,
    ColorSupport,
    ColorSupportLevel,
} from 'supports-color';

declare const chalk: chalk.ChalkInstance;

declare namespace chalk {
    interface Options {
        /**
        Specify the color support for Chalk.

        By default, color support is automatically detected based on the environment.

        Levels:
        - `0` - All colors disabled.
        - `1` - Basic 16 colors support.
        - `2` - ANSI 256 colors support.
        - `3` - Truecolor 16 million colors support.
        */
        readonly level?: ColorSupportLevel;
    }

    /**
    Return a new Chalk instance.
    */
    const Chalk: new (options?: Options) => ChalkInstance; // eslint-disable-line @typescript-eslint/naming-convention

    interface ChalkInstance {
        (...text: unknown[]): string;

        /**
        The color support for Chalk.
        */
        level: ColorSupportLevel;

        rgb(red: number, green: number, blue: number): this;
        hex(color: string): this;
        ansi256(index: number): this;

        bgRgb(red: number, green: number, blue: number): this;
        bgHex(color: string): this;
        bgAnsi256(index: number): this;

        readonly reset: this;
        readonly bold: this;
        readonly dim: this;
        readonly italic: this;
        readonly underline: this;
        readonly overline: this;
        readonly inverse: this;
        readonly hidden: this;
        readonly strikethrough: this;
        readonly visible: this;

        readonly black: this;
        readonly red: this;
        readonly green: this;
        readonly yellow: this;
        readonly blue: this;
        readonly magenta: this;
        readonly cyan: this;
        readonly white: this;

        /*
        Alias for `blackBright`.
        */
        readonly gray: this;

        /*
        Alias for `blackBright`.
        */
        readonly grey: this;

        readonly blackBright: this;
        readonly redBright: this;
        readonly greenBright: this;
        readonly yellowBright: this;
        readonly blueBright: this;
        readonly magentaBright: this;
        readonly cyanBright: this;
        readonly whiteBright: this;

        readonly bgBlack: this;
        readonly bgRed: this;
        readonly bgGreen: this;
        readonly bgYellow: this;
        readonly bgBlue: this;
        readonly bgMagenta: this;
        readonly bgCyan: this;
        readonly bgWhite: this;

        /*
        Alias for `bgBlackBright`.
        */
        readonly bgGray: this;

        /*
        Alias for `bgBlackBright`.
        */
        readonly bgGrey: this;

        readonly bgBlackBright: this;
        readonly bgRedBright: this;
        readonly bgGreenBright: this;
        readonly bgYellowBright: this;
        readonly bgBlueBright: this;
        readonly bgMagentaBright: this;
        readonly bgCyanBright: this;
        readonly bgWhiteBright: this;
    }

    /**
    Main Chalk object that allows to chain styles together.
    */

    const supportsColor: ColorInfo;
    const chalkStderr: ChalkInstance;
    const supportsColorStderr: ColorInfo;

    // Re‑exported types/values from ansi-styles
    export {
        ModifierName,
        ForegroundColorName,
        BackgroundColorName,
        ColorName,
        modifierNames,
        foregroundColorNames,
        backgroundColorNames,
        colorNames,
    };

    // Re‑exported types from supports-color
    export {
        ColorInfo,
        ColorSupport,
        ColorSupportLevel,
    };

    // TODO: Remove these aliases in the next major version

    /**
    @deprecated Use `ModifierName` instead.
    */
    type Modifiers = ModifierName;

    /**
    @deprecated Use `ForegroundColorName` instead.
    */
    type ForegroundColor = ForegroundColorName;

    /**
    @deprecated Use `BackgroundColorName` instead.
    */
    type BackgroundColor = BackgroundColorName;

    /**
    @deprecated Use `ColorName` instead.
    */
    type Color = ColorName;

    /**
    @deprecated Use `modifierNames` instead.
    */
    const modifiers: readonly Modifiers[];

    /**
    @deprecated Use `foregroundColorNames` instead.
    */
    const foregroundColors: readonly ForegroundColor[];

    /**
    @deprecated Use `backgroundColorNames` instead.
    */
    const backgroundColors: readonly BackgroundColor[];

    /**
    @deprecated Use `colorNames` instead.
    */
    const colors: readonly Color[];
}

export = chalk;
