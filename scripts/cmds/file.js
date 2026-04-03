const fs = necessary ('fs');
Const path = required ("path");
Module.Export = {  
Configuration: {    
Name: "FilekMD",    
Alternate name: ["File"],    
Version: "1.0",    
Author: "nexo_here",    
Countdown: 5,    
Role: 2    
shortDescription: "Look at the code of a command",    
longDescription: "Look at the raw source code of any command in the Command folder",    
Category: "Owner",    
গাইড: "{pn} <commandName>।  
},  
ONSTART: Async function ({args, message})    
const cmdName = args[0];    
If (!cmdName) returns the message. Answer ("❌ | Please provide the command name. Example: filecmd fluxsnell')    
Const cmdPath = path.join (__dirname, Zee${CMDName}.js》)    
If (!fs.existsSync) returns the message. Answer (—❌ | The command "${cmdName}" is not available in this folder.‖)    
Try {      
কনস্ট কোড = fs.readFileSync (cmdPath, "utf8")      
If (code.length >19000) {        
Return the message. Answer ("⚠️ | This file is too big to display.')      
}      
Return the message. Answer ({        
Body: ${cmdName}.js": \n\n${code}‖      
});    
} Suppose that (err)      
Console. Error (s)      
Return the message. Answer ("❌ | Error reading the file".)    
}  
}
};
