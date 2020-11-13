
/**
 * Returns array of matched regex results from the array
 * of string lines and the supplied regex
 * 
 * @param {Array<String>} lines 
 * @param {RegExp} rgx 
 * @return {Array<RegExpMatchArray>}
 */
function getMatchesFromLines(lines, rgx){
    let matches = [];
    for (let line of lines) {
        let match = line.match(rgx);
        if (match) {
            matches.push(match.groups);
        }
    }
    return matches;
}

/**
 * Returns array of matched lines from the supplied
 * string in a CSV format
 * 
 * @param {String} txt 
 * @return {Array<RegExpMatchArray>}
 */
function getMatchesFromCSV(txt){
    let attendanceLines = txt.split(/\r?\n/);
    let rgx = /(?<day>^\d\d). (?<month>[^\ ]+) (?<year>[^\ ]+) \[(?<dayOfWeek>[^\]]+)\];(?<type>[^;]+);(?:[^;]+);(?<start>[^;]+);(?:[^;]+);(?<end>[^;\ ]+).*;(?<duration>[^;]+)/

    return getMatchesFromLines(attendanceLines, rgx);
}

/**
 * Returns array of matched lines from the supplied
 * string in a HTML format
 * 
 * @param {String} html 
 * @return {Array<RegExpMatchArray>}
 */
function getMatchesFromHTML(html){
    html = html.replace(/\r?\n/g, "");
    let attendanceLines = html.match(/<tr>[\S\n\s]*?<\/tr>/gm);
    let rgx = /<tr>\s*?<td>(?<day>\d\d). (?<month>[^\ ]+) (?<year>[^\ ]+) \[(?<dayOfWeek>[^\]]*)]<\/td>\s*<td>(?<type>[^<]*)<\/td>\s*<td><\/td>\s*<td>(?<start>[^<]*)<\/td>\s*<td><\/td>\s*<td>(?<end>[^<]*)<\/td>\s*<td>(?<duration>[^<]*).*?<\/tr>/

    return getMatchesFromLines(attendanceLines, rgx);
}

