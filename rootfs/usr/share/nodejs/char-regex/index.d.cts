/**
@returns A regex to match any full character, considering weird character ranges.

@example
```
import charRegex from 'char-regex';

'❤️👊🏽'.match(/./);
//=> ['', '', '', '', '', '', '']

'❤️👊🏽'.match(charRegex());
//=> ['❤️', '👊🏽']
```
*/
declare function charRegex(): RegExp;

export = charRegex;
