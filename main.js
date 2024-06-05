AsciiMorph = (function() {
    var element = null;
    var canvasDimensions = {};
    var renderedData = [];
    var framesToAnimate = [];
    var myTimeout = null;
  
    function extend(target, source) {
        for (var key in source) {
            if (!(key in target)) {
            target[key] = source[key];              
            }
        }
        return target;
    }
      
    function repeat(pattern, count) {
        if (count < 1) return '';
        var result = '';
        while (count > 1) {
            if (count & 1) result += pattern;
            count >>= 1, pattern += pattern;
        }
        return result + pattern;
    }
      
    function replaceAt(string, index, character ) {
        return string.substr(0, index) + character + string.substr(index+character.length);
    }
  
    function init(el, canvasSize) {
        element = el;
        canvasDimensions = canvasSize;
    }
      
    function squareOutData(data) {
        var i;
        var renderDimensions = {
            x: 0,
            y: data.length
        };
    
        for( i = 0; i < data.length; i++ ) {
            if( data[i].length > renderDimensions.x) {
            renderDimensions.x = data[i].length
            }
        }
    
        for( i = 0; i < data.length; i++ ) {
            if( data[i].length < renderDimensions.x) {
            data[i] = (data[i] + repeat(' ', renderDimensions.x - data[i].length ));
            }
        }
    
        var paddings = {
            x: Math.floor((canvasDimensions.x - renderDimensions.x) / 2),
            y: Math.floor((canvasDimensions.y - renderDimensions.y) / 2)
        }
    
        for( var i = 0; i < data.length; i++ ) {
            data[i] = repeat(' ', paddings.x) + data[i] + repeat(' ', paddings.x);
        }
    
        for( var i = 0; i < canvasDimensions.y; i++ ) {
            if( i < paddings.y) {
            data.unshift( repeat(' ', canvasDimensions.x));
            } else if (i > (paddings.y + renderDimensions.y)) {
            data.push( repeat(' ', canvasDimensions.x));
            }
        }
        return data;
    }
  
    function getMorphedFrame(data) {
        var firstInLine, lastInLine = null;
        var found = false;
    
        for( var i = 0; i < data.length; i++) {
            var line = data[i];
            firstInLine = line.search(/\S/);
            if( firstInLine === -1) {
            firstInLine = null;
            }
            for( var j = 0; j < line.length; j++) {
            if( line[j] != ' ') {
                lastInLine = j;
            }
            }
            if( firstInLine !== null && lastInLine !== null) {
            data = crushLine(data, i, firstInLine, lastInLine)
            found = true;
            }
            firstInLine = null, lastInLine = null;
        }
        if( found ) {
            return data;
        } else {
            return false;
        }
    }
    function crushLine(data, line, start, end) {
        var centers = {
            x: Math.floor(canvasDimensions.x / 2),
            y: Math.floor(canvasDimensions.y / 2)
        }
        var crushDirection = 1;
        if( line > centers.y ) {
            crushDirection = -1;
        }
        var charA = data[line][start];
        var charB = data[line][end];
        data[line] = replaceAt(data[line], start, " ");
        data[line] = replaceAt(data[line], end, " ");
    
        if( !((end - 1) == (start + 1)) && !(start === end) && !((start + 1) === end)) {
            data[line + crushDirection] = replaceAt(data[line + crushDirection], (start + 1), '+*/\\'.substr(Math.floor(Math.random()*'+*/\\'.length), 1));
            data[line + crushDirection] = replaceAt(data[line + crushDirection], (end - 1), '+*/\\'.substr(Math.floor(Math.random()*'+*/\\'.length), 1));
        } else if ((((start === end) || (start + 1) === end)) && ((line + 1) !== centers.y && (line - 1) !== centers.y && line !== centers.y)) {
            data[line + crushDirection] = replaceAt(data[line + crushDirection], (start), '+*/\\'.substr(Math.floor(Math.random()*'+*/\\'.length), 1));
            data[line + crushDirection] = replaceAt(data[line + crushDirection], (end), '+*/\\'.substr(Math.floor(Math.random()*'+*/\\'.length), 1));
        }
        return data;
    }
  
    function render(data) {
        var ourData = squareOutData(data.slice());
        renderSquareData(ourData);
    }
  
    function renderSquareData(data) {
        element.innerHTML = '';
        for( var i = 0; i < data.length; i++ ) {
            element.innerHTML = element.innerHTML + data[i] + '\n';
        }
        
        renderedData = data;
    }
  
    function morph(data) {
        clearTimeout(myTimeout);
        var frameData = prepareFrames(data.slice());
        animateFrames(frameData);
    }
      
    function prepareFrames(data) {
        var deconstructionFrames = [];
        var constructionFrames = [];
        var clonedData = renderedData
        
        for(var i = 0; i < 100; i++) {
            var newData = getMorphedFrame(clonedData);
            if( newData === false) {
            break;
            }
            deconstructionFrames.push(newData.slice(0)); 
            clonedData = newData;
        }
    
        var squareData = squareOutData(data);
        constructionFrames.unshift(squareData.slice(0));
        for( var i = 0; i < 100; i++ ) {
            var newData = getMorphedFrame(squareData);
            if( newData === false) {
            break;
            }
            constructionFrames.unshift(newData.slice(0));
            squareData = newData;
        }
        
        return deconstructionFrames.concat(constructionFrames)
    }
      
    function animateFrames(frameData) {
        framesToAnimate = frameData;
        animateFrame();
    }
      
    function animateFrame() {
        myTimeout = setTimeout(function() {
            
            renderSquareData(framesToAnimate[0]);
            framesToAnimate.shift();
            if( framesToAnimate.length > 0 ) {
            animateFrame();
            }
        }, 20)
    }
    
    function main(element, canvasSize) {
      
        if( !element || !canvasSize ) {
            console.log("sorry, I need an element and a canvas size");
            return;   
        }
        
        init(element, canvasSize);
    }
    
    return extend(main, {
        render: render,
        morph: morph
    });
    
})();

var element = document.querySelector('pre');
AsciiMorph(element, {x: 42,y: 28});
    
var asciis = [
    [
    "                          _      _",
    "                         (_)    | |",
    " ___  __ ___   ____ _ ___ _  ___| | __",
    "/ __|/ _` \\ \\ / / _` / __| |/ __| |/ /",
    "\\__ \\ (_| |\\ V / (_| \\__ \\ | (__|   <",
    "|___//\__,_| \\_/ \\__,_|___/_|\\___|_|\\_\\",
    ],
    [
    "         ____",
    "        o8%8888,",
    "      o88%8888888.",
    "     8'-    -:8888b",
    "    8'         8888",
    "   d8.-=. ,==-.:888b",
    "   >8 `~` :`~' d8888",
    "   88         ,88888",
    "   88b. `-~  ':88888",
    "   888b ~==~ .:88888",
    "   88888o--:':::8888",
    "   `88888| :::' 8888b",
    "   8888^^'       8888b",
    "  d888           ,%888b.",
    " d88%            %%%8--'-.",
    "/88:.__ ,       _%-' ---  -",
    "    '''::===..-'   =  --.  `",
    ],
    [
    "cddddddddddddddddddddddddddddddddddddddddddd;",
    "0Мо..........':1dk00KKXXKK0kxoc,..........kMd",
    "0Ml......;dOWMMMMMMMMMMMMMMMMMMMWKx:......kMd",
    "0Ml...cOWMMMMMMMMMMMMMMMMMMMMMMMMMMMWO:...kMd",
    "0Ml.lNMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMNc.kMd",
    "0MdkMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMM0OMd",
    "0MMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMd",
    "0MxcxWMMMMMNXXNMMMMMMMMMMMMMMMNXXNMMMMMWkcKMd",
    "0Md..lMKo,.,'...:kWMMMMMMMNx;...',.;dXMl.'XMd",
    "0Mx'.,0;dXMMMXl....:dWMNo;....oXMMMKd;0,.;KMd",
    "0MO;.,NMWMMMMMMWk;...XMK...:OWMMMMMMWMN,.cNMd",
    "0MxxNMX;KMMKdcclkWN0WMMMN0WNxc:lxXMMk;WMXdKMd",
    "0MMMMMO;MMl.......KMxOMNkMk.......xMM.NMMMMMd",
    "OMMMMMMXKoclddl;.oWMdkMN,MN:.:ldolcdXNMMMMMMd",
    "OMMMMMMWXMMMMMMMW0KdoNMMdox0MMMMMMMMXMMMMMMMd",
    "OMMMMXc'WMMMMMMMMkcWMMMMMMkCMMMMMMMMN'lXMMMMd",
    "OMMMd..cMMMMMMMMNdoKMMMMM0x:XMMMMMMMM:..kMMMd",
    "OMMO....doKKOd:.....cOKx'.....:d0NX0l....NMMd",
    "0MM).....................................WMMd",
    "0Mdkc...................................0kOMd",
    "0Ml.:Ol;.......';;.......;,.........':oX:.kMd",
    "0Ml..,WMMMMWWWo...';;:c::;'...:WWMMMMMW;..kmd",
    "0Ml...dMMMMMMMMKl...........c0MMMMMMMMd...kMd",
    "0Ml...cMMMMMMMMMMMXOxdddk0NMMMMMMMMMMM'...dMd",
    "0ML....KMMMMMMMMMMMMMMMMMMMMMMMMMMMMMO....kMd",
    "0ML.....OMMMMMMMMMMMMMMMMMMMMMMMMMMMK.....kMd",
    "0Ml......:XMMMMMMMMMMMMMMMMMMMMMMMNl......kMd",
    "0Ml........lXMMMMMMMMMMMMMMMMMMMKc........kMd",
    "0Ml..........:KMMMMMMMMMMMMMMMM0,.........kMd",
    "oO:............xOOOx:'';dOOOOd............lOc",
    ],
    [
    " _______",
    "< hello >",
    " -------",
    "        \\   ^__^",
    "         \\  (oo)\\_______",
    "            (__)\\       )\\/\\",
    "                ||----w |",
    "                ||     ||",
    ],
    [
    "       __H__",
    " ___ ___[']_____ ___ ___",
    "|_ -| . [']     | .'| . |",
    "|___|_  [\"]_|_|_|__,|  _|",
    "      |_|V...       |_|"
    ],
    [
    "    cDc ",
    "   _   _",
    "  ((___))",
    "  [ x x ]",
    "   \\   / ",
    "   (' ')",
    "    (U)"
    ],
    [
    "      ____",
    "     |    |",
    "     |____|",
    "    _|____|_",
    "     /  ee`.",
    "   .<     __O",
    "  /\\ \\.-.' \\",
    " J  `.|`.\\/ \\",
    " | |_.|  | | |",
    "  \\__.'`.|-' /",
    "  L   /|o`--'\\",
    "  |  /\\/\\/\\   \\",
    "  J /      `.__\\",
    "  |/         /  \\",
    "   \\      .'`.",
    " ____)_/\\_(___\\",
    "(___._/  \\_.___)"
    ],
    [
    " 8 8 8 8                     ,ooo.",
    " 8a8 8a8                    oP   ?b",
    "d888a888zzzzzzzzzzzzzzzzzzzz8     8b",
    " `\"\"^\"\"'                    ?o___oP'"
    ],
    [
    "     .--------.",
    "    / .------. \\",
    "   / /        \\ \\",
    "   | |        | |",
    "  _| |________| |_",
    ".' |_|        |_| '.",
    "'._____ ____ _____.'",
    "|     .'____'.     |",
    "'.__.'.'    '.'.__.'",
    "'.__  |      |  __.'",
    "|   '.'.____.'.'   |",
    "'.____'.____.'____.'",
    "'.________________.'",
    ],
    [
    "                 .&.",
    "                 7@P",
    "                 B@@~",
    "                J@@@&..",
    "           .^?P&@@@@@@@@B7:",
    "         ~#@@@@@@@#@@@@@@@@@Y.",
    "       !&@@@&?Y@@G G@@#^Y#@@@@P.   .^?^",
    "      G@@@P:  &@@:  &@@J  :B@@@@&&@&G7.",
    "     #@@&:   #@@Y   .&@@55#@@@@@@&?.",
    "    G@@@^   7@@&::!5B@@@@@&GJ^&@@!",
    "   ^@@@G .~J@@@@@@@@&B#@@@^   &@@7",
    "   .@@@&&@@@@@@Y~^.    5@@&  .@@@~",
    "  .Y@@@@&&@@@&.        .@@@7 G@@@.",
    "J#@&B@@@!Y@@@.          ^@@@B@@@7",
    "^:   ?@@@@@@G            Y@@@@&!",
    "       7&@@@@&GY~:...:~?B@@@@@?",
    "        G@G~G@@@@@@@@@@@@#J?&@B",
    "       .@#     .^!!77!~:    .#@~",
    "        ~.                    ^.",
    ],
    [
    "            ______",
    "       .d$$$******$$$$c.",
    "    .d$P\"            \"$$c",
    "   $$$$$.           .$$$*$.",
    " .$$ 4$L*$$.     .$$Pd$  '$b ",
    " $F   *$. \"$$e.e$$\" 4$F   ^$b",
    "d$     $$   z$$$e   $$     '$.",
    "$P     `$L$$P` `\"$$d$\"      $$",
    "$$     e$$F       4$$b.     $$",
    "$b  .$$\" $$      .$$ \"4$b.  $$",
    "$$e$P\"    $b     d$`    \"$$c$F",
    "'$P$$$$$$$$$$$$$$$$$$$$$$$$$$",
    " \"$c.      4$.  $$       .$$",
    "  ^$$.      $$ d$\"      d$P",
    "    \"$$c.   `$b$F    .d$P\"",
    "      `4$$$c.$$$..e$$P\"",
    "          `^^^^^^^`",
    ],
    [
    "      ||||||||||||||",
    "     =              \\",
    "     =               |",
    "    _=            ___/",
    "   / _\           (o)\\",
    "  | | \            _  \\",
    "  | |/            (____)",
    "   \__/          /   |",
    "    /           /  ___)",
    "   /    \\       \\    _)                       )",
    "  \\      \\           /                       (",
    "\\/ \\      \\_________/   |\\_________________,_ )",
    " \\/ \\      /            |     ==== _______)__)",
    "  \\/ \\    /           __/___  ====_/",
    "   \\/ \\  /           (O____)\\\\_(_/",
    "                    (O_ ____)",
    "                     (O____)",
    ],
    [
    "                _ooOoo_",
    "               o8888888o",
    "               88\" . \"88",
    "               (| -_- |)",
    "               O\\  =  /O",
    "            ____/`---'\\____",
    "          .'  \\\\|     |//  `.",
    "         /  \\\\|||  :  |||//  \\",
    "        /  _||||| -:- |||||_  \\",
    "        |   | \\\\\\  -  /'| |   |",
    "        | \\_|  `\\`---'//  |_/ |",
    "        \\  .-\\__ `-. -'__/-.  /",
    "      ___`. .'  /--.--\\  `. .'___",
    "   .\"\" '<  `.___\\_<|>_/___.' _> \\\"\".",
    "  | | :  `- \\`. ;`. _/; .'/ /  .' ; |",
    "  \\  \\ `-.   \\_\\_`. _.'_/_/  -' _.' /",
    "===`-.`___`-.__\\ \\___  /__.-'_.'_.-'===",
    "                `=--=-'    "
]];

AsciiMorph.render(asciis[0]);

var currentIndex = 2;

setTimeout(function() {
    AsciiMorph.morph(asciis[1]);
}, 1000);

setInterval(function() {
    AsciiMorph.morph(asciis[currentIndex]);
    currentIndex++;
    currentIndex%= asciis.length;
}, 3000);
