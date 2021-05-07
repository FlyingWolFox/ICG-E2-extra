// based on: https://github.com/mdn/canvas-raycaster/blob/master/input.js



var KEY: Record<number, string> = {
    68: 's1_right', // D
    87: 's1_up',    // W
    65: 's1_left',  // A
    83: 's1_down',  // S
    73: 's2_up',    // I
    74: 's2_left',  // J
    75: 's2_down',  // K
    76: 's2_right', // L
    48: 'mode_0',   // 0
    49: 'mode_1',   // 1
    50: 'mode_2',   // 2
    51: 'mode_3',   // 3
    52: 'mode_4',   // 4
    53: 'mode_5',   // 5
    54: 'mode_6',   // 6
    55: 'mode_7',   // 7
    56: 'mode_8',   // 8
    57: 'mode_9',   // 9
    32: 'mode__',   // space
}

export var input: Record<string, boolean> = {
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
}

export function press(evt: any) {
    let code = evt.keyCode
    let command =  KEY[code]
    if (command == undefined)
        return

    input[command] = true
}

export function release(evt: any) {
    let code = evt.keyCode
    let command = KEY[code]
    if (command == undefined)
        return
    
    input[command] = false
}