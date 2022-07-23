// based on: https://github.com/mdn/canvas-raycaster/blob/master/input.js
var KEY = {
    68: 's1_right',
    87: 's1_up',
    65: 's1_left',
    83: 's1_down',
    73: 's2_up',
    74: 's2_left',
    75: 's2_down',
    76: 's2_right',
    48: 'mode_0',
    49: 'mode_1',
    50: 'mode_2',
    51: 'mode_3',
    52: 'mode_4',
    53: 'mode_5',
    54: 'mode_6',
    55: 'mode_7',
    56: 'mode_8',
    57: 'mode_9',
    32: 'mode__', // space
};
export var input = {
    s1_right: false,
    s1_up: false,
    s1_down: false,
    s1_left: false,
    s2_right: false,
    s2_up: false,
    s2_down: false,
    s2_left: false,
    mode_0: false,
    mode_1: false,
    mode_2: false,
    mode_3: false,
    mode_4: false,
    mode_5: false,
    mode_6: false,
    mode_7: false,
    mode_8: false,
    mode_9: false,
    mode__: false,
};
export function press(evt) {
    let code = evt.keyCode;
    let command = KEY[code];
    if (command == undefined)
        return;
    input[command] = true;
}
export function release(evt) {
    let code = evt.keyCode;
    let command = KEY[code];
    if (command == undefined)
        return;
    input[command] = false;
}
