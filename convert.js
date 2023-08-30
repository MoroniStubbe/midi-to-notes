function noteToNumber(note) {
    var number;
    switch (note[0]) {
        case 'C':
            number = 0;
            break;
        case 'D':
            number = 2;
            break;
        case 'E':
            number = 4;
            break;
        case 'F':
            number = 5;
            break;
        case 'G':
            number = 7;
            break;
        case 'A':
            number = 9;
            break;
        case 'B':
            number = 11;
            break;
    }
    if (note.length == 3) {
        number++;
    }
    return number + (parseInt(note[note.length - 1]) * 12) - 8;
}

function numberToNote(number) {
    number += 8;
    var octave = Math.floor(number / 12);
    number = number % 12;
    var note;
    switch (number) {
        case 0:
            note = 'c';
            break;
        case 1:
            note = 'C';
            break;
        case 2:
            note = 'd';
            break;
        case 3:
            note = 'D';
            break;
        case 4:
            note = 'e';
            break;
        case 5:
            note = 'f';
            break;
        case 6:
            note = 'F';
            break;
        case 7:
            note = 'g';
            break;
        case 8:
            note = 'G';
            break;
        case 9:
            note = 'a';
            break;
        case 10:
            note = 'A';
            break;
        case 11:
            note = 'b';
            break;
    }
    return note + octave;
}

function removeOctaveNumbers(mappedNotes){
    mappedNotes = mappedNotes.split('\n');
    for(var i = 0; i < mappedNotes.length; i++){
        mappedNotes[i] = mappedNotes[i].split('\t');
    }
    var max = mappedNotes[0].length;
    for (var i = 1; i < mappedNotes.length; i++) {
        var l = mappedNotes[i].length;
        if (l > max) { max = l; }
    }
    //make all lines equal length
    for (var i = 0; i < mappedNotes.length; i++) {
        var difference = max - mappedNotes[i].length;
        if(difference > 0){
            mappedNotes[i] = mappedNotes[i].concat(new Array(difference).fill(''));
        }
    }
    //get first octave
    var octaves = new Array(max).fill('');
    var octave;
    for(var i = 0; i < mappedNotes.length; i++){
        var note = mappedNotes[i][0];
        if(note !== ''){
            octave = note[note.length - 1];
            break;
        }
    }
    for(var i = 0; i < max; i++){
        var newOctave = false;
        for(var i2 = 0; i2 < mappedNotes.length; i2++){
            var note = mappedNotes[i2][i];
            if(note !== ''){
                currentOctave = note[note.length - 1];
                mappedNotes[i2][i] = note.substring(0, note.length - 1);
                if(currentOctave !== octave){
                    newOctave = true;
                    octave = currentOctave;
                }
            }
        }
        if(newOctave){
            octaves.splice(i, 0, octave)
            for(var i2 = 0; i2 < mappedNotes.length; i2++){
                mappedNotes[i2].splice(i, 0, '|')
            }
            i++;
            max++;
        }
        else{
            octaves.push('');
        }
    }
    mappedNotes = [octaves].concat(mappedNotes);
    for(var i = 0; i < mappedNotes.length; i++){
        mappedNotes[i] = mappedNotes[i].join('\t');
    }
    return mappedNotes.join('\n');
}

function split(mappedNotes, splitInterval){
    mappedNotes = mappedNotes.split('\n');
    for(var i = splitInterval; i < mappedNotes.length; i += splitInterval){
        mappedNotes.splice(i, 0, mappedNotes[0]);
        mappedNotes.splice(i, 0, '');
        i += 2;
    }
    return mappedNotes.join('\n');
}

function squeeze(mappedNotes) {
    var chunks = mappedNotes.split('\n\n');
    for (var i = 0; i < chunks.length; i++) {
        var lines = chunks[i].split('\n');
        for (var i2 = 0; i2 < lines.length; i2++) {
            lines[i2] = lines[i2].split('\t');
        }
        var max = lines[0].length;
        for (var i2 = 1; i2 < lines.length; i2++) {
            var l = lines[i2].length;
            if (l > max) { max = l; }
        }
        var toPop = [];
        for (var i2 = 0; i2 < max; i2++) {
            for (var i3 = 0; i3 < lines.length; i3++) {
                if (i2 < lines[i3].length && lines[i3][i2] !== '') { break; }
                if (i3 == lines.length - 1) { toPop.push(i2); }
            }
        }
        for (var i2 = 0; i2 < toPop.length; i2++) {
            for (var i3 = 0; i3 < lines.length; i3++) {
                lines[i3].splice(toPop[i2] - i2, 1);
            }
        }
        for (var i2 = 0; i2 < lines.length; i2++) {
            lines[i2] = lines[i2].join('\t');
        }
        chunks[i] = lines.join('\n');
    }
    return chunks.join('\n\n\n');
}

function mapNotes(sortedGroupedNoteNumbers) {
    var uniqueNoteNumbers = [];
    for (var i = 0; i < sortedGroupedNoteNumbers.length; i++) {
        for (var i2 = 0; i2 < sortedGroupedNoteNumbers[i].length; i2++) {
            uniqueNoteNumbers[sortedGroupedNoteNumbers[i][i2].toString()] = true;
        }
    }
    uniqueNoteNumbers = Object.keys(uniqueNoteNumbers);
    for (var i = 0; i < uniqueNoteNumbers.length; i++) {
        uniqueNoteNumbers[i] = parseInt(uniqueNoteNumbers[i]);
    }
    uniqueNoteNumbers.sort();
    var uniqueNoteNumbersMap = [];
    for (var i = 0; i < uniqueNoteNumbers.length; i++) {
        uniqueNoteNumbersMap[uniqueNoteNumbers[i].toString()] = i;
    }
    var notes = '';
    var lastIndex;
    for (var i = 0; i < sortedGroupedNoteNumbers.length; i++) {
        lastIndex = 0;
        for (var i2 = 0; i2 < sortedGroupedNoteNumbers[i].length; i2++) {
            var note = numberToNote(sortedGroupedNoteNumbers[i][i2]);
            notes += '\t'.repeat(uniqueNoteNumbersMap[sortedGroupedNoteNumbers[i][i2].toString()] - lastIndex) + note;
            lastIndex = uniqueNoteNumbersMap[sortedGroupedNoteNumbers[i][i2].toString()];
        }
        notes += '\n';
    }
    return removeOctaveNumbers(squeeze(notes));
}

function convertMidiJSONToSortedGroupedNoteNumbers(json, groupDuration) {
    var notes = JSON.parse(json).tracks[0].notes;
    var time = notes[0].time + groupDuration;
    var groupedNotes = [[noteToNumber(notes[0].name)]];
    var groupI;
    for (var i = 1; i < notes.length; i++) {
        groupI = groupedNotes.length - 1;
        var number = noteToNumber(notes[i].name);
        if (notes[i].time < time) {
            groupedNotes[groupI].push(number);
        }
        else {
            time = notes[i].time + groupDuration;
            groupedNotes[groupI].sort();
            groupedNotes.push([]);
            groupedNotes[groupedNotes.length - 1].push(number);
        }
    }
    groupedNotes[groupI].sort();
    return mapNotes(groupedNotes);
}

function linkConverter(buttonId, jsonId, groupDurationId, outputId) {
    document.getElementById(buttonId).onclick = function () {
        document.getElementById(outputId).value = convertMidiJSONToSortedGroupedNoteNumbers(document.getElementById(jsonId).value, parseFloat(document.getElementById(groupDurationId).value));
    };
}

function linkSqueezer(buttonId, inputId, splitIntervalId) {
    document.getElementById(buttonId).onclick = function () {
        document.getElementById(inputId).value = squeeze(split(document.getElementById(inputId).value, parseInt(document.getElementById(splitIntervalId).value)));
    };
}

linkConverter('buttonConvert', 'input', 'groupDuration', 'output');
linkSqueezer('buttonSqueeze', 'output', 'splitInterval');