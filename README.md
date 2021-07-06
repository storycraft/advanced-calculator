# Advanced calculator
Predictive LL parser and Expression interpreter written in Typescript.

Many things (condition, loop) are not implemented yet.

## Sample code
```
func plus(a, b) {
    ret a + b;
}

let hex = 0x10;
let bin = 0b11;
let dec = 5;

ret plus(hex, dec) + bin;
```
This code returns 24