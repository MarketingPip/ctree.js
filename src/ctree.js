/**
 * Generates a colored Christmas tree with ANSI colors.
 *
 * @param {Object} [options={}] - The options for customizing the tree.
 * @param {Object} [options.star] - Options for the star properties.
 * @param {string} [options.star.TOP='|'] - The character for the top position of the star.
 * @param {string} [options.star.STAR='+'] - The character for the star itself.
 * @param {string} [options.star.LEFT='-'] - The character for the left position of the star.
 * @param {string} [options.star.RIGHT='-'] - The character for the right position of the star.
 * @param {string} [options.star.BOTTOM='A'] - The character for the bottom position of the star.
 * @param {string} [options.balls='O'] - The character representing balls.
 * @returns {string} The colored output string representing the Christmas tree.
 * @throws {Error} Throws an error if any of the provided options values are not strings.
 */
export default function ctree(options = {}) {
  /**
   * Merges provided options with default options, ensuring all values are strings.
   *
   * @param {Object} [newOptions={}] - The new options to merge with the default options.
   * @param {Object} newOptions.star - Options for the star properties.
   * @param {string} newOptions.star.TOP - The character for the top position of the star.
   * @param {string} newOptions.star.TREE_STAR - The character for the tree star itself.
   * @param {string} newOptions.star.LEFT - The character for the left position of the star.
   * @param {string} newOptions.star.RIGHT - The character for the right position of the star.
   * @param {string} newOptions.star.BOTTOM - The character for the bottom position of the star.
   * @param {string} newOptions.balls - The character representing christmas balls.
   * @throws {Error} Throws an error if any value is not a string.
   * @returns {Object} The merged options object containing default and new options.
   */
  function mergeOptions(newOptions = {}) {
    const defaultOptions = {
      star: {
        TOP: "|",
        TREE_STAR: "+",
        LEFT: "-",
        RIGHT: "-",
        BOTTOM: "A"
      },
      balls: "O",
      stars: "*"
    };

    // Merge the default options with the new options
    const mergedOptions = { ...defaultOptions, ...newOptions };

    // Validate that all values are strings
    for (const key in mergedOptions) {
      const value = mergedOptions[key];
      if (typeof value === "object" && !Array.isArray(value)) {
        for (const subKey in value) {
          if (typeof value[subKey] !== "string") {
            throw new Error(
              `Invalid value for ${key}.${subKey}: expected a string but got ${typeof value[
                subKey
              ]}`
            );
          }
        }
      } else if (typeof value !== "string") {
        throw new Error(
          `Invalid value for ${key}: expected a string but got ${typeof value}`
        );
      }
    }

    return mergedOptions;
  }

  options = mergeOptions(options); // Merge the default options with the new options

  /**
   * Represents an RGB color.
   *
   * @constructor
   * @param {number} r - The red component (0-255).
   * @param {number} g - The green component (0-255).
   * @param {number} b - The blue component (0-255).
   */
  class Color {
    constructor(r, g, b) {
      this.r = r;
      this.g = g;
      this.b = b;
    }

    /**
     * Converts the color to an ANSI escape code for foreground color.
     *
     * @returns {string} The ANSI escape code.
     */
    toAnsi() {
      return `\x1b[38;2;${this.r};${this.g};${this.b}m`;
    }

    /**
     * Resets the ANSI formatting to default.
     *
     * @returns {string} The ANSI reset code.
     */
    reset() {
      return "\x1b[0m";
    }

    /**
     * Formats a character with the color.
     *
     * @param {string} char - The character to format.
     * @returns {string} The formatted string with color.
     */
    format(char) {
      return `${this.toAnsi()}${char}${this.reset()}`;
    }
  }

  const yellow = new Color(255, 255, 0);
  const green = new Color(0, 255, 0);
  const brown = new Color(210, 105, 30);

  /**
   * Applies colors to specified characters in the input string.
   *
   * @param {string} base - The input string to apply colors to.
   * @returns {string} The string with colors applied.
   */
  function applyColors(base) {
    let applied = base;

    applied = applyColorToChars(
      applied,
      yellow,
      "y",
      [...Object.values(options.star), ...Object.values(options.stars)]
    );
    applied = applyColorToChars(applied, green, "g", ["/", "\\", "="]);
    applied = applyColorToChars(applied, brown, "b", ["|", "_"]);

    return applied;
  }

  /**
   * Applies a specific color to given characters in a string.
   *
   * @param {string} str - The input string to modify.
   * @param {Color} color - The color to apply.
   * @param {string} charPrefix - The prefix for identifying characters.
   * @param {string[]} chars - The list of characters to color.
   * @returns {string} The modified string with colors applied.
   */
  function applyColorToChars(str, color, charPrefix, chars) {
    let applied = str;
    chars.forEach((char) => {
      const coloredChar = color.format(char);
      applied = applied.split(charPrefix + char).join(coloredChar);
    });
    return applied;
  }

  let input = `
         yTOP
        yLEFTyANGELyRIGHT
         yA
        g/g=g\\               /\\  /\\    ___  _ __  _ __ __    __
      10g/ ySTAR g\\20            /  \\/  \\  / _ \\| '__|| '__|\\ \\  / /
      g/g=g=g=g=g=g\\           / /\\  /\\ \\|  __/| |   | |    \\ \\/ /
      g/  3BALL  g\\          \\_\\ \\/ /_/ \\___/|_|   |_|     \\  /
    40g/ 50 ySTAR 60 g\\70                                       / /
    g/g=g=g=g=g=g=g=g=g=g\\        __  __                        /_/    _
    g/  ySTAR   ySTAR  g\\        \\ \\/ /        /\\  /\\    ____  ____  | |
  80g/ ySTAR   90   ySTAR g\\100       \\  /   __   /  \\/  \\  / _  |/ ___\\ |_|
  g/g=g=g=g=g=g=g=g=g=g=g=g=g=g\\       /  \\  |__| / /\\  /\\ \\| (_| |\\___ \\  _
  g/  140   ySTAR   150  g\\      /_/\\_\\      \\_\\ \\/ /_/ \\__,_|\\____/ |_|
160g/ ySTAR   170   180   ySTAR g\\190
g/g=g=g=g=g=g=g=g=g=g=g=g=g=g=g=g=g=g\\
       b|   b|
       b|b_b_b_b|
`;

  /**
   * Replaces specified characters in the input template while keeping 'y' unchanged.
   *
   * @param {string} input - The input template string to modify.
   * @param {Object} replacements - An object mapping characters to their replacements.
   * @param {string} replacements.charToReplace - The character to be replaced.
   * @param {string} replacements.newChar - The character to replace with.
   * @returns {string} The modified string with the specified characters replaced.
   */
  function modifyTemplate(input, replacements) {
    let modified = input;
    for (const [charToReplace, newChar] of Object.entries(replacements)) {
      modified = modified.split(charToReplace).join(newChar);
    }
    return modified;
  }

  input = modifyTemplate(input, options.star);

  input = modifyTemplate(input, { BALL: options.balls, STAR: options.stars });
  
  /**
   * Generates a random integer up to the specified maximum.
   *
   * @param {number} max - The maximum integer to generate.
   * @returns {number} A random integer between 0 and max-1.
   */
  function getRandomInt(max) {
    return Math.floor(Math.random() * max);
  }

  /**
   * Generates a random color for the input character.
   *
   * @param {string} input - The input character to color.
   * @returns {string} The formatted colored character.
   */
  function generateColor(input) {
    const selection = getRandomInt(6);
    let color;

    switch (selection) {
      case 0:
        color = new Color(247, 108, 246); // Pink
        break;
      case 1:
        color = new Color(85, 202, 255); // Light Blue
        break;
      case 2:
        color = new Color(100, 0, 255); // Purple
        break;
      case 3:
        color = new Color(236, 21, 0); // Red
        break;
      case 4:
        color = new Color(243, 213, 0); // Orange
        break;
      case 5:
        color = new Color(100, 255, 24); // Light Green
        break;
      default:
        color = new Color(255, 255, 255); // Fallback to white
    }

    return color.format(input);
  }

  /**
   * Applies random colors to digit characters in the input string.
   *
   * @param {string} input - The input string to modify.
   * @returns {string} The string with colors applied to digits.
   */
  function applyColorsToLights(input) {
    const regex = new RegExp(`(\\d+)${options.balls}?`, "g"); // Matches one or more digits followed by 'BALL'
    return input.replace(regex, (match) => generateColor(options.balls));
  }

  const coloredOutput = applyColors(applyColorsToLights(input));
  return coloredOutput;
}

console.log(
  ctree({
    star: {
      TOP: "^",
      ANGEL: "+",
      LEFT: "-",
      RIGHT: "-",
      BOTTOM: "A"
    },
    balls: "X",
    stars: "+",
  })
); // Returns the tree in your console output. // (WIP issues as of right now)
